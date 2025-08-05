import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, Tag, Barcode, Settings, Building, DollarSign, Package, X, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Notification component for error/success messages
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
        aria-label="Yopish"
      >
        ×
      </button>
    </div>
  </div>
);

const Kirim = ({ onProductAdded }) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [name, setName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [branch, setBranch] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://suddocs.uz';

  // Formatting functions
  const formatCurrency = (amount) =>
    amount === '' || isNaN(amount) || amount === null
      ? ''
      : new Intl.NumberFormat('uz-UZ', { minimumFractionDigits: 0 }).format(Number(amount)) + " so'm";

  const formatQuantity = (qty) =>
    qty === '' || isNaN(qty) || qty === null ? '' : new Intl.NumberFormat('uz-UZ').format(Number(qty)) + ' dona';

  // Parse formatted input back to raw value
  const parseNumber = (value) => value.replace(/[^0-9.]/g, '');

  // Axios instance with authentication
  const axiosWithAuth = async (config) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      throw new Error('No token found. Please login again.');
    }

    const headers = {
      ...config.headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios({ ...config, headers });
      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        navigate('/login');
        throw new Error('Unauthorized: Session expired. Please login again.');
      }
      throw error;
    }
  };

  // Load categories and branches
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [categoriesRes, branchesRes] = await Promise.all([
        axiosWithAuth({ method: 'get', url: `${API_URL}/categories` }),
        axiosWithAuth({ method: 'get', url: `${API_URL}/branches` }),
      ]);

      setCategories(categoriesRes.data);
      setBranches(branchesRes.data);
      setNotification(null);
    } catch (err) {
      console.error("Ma'lumotlarni yuklashda xatolik:", err.response?.data || err.message);
      setNotification({ message: err.message || "Kategoriyalar yoki filiallar yuklanmadi", type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [navigate, API_URL]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Validate input fields
  const validateFields = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Nomi kiritilishi shart";
    if (!barcode.trim()) newErrors.barcode = "Shtrix kiritilishi shart";
    if (!model.trim()) newErrors.model = "Model kiritilishi shart";
    if (!category) newErrors.category = "Kategoriya tanlanishi shart";
    if (!branch) newErrors.branch = "Filial tanlanishi shart";
    if (!price || isNaN(price) || Number(price) < 0) newErrors.price = "Narx 0 dan katta yoki teng bo'lishi kerak";
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) newErrors.quantity = "Miqdor 0 dan katta bo'lishi kerak";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleAdd = async () => {
    if (!validateFields()) {
      setNotification({ message: "Barcha maydonlarni to'g'ri to'ldiring!", type: 'error' });
      return;
    }

    const newProduct = {
      name,
      barcode: barcode || null,
      model,
      category: category ? { connect: { id: Number(category) } } : undefined,
      branch: branch ? { connect: { id: Number(branch) } } : undefined,
      price: Number(price),
      quantity: Number(quantity),
      status: 'IN_WAREHOUSE',
      createdAt: new Date().toISOString(),
    };

    setSubmitting(true);
    try {
      const response = await axiosWithAuth({
        method: 'post',
        url: `${API_URL}/products`,
        data: newProduct,
      });

      setNotification({ message: `Tovar "${name}" muvaffaqiyatli qo'shildi!`, type: 'success' });
      setModalOpen(false);
      resetForm();
      if (onProductAdded) onProductAdded();
    } catch (err) {
      console.error('Saqlashda xatolik:', err.response?.data || err.message);
      let errorMessage = err.message || "Noma'lum xatolik yuz berdi";
      if (err.response?.status === 409) {
        errorMessage = 'Bu shtrix kod allaqachon mavjud';
        setErrors((prev) => ({ ...prev, barcode: errorMessage }));
      }
      setNotification({ message: errorMessage, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setName('');
    setBarcode('');
    setModel('');
    setCategory('');
    setBranch('');
    setPrice('');
    setQuantity('');
    setErrors({});
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  // Handle input changes with validation
  const handleInputChange = (setter, field) => (e) => {
    const value = field === 'price' || field === 'quantity' ? parseNumber(e.target.value) : e.target.value;
    setter(value);
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <p className="text-gray-600 font-medium">Ma'lumotlar yuklanmoqda...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tovar qo‘shish</h1>
            <p className="text-gray-600 mt-1">Yangi mahsulotni omborga kiritish</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105"
            aria-label="Yangi tovar qo'shish"
          >
            <Plus className="w-5 h-5" />
            <span>Yangi tovar</span>
          </button>
        </div>

        {modalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
            role="dialog"
            aria-labelledby="kirim-modal-title"
            aria-modal="true"
          >
            <div
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-100 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 id="kirim-modal-title" className="text-xl font-bold text-gray-900">Yangi tovar qo‘shish</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Modalni yopish"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <Tag className="w-4 h-4" />
                    Nomi
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="Tovar nomini kiriting"
                    value={name}
                    onChange={handleInputChange(setName, 'name')}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-blue-500/20'
                    }`}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    aria-required="true"
                  />
                  {errors.name && (
                    <span id="name-error" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.name}
                    </span>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <Barcode className="w-4 h-4" />
                    Shtrix
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="Shtrix kodini kiriting"
                    value={barcode}
                    onChange={handleInputChange(setBarcode, 'barcode')}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.barcode ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-blue-500/20'
                    }`}
                    aria-describedby={errors.barcode ? 'barcode-error' : undefined}
                    aria-required="true"
                  />
                  {errors.barcode && (
                    <span id="barcode-error" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.barcode}
                    </span>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <Settings className="w-4 h-4" />
                    Model
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="Modelni kiriting"
                    value={model}
                    onChange={handleInputChange(setModel, 'model')}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.model ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-blue-500/20'
                    }`}
                    aria-describedby={errors.model ? 'model-error' : undefined}
                    aria-required="true"
                  />
                  {errors.model && (
                    <span id="model-error" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.model}
                    </span>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <Tag className="w-4 h-4" />
                    Kategoriya
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={handleInputChange(setCategory, 'category')}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.category ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-blue-500/20'
                    }`}
                    aria-describedby={errors.category ? 'category-error' : undefined}
                    aria-required="true"
                  >
                    <option value="">Kategoriyani tanlang</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <span id="category-error" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.category}
                    </span>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <Building className="w-4 h-4" />
                    Filial
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={branch}
                    onChange={handleInputChange(setBranch, 'branch')}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.branch ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-blue-500/20'
                    }`}
                    aria-describedby={errors.branch ? 'branch-error' : undefined}
                    aria-required="true"
                  >
                    <option value="">Filialni tanlang</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  {errors.branch && (
                    <span id="branch-error" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.branch}
                    </span>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <DollarSign className="w-4 h-4" />
                    Narxi (so‘m)
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Narxni kiriting"
                    value={formatCurrency(price)}
                    onChange={(e) => handleInputChange(setPrice, 'price')(e)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.price ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-blue-500/20'
                    }`}
                    aria-describedby={errors.price ? 'price-error' : undefined}
                    aria-required="true"
                  />
                  {errors.price && (
                    <span id="price-error" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.price}
                    </span>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <Package className="w-4 h-4" />
                    Miqdori
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Miqdorni kiriting"
                    value={formatQuantity(quantity)}
                    onChange={(e) => handleInputChange(setQuantity, 'quantity')(e)}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.quantity ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:ring-blue-500/20'
                    }`}
                    aria-describedby={errors.quantity ? 'quantity-error' : undefined}
                    aria-required="true"
                  />
                  {errors.quantity && (
                    <span id="quantity-error" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.quantity}
                    </span>
                  )}
                </div>

                {name && quantity && price && branch && category && model && !Object.keys(errors).length && (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Check className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">Kirim xulosasi</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Mahsulot nomi:</span>
                        <span className="font-semibold text-green-600">{name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Shtrix:</span>
                        <span className="font-semibold text-green-600">{barcode || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Model:</span>
                        <span className="font-semibold text-green-600">{model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Kategoriya:</span>
                        <span className="font-semibold text-green-600">{categories.find((c) => c.id === Number(category))?.name || "Noma'lum"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Filial:</span>
                        <span className="font-semibold text-green-600">{branches.find((b) => b.id === Number(branch))?.name || 'Noma\'lum'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Miqdor:</span>
                        <span className="font-semibold text-green-600">{formatQuantity(Number(quantity))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Birlik narxi:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(Number(price))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Status:</span>
                        <span className="font-semibold text-green-600">Skladda</span>
                      </div>
                      <div className="border-t border-green-200 pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="text-green-700 font-medium">Jami summa:</span>
                          <span className="font-bold text-green-600 text-lg">{formatCurrency(Number(quantity) * Number(price))}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleAdd}
                    disabled={submitting}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      submitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                    }`}
                    aria-label="Tovarni saqlash"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Yuklanmoqda...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Saqlash
                      </>
                    )}
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                    aria-label="Bekor qilish"
                  >
                    Bekor
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
      </div>
    </div>
  );
};

export default React.memo(Kirim);