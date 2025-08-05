import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Package, Building, Tag, AlertCircle, Loader2, Search, Filter, Grid, List, Save, X, TrendingDown, DollarSign, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Notification component
const Notification = ({ message, type = 'error', onClose }) => (
  <div className="fixed top-6 right-6 z-50 bg-white p-4 rounded-xl shadow-lg border border-gray-200 max-w-md transform transition-all duration-300 ease-in-out">
    <div className="flex items-center gap-3">
      <div className={`p-1 rounded-full ${type === 'error' ? 'bg-red-100' : 'bg-green-100'}`}>
        <AlertCircle className={`w-4 h-4 ${type === 'error' ? 'text-red-600' : 'text-green-600'}`} />
      </div>
      <span className="text-gray-800 font-medium">{message}</span>
      <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600 transition-colors">
        ×
      </button>
    </div>
  </div>
);

// Product card component
const ProductCard = ({ product, onEdit, onDelete, onDispatch }) => {
  const formatPrice = (price) =>
    price === undefined || price === null
      ? "Noma'lum"
      : new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

  const formatQuantity = (qty) =>
    qty === undefined || qty === null ? "Noma'lum" : new Intl.NumberFormat('uz-UZ').format(qty) + " dona";

  const getStockStatus = (quantity) => {
    if (quantity === undefined || quantity === null) return { label: "Noma'lum", color: 'bg-gray-100 text-gray-600', icon: '?' };
    if (quantity === 0) return { label: "Tugagan", color: 'bg-red-100 text-red-700', icon: '!' };
    if (quantity < 5) return { label: "Kam qolgan", color: 'bg-yellow-100 text-yellow-700', icon: '⚠' };
    if (quantity < 20) return { label: "O'rtacha", color: 'bg-blue-100 text-blue-700', icon: '📦' };
    return { label: "Ko'p", color: 'bg-green-100 text-green-700', icon: '✓' };
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'in_store':
        return 'bg-green-100 text-green-700';
      case 'inactive':
      case 'sold':
        return 'bg-red-100 text-red-700';
      case 'pending':
      case 'in_warehouse':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const stockStatus = getStockStatus(product.quantity);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 group">
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg leading-tight">{product.name}</h3>
              <p className="text-sm text-gray-500 mt-1">#{product.id}</p>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building className="w-4 h-4" />
            <span>{product.branch?.name || "Noma'lum filial"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Tag className="w-4 h-4" />
            <span>{product.category?.name || "Noma'lum kategoriya"}</span>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-white border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
              <span>{stockStatus.icon}</span>
              {stockStatus.label}
            </span>
            {product.quantity !== undefined && (
              <span className="text-sm text-gray-500">({formatQuantity(product.quantity)})</span>
            )}
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(product.status)}`}>
            {product.status === 'IN_WAREHOUSE' ? "Skladda" :
             product.status === 'IN_STORE' ? "Do'konda" :
             product.status === 'SOLD' ? "Sotilgan" :
             product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : "Noma'lum"}
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-2">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
        >
          Tahrirlash
        </button>
        <button
          onClick={() => onDelete(product)}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
        >
          O'chirish
        </button>
        <button
          onClick={() => onDispatch(product)}
          disabled={product.quantity === 0}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            product.quantity === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
          }`}
        >
          Chiqim
        </button>
      </div>
    </div>
  );
};

// Transaction table row component
const TransactionRow = ({ transaction }) => {
  const formatQuantity = (qty) =>
    qty === undefined || qty === null ? "Noma'lum" : new Intl.NumberFormat('uz-UZ').format(qty) + " dona";

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
      <td className="p-4"><div className="font-medium text-gray-800">{transaction.product?.name || "Noma'lum"}</div></td>
      <td className="p-4"><div className="flex items-center gap-2"><Package className="w-4 h-4 text-gray-400" /><span className="text-gray-700 font-medium">{formatQuantity(transaction.inflow)}</span></div></td>
      <td className="p-4"><div className="flex items-center gap-2"><Package className="w-4 h-4 text-gray-400" /><span className="text-gray-700 font-medium">{formatQuantity(transaction.outflow)}</span></div></td>
    </tr>
  );
};

const TovarlarRoyxati = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editBranch, setEditBranch] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [dispatchQuantity, setDispatchQuantity] = useState('');
  const [dispatchPrice, setDispatchPrice] = useState('');
  const [dispatchBranch, setDispatchBranch] = useState('');
  const [dispatchStatus, setDispatchStatus] = useState('IN_STORE');
  const [editNameError, setEditNameError] = useState('');
  const [editPriceError, setEditPriceError] = useState('');
  const [dispatchQuantityError, setDispatchQuantityError] = useState('');
  const [dispatchPriceError, setDispatchPriceError] = useState('');
  const [dispatchBranchError, setDispatchBranchError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const API_URL = 'https://suddocs.uz';

  const statusOptions = [
    { value: 'IN_STORE', label: "Do'konda", color: 'text-green-600 bg-green-50' },
    { value: 'SOLD', label: 'Sotilgan', color: 'text-purple-600 bg-purple-50' },
    { value: 'IN_WAREHOUSE', label: 'Skladda', color: 'text-blue-600 bg-blue-50' },
  ];

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

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/products`);
      const data = await response.json();
      setProducts(data);
      setNotification(null);
    } catch (err) {
      console.error('Mahsulotlarni yuklashda xatolik:', err);
      setNotification({ message: err.message || 'Mahsulotlarni yuklashda xatolik yuz berdi', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const loadBranches = useCallback(async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}/branches`);
      const data = await response.json();
      setBranches(data);
    } catch (err) {
      console.error('Filiallar yuklashda xatolik:', err);
      setNotification({ message: err.message || 'Filiallar yuklashda xatolik', type: 'error' });
    }
  }, [navigate]);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/transactions`);
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      console.error('Tranzaksiyalarni yuklashda xatolik:', err);
      setNotification({ message: err.message || 'Tranzaksiyalarni yuklashda xatolik yuz berdi', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadProducts();
    loadBranches();
    loadTransactions();
  }, [loadProducts, loadBranches, loadTransactions]);

  const filteredProducts = useMemo(
    () => products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [products, searchTerm]
  );

  const stats = useMemo(
    () => ({
      total: products.length,
      active: products.filter((p) => p.status?.toLowerCase() === 'active' || p.status === 'IN_STORE').length,
      lowStock: products.filter((p) => p.quantity < 5 && p.quantity > 0).length,
      outOfStock: products.filter((p) => p.quantity === 0).length,
    }),
    [products]
  );

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditName(product.name);
    setEditPrice(product.price ? product.price.toString() : '0');
    setEditStatus(product.status || 'IN_STORE');
    setEditBranch(product.branchId ? product.branchId.toString() : '');
    setEditCategory(product.categoryId ? product.categoryId.toString() : '');
    setEditNameError('');
    setEditPriceError('');
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
    setEditName('');
    setEditPrice('');
    setEditStatus('');
    setEditBranch('');
    setEditCategory('');
    setEditNameError('');
    setEditPriceError('');
  };

  const openDispatchModal = (product) => {
    setSelectedProduct(product);
    setDispatchQuantity('');
    setDispatchPrice(product.price ? product.price.toString() : '0');
    setDispatchBranch('');
    setDispatchStatus('IN_STORE');
    setDispatchQuantityError('');
    setDispatchPriceError('');
    setDispatchBranchError('');
    setShowDispatchModal(true);
  };

  const closeDispatchModal = () => {
    setShowDispatchModal(false);
    setSelectedProduct(null);
    setDispatchQuantity('');
    setDispatchPrice('');
    setDispatchBranch('');
    setDispatchStatus('IN_STORE');
    setDispatchQuantityError('');
    setDispatchPriceError('');
    setDispatchBranchError('');
  };

  const validateName = (value) => {
    if (!value || value.trim() === '') return "Nomini kiriting";
    return '';
  };

  const validatePrice = (value) => {
    const numValue = Number(value);
    if (!value || value.trim() === '') return "Narxni kiriting";
    if (isNaN(numValue) || numValue < 0) return "Narx 0 dan katta yoki teng bo'lishi kerak";
    return '';
  };

  const validateQuantity = (value) => {
    const numValue = Number(value);
    if (!value || value.trim() === '') return "Miqdorni kiriting";
    if (isNaN(numValue) || numValue <= 0) return "Miqdor 0 dan katta bo'lishi kerak";
    if (selectedProduct && selectedProduct.quantity !== undefined && numValue > selectedProduct.quantity) {
      return `Maksimal miqdor: ${selectedProduct.quantity}`;
    }
    return '';
  };

  const validateBranch = (value) => {
    if (!value || value.trim() === '') return "Filialni tanlang";
    return '';
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !selectedProduct.id) {
      setNotification({ message: 'Mahsulot yoki mahsulot ID topilmadi', type: 'error' });
      return;
    }

    const nameError = validateName(editName);
    const priceError = validatePrice(editPrice);
    setEditNameError(nameError);
    setEditPriceError(priceError);

    if (nameError || priceError) return;

    const updatePayload = {
      name: editName,
      price: Number(editPrice),
      status: editStatus,
      branch: editBranch ? { connect: { id: Number(editBranch) } } : undefined,
      category: editCategory ? { connect: { id: Number(editCategory) } } : undefined,
      updatedAt: new Date().toISOString(),
    };

    setSubmitting(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/products/${selectedProduct.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatePayload),
      });

      setNotification({ message: 'Mahsulot muvaffaqiyatli yangilandi', type: 'success' });
      closeEditModal();
      loadProducts();
    } catch (err) {
      console.error('Tahrirlashda xatolik:', err);
      setNotification({ message: err.message || 'Mahsulotni yangilashda xatolik yuz berdi', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`"${product.name}" mahsulotini o'chirishni xohlaysizmi?`)) return;

    try {
      const response = await fetchWithAuth(`${API_URL}/products/${product.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: 'DELETED',
          updatedAt: new Date().toISOString(),
        }),
      });

      setNotification({ message: "Mahsulot muvaffaqiyatli o'chirildi", type: 'success' });
      loadProducts();
    } catch (err) {
      console.error("O'chirishda xatolik:", err);
      setNotification({
        message: err.message || "Mahsulotni o'chirishda noma'lum xatolik yuz berdi",
        type: 'error',
      });
    }
  };

  const handleDispatchSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !selectedProduct.id) {
      setNotification({ message: 'Mahsulot yoki mahsulot ID topilmadi', type: 'error' });
      return;
    }

    const qtyError = validateQuantity(dispatchQuantity);
    const prcError = validatePrice(dispatchPrice);
    const brnError = validateBranch(dispatchBranch);
    setDispatchQuantityError(qtyError);
    setDispatchPriceError(prcError);
    setDispatchBranchError(brnError);

    if (qtyError || prcError || brnError) return;

    const productUpdatePayload = {
      quantity: selectedProduct.quantity - Number(dispatchQuantity),
      status: dispatchStatus,
      price: Number(dispatchPrice),
      branch: dispatchBranch ? { connect: { id: Number(dispatchBranch) } } : undefined,
      outflow: Number(dispatchQuantity),
      type: dispatchStatus === 'SOLD' ? 'SALE' : 'TRANSFER',
      updatedAt: new Date().toISOString(),
    };

    setSubmitting(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/products/${selectedProduct.id}`, {
        method: 'PUT',
        body: JSON.stringify(productUpdatePayload),
      });

      const statusLabel = statusOptions.find((s) => s.value === dispatchStatus)?.label || dispatchStatus;
      setNotification({
        message: `Chiqim muvaffaqiyatli saqlandi. ${dispatchQuantity} ta mahsulot chiqarildi va status "${statusLabel}" ga o'zgartirildi.`,
        type: 'success',
      });
      closeDispatchModal();
      loadProducts();
      loadTransactions();
    } catch (err) {
      console.error('Chiqim yuborishda xatolik:', err);
      setNotification({ message: err.message || 'Chiqim qilishda xatolik yuz berdi', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) =>
    price === undefined || price === null
      ? "Noma'lum"
      : new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

  const formatQuantity = (qty) =>
    qty === undefined || qty === null ? "Noma'lum" : new Intl.NumberFormat('uz-UZ').format(qty) + " dona";

  const calculateTotal = () => Number(dispatchQuantity) * Number(dispatchPrice);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mahsulotlar</h1>
              <p className="text-gray-600">Barcha mahsulotlar ro'yxati</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadProducts}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                <Loader2 className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-gray-700">Yangilash</span>
              </button>
              <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Mahsulotlarni qidiring..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <button
              onClick={() => setNotification({ message: 'Filter funksiyasi hali amalga oshirilmagan', type: 'error' })}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Filter</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Jami mahsulotlar</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Faol mahsulotlar</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Kam qolgan</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tugagan</p>
                  <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <p className="text-gray-600 font-medium">Mahsulotlar yuklanmoqda...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mahsulotlar topilmadi</h3>
            <p className="text-gray-600">Qidiruv shartlaringizga mos mahsulotlar mavjud emas</p>
          </div>
        ) : (
          <>
            <div
              className={`grid gap-6 ${
                viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onDispatch={openDispatchModal}
                />
              ))}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-6">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Tranzaksiyalar</h2>
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                      <p className="text-gray-600">Tranzaksiyalar yuklanmoqda...</p>
                    </div>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-16">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Tranzaksiyalar topilmadi</h3>
                    <p className="text-gray-500">Hozircha tranzaksiyalar mavjud emas</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                          <th className="text-left p-4 font-semibold text-gray-700 w-[300px]">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              Mahsulot nomi
                            </div>
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700 w-[150px]">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              Kirim
                            </div>
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-700 w-[150px]">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              Chiqim
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <TransactionRow key={transaction.id} transaction={transaction} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        {showEditModal && selectedProduct && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeEditModal}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Mahsulotni tahrirlash</h3>
                      <p className="text-white/80 text-sm">Mahsulot ma'lumotlarini yangilash</p>
                    </div>
                  </div>
                  <button
                    onClick={closeEditModal}
                    className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <label htmlFor="editName" className="text-sm font-semibold text-gray-700">
                      Mahsulot nomi <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="editName"
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => setEditNameError(validateName(editName))}
                      className={`w-full border-2 rounded-2xl px-4 py-3 text-base font-medium focus:outline-none transition-all duration-200 ${
                        editNameError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                      }`}
                    />
                    {editNameError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{editNameError}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="editPrice" className="text-sm font-semibold text-gray-700">
                      Narx (so'm) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="editPrice"
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      onBlur={() => setEditPriceError(validatePrice(editPrice))}
                      className={`w-full border-2 rounded-2xl px-4 py-3 text-base font-medium focus:outline-none transition-all duration-200 ${
                        editPriceError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                      }`}
                      min="0"
                      step="1000"
                    />
                    {editPriceError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{editPriceError}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="editStatus" className="text-sm font-semibold text-gray-700">
                      Status
                    </label>
                    <select
                      id="editStatus"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full border-2 rounded-2xl px-4 py-3 text-base font-medium focus:outline-none transition-all duration-200 border-gray-200 bg-white"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="editBranch" className="text-sm font-semibold text-gray-700">
                      Filial
                    </label>
                    <select
                      id="editBranch"
                      value={editBranch}
                      onChange={(e) => setEditBranch(e.target.value)}
                      className="w-full border-2 rounded-2xl px-4 py-3 text-base font-medium focus:outline-none transition-all duration-200 border-gray-200 bg-white"
                    >
                      <option value="">Filialni tanlang</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="flex-1 px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-2xl transition-all duration-200 font-semibold border border-gray-200"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !!editNameError || !!editPriceError}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Yuklanmoqda...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Saqlash
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {showDispatchModal && selectedProduct && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeDispatchModal}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                      <TrendingDown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Chiqim qilish</h3>
                      <p className="text-white/80 text-sm">Mahsulotni chiqarib tashlash</p>
                    </div>
                  </div>
                  <button
                    onClick={closeDispatchModal}
                    className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-800">Mahsulot ma'lumotlari</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">ID:</span>
                      <span className="font-semibold text-gray-800">#{selectedProduct.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Nomi:</span>
                      <span className="font-semibold text-gray-800">{selectedProduct.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Mavjud miqdor:</span>
                      <span className="font-semibold text-gray-800">{formatQuantity(selectedProduct.quantity)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Filial:</span>
                      <span className="font-semibold text-gray-800">{selectedProduct.branch?.name || "Noma'lum"}</span>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleDispatchSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <label htmlFor="dispatchBranch" className="text-sm font-semibold text-gray-700">
                      Yuboriladigan filial <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="dispatchBranch"
                      value={dispatchBranch}
                      onChange={(e) => setDispatchBranch(e.target.value)}
                      onBlur={() => setDispatchBranchError(validateBranch(dispatchBranch))}
                      className={`w-full border-2 rounded-2xl px-4 py-3 text-base font-medium focus:outline-none transition-all duration-200 ${
                        dispatchBranchError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <option value="">Filialni tanlang</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                    {dispatchBranchError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{dispatchBranchError}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="dispatchStatus" className="text-sm font-semibold text-gray-700">
                      Yangi status
                    </label>
                    <select
                      id="dispatchStatus"
                      value={dispatchStatus}
                      onChange={(e) => setDispatchStatus(e.target.value)}
                      className="w-full border-2 rounded-2xl px-4 py-3 text-base font-medium focus:outline-none transition-all duration-200 border-gray-200 bg-white"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="dispatchQuantity" className="text-sm font-semibold text-gray-700">
                      Chiqarilayotgan miqdor <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="dispatchQuantity"
                      type="number"
                      value={dispatchQuantity}
                      onChange={(e) => setDispatchQuantity(e.target.value)}
                      onBlur={() => setDispatchQuantityError(validateQuantity(dispatchQuantity))}
                      className={`w-full border-2 rounded-2xl px-4 py-3 text-base font-medium focus:outline-none transition-all duration-200 ${
                        dispatchQuantityError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                      }`}
                      min="1"
                      max={selectedProduct.quantity || undefined}
                      step="1"
                    />
                    {dispatchQuantityError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{dispatchQuantityError}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="dispatchPrice" className="text-sm font-semibold text-gray-700">
                      Birlik narxi (so'm) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="dispatchPrice"
                      type="number"
                      value={dispatchPrice}
                      onChange={(e) => setDispatchPrice(e.target.value)}
                      onBlur={() => setDispatchPriceError(validatePrice(dispatchPrice))}
                      className={`w-full border-2 rounded-2xl px-4 py-3 text-base font-medium focus:outline-none transition-all duration-200 ${
                        dispatchPriceError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                      }`}
                      min="0"
                      step="1000"
                    />
                    {dispatchPriceError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{dispatchPriceError}</span>
                      </div>
                    )}
                  </div>
                  {dispatchQuantity && dispatchPrice && dispatchBranch && !dispatchQuantityError && !dispatchPriceError && !dispatchBranchError && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-green-800">Chiqim xulosasi</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700">Yuboriladigan filial:</span>
                          <span className="font-semibold text-green-800">
                            {branches.find((b) => b.id === Number(dispatchBranch))?.name || "Noma'lum"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Chiqim miqdori:</span>
                          <span className="font-semibold text-green-800">{formatQuantity(Number(dispatchQuantity))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Kirim miqdori:</span>
                          <span className="font-semibold text-green-800">{formatQuantity(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Birlik narxi:</span>
                          <span className="font-semibold text-green-800">{formatPrice(Number(dispatchPrice))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Yangi status:</span>
                          <span className="font-semibold text-green-800">
                            {statusOptions.find((s) => s.value === dispatchStatus)?.label || dispatchStatus}
                          </span>
                        </div>
                        <div className="border-t border-green-200 pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="text-green-700 font-medium">Jami summa:</span>
                            <span className="font-bold text-green-800 text-lg">{formatPrice(calculateTotal())}</span>
                          </div>
                        </div>
                        {selectedProduct.quantity !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-green-700">Qolgan miqdor:</span>
                            <span className="font-semibold text-green-800">
                              {formatQuantity(selectedProduct.quantity - Number(dispatchQuantity))}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={closeDispatchModal}
                      className="flex-1 px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-2xl transition-all duration-200 font-semibold border border-gray-200"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !!dispatchQuantityError || !!dispatchPriceError || !!dispatchBranchError}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Yuklanmoqda...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Chiqimni tasdiqlash
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
      </div>
    </div>
  );
};

export default TovarlarRoyxati;