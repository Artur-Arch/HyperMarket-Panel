import React, { useState, useEffect, useCallback } from 'react';
import { Package, TrendingUp, TrendingDown, AlertTriangle, RefreshCw, Calendar, BarChart3, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Notification component
const Notification = ({ message, type = 'error', onClose }) => (
  <div className="fixed top-6 right-6 z-50 bg-white p-4 rounded-xl shadow-lg border border-gray-200 max-w-md transform transition-all duration-300 ease-in-out">
    <div className="flex items-center gap-3">
      <div className={`p-1 rounded-full ${type === 'error' ? 'bg-red-100' : 'bg-green-100'}`}>
        <AlertTriangle className={`w-4 h-4 ${type === 'error' ? 'text-red-600' : 'text-green-600'}`} />
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [kirimCount, setKirimCount] = useState(0);
  const [chiqimCount, setChiqimCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const API_URL = 'https://suddocs.uz';

  // Formatting functions for consistency with Chiqim
  const formatQuantity = (qty) => qty === undefined || qty === null ? "Noma'lum" : new Intl.NumberFormat('uz-UZ').format(qty) + ' dona';
  const formatPrice = (price) => price === undefined || price === null ? "Noma'lum" : new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';

  // Fetch with authentication, matching Branches component
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
      throw new Error(`Failed to fetch ${url}`);
    }

    return response;
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch products
      const productsRes = await fetchWithAuth(`${API_URL}/products`);
      const productsData = await productsRes.json();
      setProducts(productsData);

      // Fetch transactions
      const transactionsRes = await fetchWithAuth(`${API_URL}/transactions`);
      const transactionsData = await transactionsRes.json();

      // Filter transactions for today
      const today = new Date().toISOString().slice(0, 10);
      const todayTx = transactionsData.filter(tx => 
        tx.createdAt && tx.createdAt.startsWith(today)
      );
      setTransactions(todayTx);

      // Count kirim and chiqim based on inflow/outflow
      const kirim = todayTx.filter(tx => tx.inflow > 0).length;
      const chiqim = todayTx.filter(tx => tx.outflow > 0).length;
      setKirimCount(kirim);
      setChiqimCount(chiqim);
    } catch (error) {
      console.error('Ma\'lumotlarni yuklashda xatolik:', error);
      setNotification({ message: error.message || 'Ma\'lumotlarni yuklashda xatolik yuz berdi', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const lowStockItems = products
    .filter(p => p.quantity <= 5 && p.quantity > 0)
    .map(p => ({
      name: p.name,
      stock: p.quantity,
      minStock: 5
    }));

  const stats = [
    {
      title: 'Jami tovarlar',
      value: products.length.toString(),
      change: '+0%',
      changeType: 'positive',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Kunlik kirim',
      value: kirimCount.toString(),
      change: '+0%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Kunlik chiqim',
      value: chiqimCount.toString(),
      change: '+0%',
      changeType: 'negative',
      icon: TrendingDown,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Kam qolgan',
      value: lowStockItems.length.toString(),
      change: 'Alert',
      changeType: 'warning',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Umumiy ma'lumotlar va statistika</p>
            </div>
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-gray-700">Yangilash</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      stat.changeType === 'positive' ? 'bg-green-100 text-green-700' :
                      stat.changeType === 'negative' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              Kam qolgan tovarlar
              <span className="ml-3 px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                {lowStockItems.length}
              </span>
            </h3>
            <div className="space-y-4">
              {lowStockItems.length > 0 ? lowStockItems.map((item, index) => (
                <div key={index} className="p-4 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition-colors duration-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-red-600 font-medium bg-red-200 px-2 py-1 rounded-lg">
                        {formatQuantity(item.stock)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-red-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((item.stock / item.minStock) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Minimal: {formatQuantity(item.minStock)}</p>
                </div>
              )) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-gray-600 font-medium">Barcha tovarlar yetarli miqdorda</p>
                  <p className="text-sm text-gray-500 mt-1">Hech qanday tovar kam qolmagan</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Today's Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                Bugungi tranzaksiyalar
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString('uz-UZ')}
              </div>
            </div>
            <div className="overflow-x-auto">
              {transactions.length > 0 ? (
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 w-[80px]">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 w-[200px]">Tovar</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 w-[150px]">Filial</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 w-[100px]">Turi</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 w-[100px]">Soni</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 w-[150px]">Narx</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 w-[150px]">Jami</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 w-[200px]">Sana</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-200">
                        <td className="py-3 px-4">
                          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            #{t.id}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">{t.product?.name || t.name || '—'}</td>
                        <td className="py-3 px-4 text-gray-600">{t.branch?.name || '—'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            t.inflow > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {t.inflow > 0 ? 'Kirim' : 'Chiqim'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{formatQuantity(t.quantity)}</td>
                        <td className="py-3 px-4 text-gray-600">{formatPrice(t.price)}</td>
                        <td className="py-3 px-4 text-gray-600">{formatPrice(t.total)}</td>
                        <td className="py-3 px-4 text-gray-500 text-sm">
                          {t.createdAt ? new Date(t.createdAt).toLocaleString('uz-UZ') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Tranzaksiyalar yo'q</h4>
                  <p className="text-gray-600">Bugun hali hech qanday tranzaktsiya amalga oshirilmagan</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
      </div>
    </div>
  );
};

export default Dashboard;