import React, { useState, useEffect, useCallback, memo, useContext } from 'react';
import PropTypes from 'prop-types';
import { Save, X, Package, Building, Tag, Hash, AlertCircle, Loader2, TrendingDown, Info, AlertTriangle, DollarSign, Search, Scan, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import AuthContext from SkladPanel.jsx
const AuthContext = React.createContext({
  token: null,
  setToken: () => {},
});

const Notification = ({ message, type = 'error', onClose }) => (
  <div className={`fixed top-4 right-4 p-4 rounded-xl shadow-lg border ${type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'} flex items-center gap-2 z-50`}>
    <AlertTriangle className="w-5 h-5" />
    <span>{message}</span>
    <button onClick={onClose} className="ml-2 text-sm hover:text-red-900" aria-label="Yopish">X</button>
  </div>
);

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['error', 'success']),
  onClose: PropTypes.func.isRequired,
};

// Memoized table row component for products
const ProductRow = memo(({ product, onSelect, filterMode }) => {
  const stockLevel = product.quantity === undefined ? 'unknown' : product.quantity === 0 ? 'empty' : product.quantity < 10 ? 'low' : product.quantity < 50 ? 'medium' : 'high';
  const stockColor = stockLevel === 'empty' ? 'text-red-600 bg-red-50' :
                     stockLevel === 'low' ? 'text-orange-600 bg-orange-50' :
                     stockLevel === 'medium' ? 'text-yellow-600 bg-yellow-50' :
                     stockLevel === 'high' ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50';
  const formatPrice = (price) => price === undefined || price === null ? "Noma'lum" : new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';

  return (
    <tr className={`border-b border-slate-100 hover:bg-slate-50 transition-colors duration-150`}>
      <td className="p-4">
        <span className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">#{product.id}</span>
      </td>
      <td className="p-4"><div className="font-medium text-slate-800">{product.name}</div></td>
      <td className="p-4">
        <div className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded inline-block">
          {product.barcode || 'N/A'}
        </div>
      </td>
      <td className="p-4"><div className="flex items-center gap-2"><Building className="w-4 h-4 text-slate-400" /><span className="text-slate-700">{product.branch?.name || "Noma'lum"}</span></div></td>
      <td className="p-4"><div className="flex items-center gap-2"><Tag className="w-4 h-4 text-slate-400" /><span className="text-slate-700">{product.category?.name || "Noma'lum"}</span></div></td>
      <td className="p-4"><div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-slate-400" /><span className="text-slate-700 font-medium">{formatPrice(product.price)}</span></div></td>
      <td className="p-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${stockColor}`}>
          {stockLevel === 'empty' && <AlertCircle className="w-4 h-4" />}
          {product.quantity !== undefined ? product.quantity : "Noma'lum"}
        </div>
      </td>
      <td className="p-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
          product.status === 'IN_WAREHOUSE' ? 'text-blue-600 bg-blue-50' :
          product.status === 'IN_STORE' ? 'text-green-600 bg-green-50' :
          product.status === 'SOLD' ? 'text-purple-600 bg-purple-50' :
          'text-gray-600 bg-gray-50'
        }`}>
          {product.status === 'IN_WAREHOUSE' ? 'Skladda' :
           product.status === 'IN_STORE' ? 'Do\'konda' :
           product.status === 'SOLD' ? 'Sotilgan' :
           product.status || "Noma'lum"}
        </div>
      </td>
      <td className="p-4">
        {product.status === 'IN_WAREHOUSE' && product.quantity > 0 && (
          <button
            onClick={() => onSelect(product)}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            aria-label={`Chiqim qilish ${product.name}`}
          >
            Chiqim
          </button>
        )}
      </td>
    </tr>
  );
});

ProductRow.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    barcode: PropTypes.string,
    branch: PropTypes.shape({ name: PropTypes.string }),
    category: PropTypes.shape({ name: PropTypes.string }),
    price: PropTypes.number,
    quantity: PropTypes.number,
    status: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  filterMode: PropTypes.oneOf(['inStore', 'sold', 'inWarehouse']).isRequired,
};

const Chiqim = ({ selectedBranchId }) => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showChiqimModal, setShowChiqimModal] = useState(false);
  const [showKirimModal, setShowKirimModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('IN_STORE');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    barcode: '',
    model: '',
    quantity: '',
    price: '',
    branch: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quantityError, setQuantityError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [branchError, setBranchError] = useState('');
  const [newProductErrors, setNewProductErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [filterMode, setFilterMode] = useState('inWarehouse');
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeSearch, setBarcodeSearch] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'https://suddocs.uz';

  const statusOptions = [
    { value: 'IN_STORE', label: 'Do\'konda', color: 'text-green-600 bg-green-50' },
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
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch ${url}`);
    }

    return response;
  };

  const loadBranches = useCallback(async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}/branches`, { method: 'GET' });
      const data = await response.json();
      setBranches(data);
    } catch (err) {
      console.error('Filiallar yuklashda xatolik:', err);
      setNotification({ message: err.message || 'Filiallar yuklashda xatolik', type: 'error' });
    }
  }, [API_URL, navigate]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}/categories`, { method: 'GET' });
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Kategoriyalar yuklashda xatolik:', err);
      setNotification({ message: err.message || 'Kategoriyalar yuklashda xatolik', type: 'error' });
    }
  }, [API_URL, navigate]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedBranchId) queryParams.append('branchId', selectedBranchId);
      const response = await fetchWithAuth(`${API_URL}/products?${queryParams.toString()}&_=${Date.now()}`, { method: 'GET' });
      const data = await response.json();

      let filteredProducts = data;
      if (filterMode === 'inStore') {
        filteredProducts = data.filter(product => product.quantity > 0 && product.status === 'IN_STORE');
      } else if (filterMode === 'sold') {
        filteredProducts = data.filter(product => product.status === 'SOLD');
      } else if (filterMode === 'inWarehouse') {
        filteredProducts = data.filter(product => product.status === 'IN_WAREHOUSE');
      }

      if (searchTerm.trim()) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.barcode && product.barcode.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      if (barcodeSearch.trim()) {
        filteredProducts = filteredProducts.filter(product =>
          product.barcode && product.barcode.toLowerCase().includes(barcodeSearch.toLowerCase())
        );
      }

      setProducts(filteredProducts);
    } catch (err) {
      console.error('Mahsulotlarni yuklashda xatolik:', err);
      setNotification({ message: err.message || 'Mahsulotlarni yuklashda xatolik', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [filterMode, searchTerm, barcodeSearch, API_URL, navigate, selectedBranchId]);

  useEffect(() => {
    loadProducts();
    loadBranches();
    loadCategories();
  }, [loadProducts, loadBranches, loadCategories]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && (showChiqimModal || showKirimModal)) {
        closeChiqimModal();
        closeKirimModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showChiqimModal, showKirimModal]);

  const openChiqimModal = useCallback((product) => {
    if (!product.id) {
      setNotification({ message: 'Mahsulot ID topilmadi', type: 'error' });
      return;
    }
    setSelectedProduct(product);
    setQuantity('');
    setPrice(product.price ? product.price.toString() : '0');
    setSelectedBranch('');
    setSelectedStatus('IN_STORE');
    setQuantityError('');
    setPriceError('');
    setBranchError('');
    setShowChiqimModal(true);
  }, []);

  const closeChiqimModal = useCallback(() => {
    setShowChiqimModal(false);
    setSelectedProduct(null);
    setQuantity('');
    setPrice('');
    setSelectedBranch('');
    setSelectedStatus('IN_STORE');
    setQuantityError('');
    setPriceError('');
    setBranchError('');
  }, []);

  const openKirimModal = useCallback(() => {
    setNewProduct({ name: '', barcode: '', model: '', quantity: '', price: '', branch: '', category: '' });
    setNewProductErrors({});
    setShowKirimModal(true);
  }, []);

  const closeKirimModal = useCallback(() => {
    setShowKirimModal(false);
    setNewProduct({ name: '', barcode: '', model: '', quantity: '', price: '', branch: '', category: '' });
    setNewProductErrors({});
    setSearchTerm('');
    setBarcodeSearch('');
  }, []);

  const validateQuantity = (value) => {
    const numValue = Number(value);
    if (!value || value.trim() === '') return 'Miqdorni kiriting';
    if (isNaN(numValue) || numValue <= 0) return 'Miqdor 0 dan katta bo\'lishi kerak';
    if (selectedProduct && selectedProduct.quantity !== undefined && numValue > selectedProduct.quantity) {
      return `Maksimal miqdor: ${selectedProduct.quantity}`;
    }
    return '';
  };

  const validatePrice = (value) => {
    const numValue = Number(value);
    if (!value || value.trim() === '') return 'Narxni kiriting';
    if (isNaN(numValue) || numValue < 0) return 'Narx 0 dan katta yoki teng bo\'lishi kerak';
    return '';
  };

  const validateBranch = (value) => {
    if (!value || value.trim() === '') return 'Filialni tanlang';
    return '';
  };

  const validateNewProduct = () => {
    const errors = {};
    if (!newProduct.name || newProduct.name.trim() === '') errors.name = 'Mahsulot nomini kiriting';
    if (!newProduct.quantity || newProduct.quantity.trim() === '') errors.quantity = 'Miqdorni kiriting';
    else if (isNaN(Number(newProduct.quantity)) || Number(newProduct.quantity) <= 0) errors.quantity = 'Miqdor 0 dan katta bo\'lishi kerak';
    if (!newProduct.price || newProduct.price.trim() === '') errors.price = 'Narxni kiriting';
    else if (isNaN(Number(newProduct.price)) || Number(newProduct.price) < 0) errors.price = 'Narx 0 dan katta yoki teng bo\'lishi kerak';
    if (!newProduct.branch || newProduct.branch.trim() === '') errors.branch = 'Filialni tanlang';
    if (!newProduct.category || newProduct.category.trim() === '') errors.category = 'Kategoriyani tanlang';
    if (!newProduct.model || newProduct.model.trim() === '') errors.model = 'Modelni kiriting';
    return errors;
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    setQuantity(value);
    setQuantityError('');
  };

  const handleQuantityBlur = () => {
    setQuantityError(validateQuantity(quantity));
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPrice(value);
    setPriceError('');
  };

  const handlePriceBlur = () => {
    setPriceError(validatePrice(price));
  };

  const handleBranchChange = (e) => {
    const value = e.target.value;
    setSelectedBranch(value);
    setBranchError('');
  };

  const handleBranchBlur = () => {
    setBranchError(validateBranch(selectedBranch));
  };

  const handleNewProductChange = (field) => (e) => {
    setNewProduct((prev) => ({ ...prev, [field]: e.target.value }));
    setNewProductErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBarcodeSearchChange = (e) => {
    setBarcodeSearch(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleSubmitChiqim = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !selectedProduct.id) {
      setNotification({ message: 'Mahsulot yoki mahsulot ID topilmadi', type: 'error' });
      return;
    }

    const qtyError = validateQuantity(quantity);
    const prcError = validatePrice(price);
    const brnError = validateBranch(selectedBranch);
    setQuantityError(qtyError);
    setPriceError(prcError);
    setBranchError(brnError);

    if (qtyError || prcError || brnError) return;

    const productUpdatePayload = {
      quantity: selectedProduct.quantity - Number(quantity),
      status: selectedStatus,
      price: Number(price),
      branch: selectedBranch ? { connect: { id: Number(selectedBranch) } } : undefined,
      outflow: Number(quantity),
      type: selectedStatus === 'SOLD' ? 'SALE' : 'TRANSFER',
      updatedAt: new Date().toISOString(),
    };

    setSubmitting(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/products/${selectedProduct.id}`, {
        method: 'PUT',
        body: JSON.stringify(productUpdatePayload),
      });

      const statusLabel = statusOptions.find(s => s.value === selectedStatus)?.label || selectedStatus;
      setNotification({ 
        message: `Chiqim muvaffaqiyatli saqlandi. ${quantity} ta mahsulot chiqarildi va status "${statusLabel}" ga o'zgartirildi.`, 
        type: 'success' 
      });
      closeChiqimModal();
      loadProducts();
    } catch (err) {
      console.error('Chiqim yuborishda xatolik:', err);
      setNotification({ message: err.message || 'Mahsulotni yangilashda xatolik', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitKirim = async (e) => {
    e.preventDefault();
    const errors = validateNewProduct();
    setNewProductErrors(errors);

    if (Object.keys(errors).length > 0) return;

    const productCreatePayload = {
      name: newProduct.name,
      barcode: newProduct.barcode || null,
      model: newProduct.model,
      quantity: Number(newProduct.quantity),
      price: Number(newProduct.price),
      status: 'IN_WAREHOUSE',
      branch: newProduct.branch ? { connect: { id: Number(newProduct.branch) } } : undefined,
      category: newProduct.category ? { connect: { id: Number(newProduct.category) } } : undefined,
      createdAt: new Date().toISOString(),
    };

    setSubmitting(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/products`, {
        method: 'POST',
        body: JSON.stringify(productCreatePayload),
      });

      const responseData = await response.json();
      console.log('Product added:', responseData);

      setNotification({ 
        message: `Mahsulot "${newProduct.name}" muvaffaqiyatli qo\'shildi va skladda ro\'yxatga olindi.`, 
        type: 'success' 
      });
      closeKirimModal();
      loadProducts();
    } catch (err) {
      console.error('Kirim yuborishda xatolik:', err);
      let errorMessage = err.message || 'Mahsulot qo\'shishda xatolik';
      if (err.message.includes('barcode')) {
        setNewProductErrors((prev) => ({ ...prev, barcode: 'Bu shtrix kod allaqachon mavjud' }));
        errorMessage = 'Bu shtrix kod allaqachon mavjud';
      }
      setNotification({ message: errorMessage, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => price === undefined || price === null ? "Noma'lum" : new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  const formatQuantity = (qty) => qty === undefined || qty === null ? "Noma'lum" : new Intl.NumberFormat('uz-UZ').format(qty) + ' dona';
  const calculateTotal = () => Number(quantity) * Number(price);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-[#1178f8] to-[#1178f8] p-3 rounded-xl">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Chiqimlar</h1>
                <p className="text-slate-600">Mahsulotlarni chiqarib tashlash</p>
              </div>
            </div>
            <div className="flex gap-3 items-center flex-wrap">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Tovar nomini kiriting..."
                    className="w-64 border-2 rounded-2xl mb-3 px-4 py-2 text-sm font-medium focus:outline-none transition-all duration-200 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white pl-10"
                    aria-label="Tovar qidirish"
                  />
                  <Search className="w-5 h-5 mb-3 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={barcodeSearch}
                    onChange={handleBarcodeSearchChange}
                    placeholder="Barcode kiriting..."
                    className="w-64 border-2 rounded-2xl px-4 py-2 text-sm font-medium focus:outline-none transition-all duration-200 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white pl-10"
                    aria-label="Barcode qidirish"
                  />
                  <Scan className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
              <div className="flex-column">
                <button
                  onClick={openKirimModal}
                  className="bg-gradient-to-r mb-2 from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  aria-label="Yangi mahsulot qo'shish"
                >
                  <Plus className="w-5 h-5 inline-block mr-2" />
                  Kirim qo'shish
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterMode('inWarehouse')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      filterMode === 'inWarehouse'
                        ? 'bg-gradient-to-r from-[#1178f8] to-[#1178f8] text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    aria-label="Skladda filtri"
                  >
                    Skladda
                  </button>
                  <button
                    onClick={() => setFilterMode('inStore')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      filterMode === 'inStore'
                        ? 'bg-gradient-to-r from-[#1178f8] to-[#1178f8] text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    aria-label="Do'konda mavjud filtri"
                  >
                    Do'konda mavjud
                  </button>
                  <button
                    onClick={() => setFilterMode('sold')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      filterMode === 'sold'
                        ? 'bg-gradient-to-r from-[#1178f8] to-[#1178f8] text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    aria-label="Sotilgan filtri"
                  >
                    Sotilgan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                <p className="text-slate-600">Mahsulotlar yuklanmoqda...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Mahsulotlar topilmadi</h3>
              <p className="text-slate-500">Hozircha chiqarish uchun mahsulotlar mavjud emas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <th className="text-left p-4 font-semibold text-slate-700 w-[100px]"><div className="flex items-center gap-2"><Hash className="w-4 h-4" />ID</div></th>
                    <th className="text-left p-4 font-semibold text-slate-700 w-[200px]"><div className="flex items-center gap-2"><Package className="w-4 h-4" />Mahsulot nomi</div></th>
                    <th className="text-left p-4 font-semibold text-slate-700 w-[150px]"><div className="flex items-center gap-2"><Scan className="w-4 h-4" />Barcode</div></th>
                    <th className="text-left p-4 font-semibold text-slate-700 w-[150px]"><div className="flex items-center gap-2"><Building className="w-4 h-4" />Filial</div></th>
                    <th className="text-left p-4 font-semibold text-slate-700 w-[150px]"><div className="flex items-center gap-2"><Tag className="w-4 h-4" />Kategoriya</div></th>
                    <th className="text-left p-4 font-semibold text-slate-700 w-[150px]"><div className="flex items-center gap-2"><DollarSign className="w-4 h-4" />Narx</div></th>
                    <th className="text-left p-4 font-semibold text-slate-700 w-[120px]">Mavjud miqdor</th>
                    <th className="text-left p-4 font-semibold text-slate-700 w-[120px]">Status</th>
                    <th className="text-left p-4 font-semibold text-slate-700 w-[100px]">Amal</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <ProductRow key={product.id} product={product} onSelect={openChiqimModal} filterMode={filterMode} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {showChiqimModal && selectedProduct && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeChiqimModal}
            role="dialog"
            aria-labelledby="chiqim-modal-title"
            aria-modal="true"
          >
            <div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                      <TrendingDown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 id="chiqim-modal-title" className="text-xl font-bold text-white">Chiqim qilish</h3>
                      <p className="text-white/80 text-sm">Mahsulotni chiqarib tashlash</p>
                    </div>
                  </div>
                  <button
                    onClick={closeChiqimModal}
                    className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
                    aria-label="Modalni yopish"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <form onSubmit={handleSubmitChiqim} className="space-y-6">
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-100 p-2 rounded-xl">
                        <Info className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-slate-800">Mahsulot ma'lumotlari</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-xl p-3 border border-slate-200">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">ID</label>
                        <p className="text-slate-800 font-mono text-sm mt-1">#{selectedProduct.id}</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-slate-200">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Barcode</label>
                        <p className="text-slate-800 font-mono text-sm mt-1">{selectedProduct.barcode || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-slate-200 mb-4">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Mahsulot nomi</label>
                      <p className="text-slate-800 font-semibold text-lg mt-1">{selectedProduct.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-xl p-3 border border-slate-200">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Mavjud miqdor</label>
                        <p className="text-slate-800 font-bold text-lg mt-1 flex items-center gap-2">
                          {formatQuantity(selectedProduct.quantity)}
                          {selectedProduct.quantity === 0 && <AlertCircle className="w-4 h-4 text-red-500" />}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-slate-200">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Kategoriya</label>
                        <p className="text-slate-800 font-medium mt-1">{selectedProduct.category?.name || "Noma'lum"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-xl p-3 border border-slate-200">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                          <Building className="w-3 h-3" /> Joriy filial
                        </label>
                        <p className="text-slate-800 font-medium mt-1">{selectedProduct.branch?.name || "Noma'lum"}</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-slate-200">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                          <Tag className="w-3 h-3" /> Status
                        </label>
                        <p className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          selectedProduct.status === 'IN_WAREHOUSE' ? 'text-blue-600 bg-blue-50' :
                          selectedProduct.status === 'IN_STORE' ? 'text-green-600 bg-green-50' :
                          selectedProduct.status === 'SOLD' ? 'text-purple-600 bg-purple-50' :
                          'text-gray-600 bg-gray-50'
                        }`}>
                          {selectedProduct.status === 'IN_WAREHOUSE' ? 'Skladda' :
                           selectedProduct.status === 'IN_STORE' ? 'Do\'konda' :
                           selectedProduct.status === 'SOLD' ? 'Sotilgan' :
                           selectedProduct.status || "Noma'lum"}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-slate-200">
                      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <DollarSign className="w-3 h-3" /> Mahsulot narxi
                      </label>
                      <p className="text-slate-800 font-bold text-lg mt-1">{formatPrice(selectedProduct.price)}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label htmlFor="branch" className="text-sm font-semibold text-slate-700">Yuboriladigan filial</label>
                        <span className="text-red-500">*</span>
                      </div>
                      <div className="relative">
                        <select
                          id="branch"
                          value={selectedBranch}
                          onChange={handleBranchChange}
                          onBlur={handleBranchBlur}
                          className={`w-full border-2 rounded-2xl px-4 py-3 text-base font-medium focus:outline-none transition-all duration-200 ${
                            branchError ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white'
                          }`}
                          aria-describedby={branchError ? 'branch-error' : undefined}
                          aria-required="true"
                        >
                          <option value="">Filialni tanlang</option>
                          {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                              {branch.name}
                            </option>
                          ))}
                        </select>
                        {branchError && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {branchError && (
                        <div id="branch-error" className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{branchError}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label htmlFor="status" className="text-sm font-semibold text-slate-700">Yangi status</label>
                        <span className="text-red-500">*</span>
                      </div>
                      <select
                        id="status"
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        className="w-full border-2 rounded-2xl px-4 py-3 text-base font-medium focus:outline-none transition-all duration-200 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white"
                      >
                        {statusOptions.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label htmlFor="quantity" className="text-sm font-semibold text-slate-700">Chiqarilayotgan miqdor</label>
                        <span className="text-red-500">*</span>
                      </div>
                      <div className="relative">
                        <input
                          id="quantity"
                          type="number"
                          value={quantity}
                          onChange={handleQuantityChange}
                          onBlur={handleQuantityBlur}
                          placeholder="Miqdorni kiriting..."
                          className={`w-full border-2 rounded-2xl px-4 py-3 text-base font-medium focus:outline-none transition-all duration-200 ${
                            quantityError ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white'
                          }`}
                          min="1"
                          max={selectedProduct.quantity || undefined}
                          step="1"
                          aria-describedby={quantityError ? 'quantity-error' : undefined}
                          aria-required="true"
                        />
                        {quantityError && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {quantityError && (
                        <div id="quantity-error" className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{quantityError}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label htmlFor="price" className="text-sm font-semibold text-slate-700">Birlik narxi (so'm)</label>
                        <span className="text-red-500">*</span>
                      </div>
                      <div className="relative">
                        <input
                          id="price"
                          type="number"
                          value={price}
                          onChange={handlePriceChange}
                          onBlur={handlePriceBlur}
                          placeholder="Narxni kiriting..."
                          className={`w-full border-2 rounded-2xl px-4 py-3 text-base font-medium focus:outline-none transition-all duration-200 ${
                            priceError ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white'
                          }`}
                          min="0"
                          step="1000"
                          aria-describedby={priceError ? 'price-error' : undefined}
                          aria-required="true"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {priceError ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <DollarSign className="w-5 h-5 text-slate-400" />}
                        </div>
                      </div>
                      {priceError && (
                        <div id="price-error" className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{priceError}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {quantity && price && selectedBranch && !quantityError && !priceError && !branchError && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Info className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-green-800">Chiqim xulosasi</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700">Yuboriladigan filial:</span>
                          <span className="font-semibold text-green-800">{branches.find(b => b.id === Number(selectedBranch))?.name || 'Noma\'lum'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Chiqim miqdori:</span>
                          <span className="font-semibold text-green-800">{formatQuantity(Number(quantity))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Birlik narxi:</span>
                          <span className="font-semibold text-green-800">{formatPrice(Number(price))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Yangi status:</span>
                          <span className="font-semibold text-green-800">{statusOptions.find(s => s.value === selectedStatus)?.label || selectedStatus}</span>
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
                            <span className="font-semibold text-green-800">{formatQuantity(selectedProduct.quantity - Number(quantity))}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 pt-6 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={closeChiqimModal}
                      className="flex-1 px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-2xl transition-all duration-200 font-semibold border border-slate-200"
                      aria-label="Bekor qilish"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !!quantityError || !!priceError || !!branchError || !quantity || !price || !selectedBranch}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center gap-2"
                      aria-label="Chiqimni tasdiqlash"
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
        {showKirimModal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeKirimModal}
            role="dialog"
            aria-labelledby="kirim-modal-title"
            aria-modal="true"
          >
            <div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 id="kirim-modal-title" className="text-xl font-bold text-white">Kirim qilish</h3>
                      <p className="text-white/80 text-sm">Yangi mahsulot qo'shish</p>
                    </div>
                  </div>
                  <button
                    onClick={closeKirimModal}
                    className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
                    aria-label="Modalni yopish"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <form onSubmit={handleSubmitKirim} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label htmlFor="new-name" className="text-sm font-semibold text-slate-700">Mahsulot nomi</label>
                        <span className="text-red-500">*</span>
                      </div>
                      <div className="relative">
                        <input
                          id="new-name"
                          type="text"
                          value={newProduct.name}
                          onChange={handleNewProductChange('name')}
                          placeholder="Mahsulot nomini kiriting..."
                          className={`w-full border-2 rounded-2xl px-4 py-3 text-base font-medium focus:outline-none transition-all duration-200 ${
                            newProductErrors.name ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white'
                          }`}
                          aria-describedby={newProductErrors.name ? 'name-error' : undefined}
                          aria-required="true"
                        />
                        {newProductErrors.name && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {newProductErrors.name && (
                        <div id="name-error" className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{newProductErrors.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="new-barcode" className="text-sm font-semibold text-slate-700">Barcode</label>
                      <div className="relative">
                        <input
                          id="new-barcode"
                          type="text"
                          value={newProduct.barcode}
                          onChange={handleNewProductChange('barcode')}
                          placeholder="Barcode kiriting (ixtiyoriy)..."
                          className={`w-full border-2 rounded-2xl px-4 py-3 text-base font-medium focus:outline-none transition-all duration-200 ${
                            newProductErrors.barcode ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white'
                          }`}
                          aria-describedby={newProductErrors.barcode ? 'barcode-error' : undefined}
                        />
                        {newProductErrors.barcode && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {newProductErrors.barcode && (
                        <div id="barcode-error" className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{newProductErrors.barcode}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label htmlFor="new-model" className="text-sm font-semibold text-slate-700">Model</label>
                        <span className="text-red-500">*</span>
                      </div>
                      <div className="relative">
                        <input
                          id="new-model"
                          type="text"
                          value={newProduct.model}
                          onChange={handleNewProductChange('model')}
                          placeholder="Modelni kiriting..."
                          className={`w-full border-2 rounded-2xl px-4 py-3 text-base font-medium focus:outline-none transition-all duration-200 ${
                            newProductErrors.model ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white'
                          }`}
                          aria-describedby={newProductErrors.model ? 'model-error' : undefined}
                          aria-required="true"
                        />
                        {newProductErrors.model && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {newProductErrors.model && (
                        <div id="model-error" className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{newProductErrors.model}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label htmlFor="new-quantity" className="text-sm font-semibold text-slate-700">Miqdor</label>
                        <span className="text-red-500">*</span>
                      </div>
                      <div className="relative">
                        <input
                          id="new-quantity"
                          type="number"
                          value={newProduct.quantity}
                          onChange={handleNewProductChange('quantity')}
                          placeholder="Miqdorni kiriting..."
                          className={`w-full border-2 rounded-2xl px-4 py-3 text-base font-medium focus:outline-none transition-all duration-200 ${
                            newProductErrors.quantity ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white'
                          }`}
                          min="1"
                          step="1"
                          aria-describedby={newProductErrors.quantity ? 'quantity-error' : undefined}
                          aria-required="true"
                        />
                        {newProductErrors.quantity && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {newProductErrors.quantity && (
                        <div id="quantity-error" className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{newProductErrors.quantity}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label htmlFor="new-price" className="text-sm font-semibold text-slate-700">Birlik narxi (so'm)</label>
                        <span className="text-red-500">*</span>
                      </div>
                      <div className="relative">
                        <input
                          id="new-price"
                          type="number"
                          value={newProduct.price}
                          onChange={handleNewProductChange('price')}
                          placeholder="Narxni kiriting..."
                          className={`w-full border-2 rounded-2xl px-4 py-3 text-base font-medium focus:outline-none transition-all duration-200 ${
                            newProductErrors.price ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white'
                          }`}
                          min="0"
                          step="1000"
                          aria-describedby={newProductErrors.price ? 'price-error' : undefined}
                          aria-required="true"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {newProductErrors.price ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <DollarSign className="w-5 h-5 text-slate-400" />}
                        </div>
                      </div>
                      {newProductErrors.price && (
                        <div id="price-error" className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{newProductErrors.price}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label htmlFor="new-branch" className="text-sm font-semibold text-slate-700">Filial</label>
                        <span className="text-red-500">*</span>
                      </div>
                      <div className="relative">
                        <select
                          id="new-branch"
                          value={newProduct.branch}
                          onChange={handleNewProductChange('branch')}
                          className={`w-full border-2 rounded-2xl px-4 py-3 text-base font-medium focus:outline-none transition-all duration-200 ${
                            newProductErrors.branch ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white'
                          }`}
                          aria-describedby={newProductErrors.branch ? 'branch-error' : undefined}
                          aria-required="true"
                        >
                          <option value="">Filialni tanlang</option>
                          {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                              {branch.name}
                            </option>
                          ))}
                        </select>
                        {newProductErrors.branch && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {newProductErrors.branch && (
                        <div id="branch-error" className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{newProductErrors.branch}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label htmlFor="new-category" className="text-sm font-semibold text-slate-700">Kategoriya</label>
                        <span className="text-red-500">*</span>
                      </div>
                      <div className="relative">
                        <select
                          id="new-category"
                          value={newProduct.category}
                          onChange={handleNewProductChange('category')}
                          className={`w-full border-2 rounded-2xl px-4 py-3 text-base font-medium focus:outline-none transition-all duration-200 ${
                            newProductErrors.category ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white'
                          }`}
                          aria-describedby={newProductErrors.category ? 'category-error' : undefined}
                          aria-required="true"
                        >
                          <option value="">Kategoriyani tanlang</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {newProductErrors.category && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {newProductErrors.category && (
                        <div id="category-error" className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{newProductErrors.category}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {newProduct.name && newProduct.quantity && newProduct.price && newProduct.branch && newProduct.category && newProduct.model && Object.keys(newProductErrors).length === 0 && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Info className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-green-800">Kirim xulosasi</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700">Mahsulot nomi:</span>
                          <span className="font-semibold text-green-800">{newProduct.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Barcode:</span>
                          <span className="font-semibold text-green-800">{newProduct.barcode || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Model:</span>
                          <span className="font-semibold text-green-800">{newProduct.model}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Miqdor:</span>
                          <span className="font-semibold text-green-800">{formatQuantity(Number(newProduct.quantity))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Birlik narxi:</span>
                          <span className="font-semibold text-green-800">{formatPrice(Number(newProduct.price))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Filial:</span>
                          <span className="font-semibold text-green-800">{branches.find(b => b.id === Number(newProduct.branch))?.name || 'Noma\'lum'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Kategoriya:</span>
                          <span className="font-semibold text-green-800">{categories.find(c => c.id === Number(newProduct.category))?.name || 'Noma\'lum'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Status:</span>
                          <span className="font-semibold text-green-800">Skladda</span>
                        </div>
                        <div className="border-t border-green-200 pt-2 mt-2">
                          <div className="flex justify-between">
                            <span className="text-green-700 font-medium">Jami summa:</span>
                            <span className="font-bold text-green-800 text-lg">{formatPrice(Number(newProduct.quantity) * Number(newProduct.price))}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 pt-6 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={closeKirimModal}
                      className="flex-1 px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-2xl transition-all duration-200 font-semibold border border-slate-200"
                      aria-label="Bekor qilish"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || Object.keys(newProductErrors).length > 0 || !newProduct.name || !newProduct.quantity || !newProduct.price || !newProduct.branch || !newProduct.category || !newProduct.model}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center gap-2"
                      aria-label="Kirimni tasdiqlash"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Yuklanmoqda...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Kirimni tasdiqlash
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

Chiqim.propTypes = {
  selectedBranchId: PropTypes.string,
};

export default memo(Chiqim);