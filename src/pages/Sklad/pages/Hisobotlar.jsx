import React, { useState, useEffect, useCallback } from 'react';
import { Package, Activity, DollarSign, FileText, Download, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Notification component
const Notification = ({ message, type = 'error', onClose }) => (
  <div className="fixed top-6 right-6 z-50 bg-white p-4 rounded-xl shadow-lg border border-gray-200 max-w-md transform transition-all duration-300 ease-in-out">
    <div className="flex items-center gap-3">
      <div className={`p-1 rounded-full ${type === 'error' ? 'bg-red-100' : 'bg-green-100'}`}>
        <BarChart3 className={`w-4 h-4 ${type === 'error' ? 'text-red-600' : 'text-green-600'}`} />
      </div>
      <span className="text-gray-800 font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
      >
        ×
      </button>
    </div>
  </div>
);

const Hisobotlar = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedChart, setSelectedChart] = useState('category');
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const API_URL = 'https://suddocs.uz';

  // Formatting functions
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  const formatQuantity = (qty) => (qty === undefined || qty === null ? "Noma'lum" : new Intl.NumberFormat('uz-UZ').format(qty) + ' dona');

  // Calculate date range for selected period
  const getDateRange = () => {
    const today = new Date();
    const ranges = {
      week: new Date(today.setDate(today.getDate() - 7)).toISOString().slice(0, 10),
      month: new Date(today.setDate(today.getDate() - 30)).toISOString().slice(0, 10),
      quarter: new Date(today.setDate(today.getDate() - 90)).toISOString().slice(0, 10),
      year: new Date(today.setDate(today.getDate() - 365)).toISOString().slice(0, 10),
    };
    return ranges[selectedPeriod] || ranges.month;
  };

  // Fetch with authentication
  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      throw new Error('No token found. Please login again.');
    }

    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      navigate('/login');
      throw new Error('Unauthorized: Session expired. Please login again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch ${url}`);
    }

    return response;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch products
      const productsResponse = await fetchWithAuth(`${API_URL}/products`);
      const productsData = await productsResponse.json();
      setProducts(productsData);

      // Fetch transactions
      const transactionsResponse = await fetchWithAuth(`${API_URL}/transactions`);
      const transactionsData = await transactionsResponse.json();
      setTransactions(transactionsData);

      setNotification(null);
    } catch (err) {
      console.error("Ma'lumotlarni yuklashda xatolik:", err);
      setNotification({ message: err.message || "Ma'lumotlarni yuklashda xatolik yuz berdi", type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate metrics from transactions data
  const calculateMetrics = () => {
    if (!transactions.length) return { totalRevenue: 0, totalProducts: 0, totalItems: 0, averagePrice: 0 };

    const dateRangeStart = getDateRange();
    const filteredTransactions = transactions.filter(
      (tx) => tx.outflow > 0 && tx.createdAt && tx.createdAt >= dateRangeStart
    );

    const totalRevenue = filteredTransactions.reduce((sum, tx) => sum + (tx.total || tx.price * tx.quantity), 0);
    const totalProducts = filteredTransactions.reduce((sum, tx) => sum + tx.quantity, 0);
    const totalItems = new Set(filteredTransactions.map((tx) => tx.productId)).size;
    const averagePrice = totalProducts ? totalRevenue / totalProducts : 0;

    return { totalRevenue, totalProducts, totalItems, averagePrice };
  };

  // Generate top products from transactions
  const getTopProducts = () => {
    if (!transactions.length) return [];

    const dateRangeStart = getDateRange();
    const productMap = {};
    transactions
      .filter((tx) => tx.outflow > 0 && tx.createdAt && tx.createdAt >= dateRangeStart)
      .forEach((tx) => {
        const productId = tx.productId;
        if (!productMap[productId]) {
          productMap[productId] = {
            name: tx.product?.name || "Noma'lum",
            sales: 0,
            revenue: 0,
            category: tx.product?.category?.name || "Kategoriya yo'q",
            branch: tx.branch?.name || "Filial yo'q",
          };
        }
        productMap[productId].sales += tx.quantity;
        productMap[productId].revenue += tx.total || tx.price * tx.quantity;
      });

    return Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  // Generate products by category
  const getProductsByCategory = () => {
    if (!transactions.length) return [];

    const dateRangeStart = getDateRange();
    const categoryMap = {};
    transactions
      .filter((tx) => tx.outflow > 0 && tx.createdAt && tx.createdAt >= dateRangeStart)
      .forEach((tx) => {
        const categoryName = tx.product?.category?.name || 'Boshqa';
        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = { name: categoryName, count: 0, totalValue: 0 };
        }
        categoryMap[categoryName].count += tx.quantity;
        categoryMap[categoryName].totalValue += tx.total || tx.price * tx.quantity;
      });

    return Object.values(categoryMap).sort((a, b) => b.totalValue - a.totalValue);
  };

  // Generate products by branch
  const getProductsByBranch = () => {
    if (!transactions.length) return [];

    const dateRangeStart = getDateRange();
    const branchMap = {};
    transactions
      .filter((tx) => tx.outflow > 0 && tx.createdAt && tx.createdAt >= dateRangeStart)
      .forEach((tx) => {
        const branchName = tx.branch?.name || 'Boshqa';
        if (!branchMap[branchName]) {
          branchMap[branchName] = { name: branchName, count: 0, totalValue: 0 };
        }
        branchMap[branchName].count += tx.quantity;
        branchMap[branchName].totalValue += tx.total || tx.price * tx.quantity;
      });

    return Object.values(branchMap).sort((a, b) => b.totalValue - a.totalValue);
  };

  const metrics = calculateMetrics();
  const topProducts = getTopProducts();
  const categoryData = getProductsByCategory();
  const branchData = getProductsByBranch();

  // Placeholder recent reports
  const recentReports = [
    { id: 1, name: 'Oylik sotuv hisoboti', date: '2024-01-31', type: 'PDF', size: '2.3 MB' },
    { id: 2, name: 'Inventar hisoboti', date: '2024-01-30', type: 'Excel', size: '1.8 MB' },
    { id: 3, name: 'Mijozlar hisoboti', date: '2024-01-29', type: 'PDF', size: '956 KB' },
    { id: 4, name: 'Moliyaviy hisobot', date: '2024-01-28', type: 'PDF', size: '3.2 MB' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Ma'lumotlar yuklanmoqda...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Hisobotlar va Analitika</h2>
            <p className="text-gray-600 mt-1">Biznes ko'rsatkichlari va ma'lumotlar tahlili</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Bu hafta</option>
              <option value="month">Bu oy</option>
              <option value="quarter">Bu chorak</option>
              <option value="year">Bu yil</option>
            </select>
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
              onClick={() => setNotification({ message: 'Eksport funksiyasi hali amalga oshirilmagan', type: 'error' })}
            >
              <Download className="w-4 h-4" />
              <span>Eksport</span>
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            {
              title: 'Jami daromad',
              value: formatCurrency(metrics.totalRevenue),
              icon: DollarSign,
              color: 'from-green-500 to-green-600',
              bgColor: 'bg-green-50',
              iconColor: 'text-green-600',
            },
            {
              title: 'Jami sotilganlar',
              value: formatQuantity(metrics.totalProducts),
              icon: Package,
              color: 'from-blue-500 to-blue-600',
              bgColor: 'bg-blue-50',
              iconColor: 'text-blue-600',
            },
            {
              title: 'Mahsulot turlari',
              value: metrics.totalItems.toString(),
              icon: Package,
              color: 'from-purple-500 to-purple-600',
              bgColor: 'bg-purple-50',
              iconColor: 'text-purple-600',
            },
            {
              title: "O'rtacha narx",
              value: formatCurrency(metrics.averagePrice),
              icon: Activity,
              color: 'from-orange-500 to-orange-600',
              bgColor: 'bg-orange-50',
              iconColor: 'text-orange-600',
            },
          ].map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${metric.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts and Top Products */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Category/Branch Chart */}
          <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedChart === 'category' ? "Kategoriyalar bo'yicha" : "Filiallar bo'yicha"}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedChart('category')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedChart === 'category' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Kategoriya
                </button>
                <button
                  onClick={() => setSelectedChart('branch')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedChart === 'branch' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Filial
                </button>
              </div>
            </div>
            <div className="h-80 overflow-y-auto">
              <div className="space-y-4">
                {(selectedChart === 'category' ? categoryData : branchData).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{formatQuantity(item.count)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(item.totalValue)}</p>
                      <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (item.totalValue /
                                Math.max(...(selectedChart === 'category' ? categoryData : branchData).map((d) => d.totalValue))) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Eng ko'p sotilgan tovarlar</h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-600">{formatQuantity(product.sales)}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm">{formatCurrency(product.revenue)}</p>
                    <p className="text-xs text-gray-500">{product.branch}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Oxirgi hisobotlar</h3>
            <button
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              onClick={() => setNotification({ message: "Barcha hisobotlar funksiyasi hali amalga oshirilmagan", type: 'error' })}
            >
              Barcha hisobotlar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Hisobot nomi</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Sana</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Turi</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Hajmi</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-blue-500 mr-3" />
                        <span className="font-medium text-gray-900">{report.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{report.date}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.type === 'PDF' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {report.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{report.size}</td>
                    <td className="py-4 px-4">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                        onClick={() => setNotification({ message: 'Yuklab olish funksiyasi hali amalga oshirilmagan', type: 'error' })}
                      >
                        Yuklab olish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Products Summary */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Ombor holati</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-semibold">Jami mahsulotlar</p>
                  <p className="text-2xl font-bold text-blue-800">{products.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-semibold">Mavjud miqdor</p>
                  <p className="text-2xl font-bold text-green-800">{formatQuantity(products.reduce((sum, p) => sum + p.quantity, 0))}</p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 font-semibold">Jami qiymat</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {formatCurrency(products.reduce((sum, p) => sum + p.price * p.quantity, 0))}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
      </div>
    </div>
  );
};

export default Hisobotlar;