import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  Save,
  X,
  Eye
} from 'lucide-react';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    minStock: 0,
    supplier: '',
    description: '',
    sku: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const productsData = [
          {
            id: '001',
            name: 'iPhone 14 Pro',
            category: 'Телефонлар',
            price: 15000000,
            stock: 25,
            minStock: 10,
            supplier: 'Apple Store',
            status: 'in_stock',
            lastUpdated: '2024-01-15',
            description: 'Энг янги iPhone модели',
            sku: 'APL-IP14P-128'
          },
          {
            id: '002',
            name: 'Samsung Galaxy S23',
            category: 'Телефонлар',
            price: 12500000,
            stock: 8,
            minStock: 15,
            supplier: 'Samsung Uzbekistan',
            status: 'low_stock',
            lastUpdated: '2024-01-14',
            description: 'Samsung энг янги флагман телефони',
            sku: 'SAM-GS23-256'
          },
          {
            id: '003',
            name: 'MacBook Air M2',
            category: 'Ноутбуклар',
            price: 25000000,
            stock: 0,
            minStock: 5,
            supplier: 'Apple Store',
            status: 'out_of_stock',
            lastUpdated: '2024-01-13',
            description: 'M2 чип билан энг янги MacBook',
            sku: 'APL-MBA-M2-512'
          },
          {
            id: '004',
            name: 'AirPods Pro 2',
            category: 'Аксессуарлар',
            price: 3500000,
            stock: 45,
            minStock: 20,
            supplier: 'Apple Store',
            status: 'in_stock',
            lastUpdated: '2024-01-15',
            description: 'Шовқинни бекор қилувчи қулоқчинлар',
            sku: 'APL-APP2-WHT'
          },
          {
            id: '005',
            name: 'Dell XPS 13',
            category: 'Ноутбуклар',
            price: 18000000,
            stock: 12,
            minStock: 8,
            supplier: 'Dell Technologies',
            status: 'in_stock',
            lastUpdated: '2024-01-14',
            description: 'Юқори сифатли ультрабук',
            sku: 'DEL-XPS13-I7'
          }
        ];

        const categoriesData = [
          { id: 'telefonlar', name: 'Телефонлар', description: 'Смартфонлар ва мобил қурилмалар' },
          { id: 'noutbuklar', name: 'Ноутбуклар', description: 'Ноутбук ва ультрабук компютерлар' },
          { id: 'aksessuarlar', name: 'Аксессуарлар', description: 'Телефонлар ва компютерлар учун аксессуарлар' },
          { id: 'planshets', name: 'Планшетлар', description: 'Планшет компютерлар' }
        ];

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Маълумотларни юклашда хатолик:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const updateProductStatus = (product) => {
    let status = 'in_stock';
    if (product.stock === 0) {
      status = 'out_of_stock';
    } else if (product.stock <= product.minStock) {
      status = 'low_stock';
    }
    return { ...product, status };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in_stock':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'low_stock':
        return <AlertCircle className="text-yellow-500" size={20} />;
      case 'out_of_stock':
        return <Clock className="text-red-500" size={20} />;
      default:
        return <Package className="text-gray-500" size={20} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'in_stock':
        return 'Мавжуд';
      case 'low_stock':
        return 'Кам қолди';
      case 'out_of_stock':
        return 'Тугатилган';
      default:
        return 'Номаълум';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    if (!formData.name || !formData.category || !formData.supplier) {
      alert('Илтимос, мажбурий майдонларни тўлдиринг!');
      return;
    }

    const newProduct = {
      id: (products.length + 1).toString().padStart(3, '0'),
      name: formData.name,
      category: formData.category,
      price: formData.price || 0,
      stock: formData.stock || 0,
      minStock: formData.minStock || 0,
      supplier: formData.supplier,
      status: 'in_stock',
      lastUpdated: new Date().toISOString().split('T')[0],
      description: formData.description || '',
      sku: formData.sku || ''
    };

    const updatedProduct = updateProductStatus(newProduct);
    setProducts([...products, updatedProduct]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditProduct = () => {
    if (!currentProduct || !formData.name || !formData.category || !formData.supplier) {
      alert('Илтимос, мажбурий майдонларни тўлдиринг!');
      return;
    }

    const updatedProduct = {
      ...currentProduct,
      name: formData.name,
      category: formData.category,
      price: formData.price || 0,
      stock: formData.stock || 0,
      minStock: formData.minStock || 0,
      supplier: formData.supplier,
      lastUpdated: new Date().toISOString().split('T')[0],
      description: formData.description || '',
      sku: formData.sku || ''
    };

    const finalProduct = updateProductStatus(updatedProduct);
    setProducts(products.map(p => p.id === currentProduct.id ? finalProduct : p));
    setShowEditModal(false);
    setCurrentProduct(null);
    resetForm();
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Бу маҳсулотни ўчиришни хоҳлайсизми?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      supplier: product.supplier,
      description: product.description || '',
      sku: product.sku || ''
    });
    setShowEditModal(true);
  };

  const openViewModal = (product) => {
    setCurrentProduct(product);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: 0,
      stock: 0,
      minStock: 0,
      supplier: '',
      description: '',
      sku: ''
    });
  };

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Инвентар Бошқаруви</h1>
          <p className="text-gray-600 mt-1">Маҳсулотлар ва захираларни бошқаринг</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
        >
          <Plus size={20} className="mr-2" />
          Янги Маҳсулот
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Маҳсулот номи, SKU ёки таъминотчи бўйича қидиринг..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Filter className="text-gray-400 mr-2" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">Барча категорилар</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg mr-4">
              <Package className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Жами Маҳсулотлар</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg mr-4">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Мавжуд</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.status === 'in_stock').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg mr-4">
              <AlertCircle className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Кам Қолган</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.status === 'low_stock').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-50 rounded-lg mr-4">
              <Clock className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Тугатилган</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.status === 'out_of_stock').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Маҳсулот
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категория
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Нарx
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Захира
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ҳолат
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Таъминотчи
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Амаллар
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      ID: {product.id} {product.sku && `• SKU: ${product.sku}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.price.toLocaleString()} сўм
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.stock} дона</div>
                    <div className="text-xs text-gray-500">Мин: {product.minStock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(product.status)}
                      <span className="ml-2 text-sm text-gray-700">
                        {getStatusText(product.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openViewModal(product)}
                        className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                        title="Кўриш"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => openEditModal(product)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                        title="Таҳрирлаш"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                        title="Ўчириш"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Маҳсулот топилмади</h3>
            <p className="mt-1 text-sm text-gray-500">Қидирув критерияларига мос маҳсулот йўқ.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); resetForm(); }}
        title="Янги Маҳсулот Қўшиш"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Маҳсулот номи *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Маҳсулот номини киритинг"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Маҳсулот SKU"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Категорияни танланг</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Таъминотчи *
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Таъминотчи номи"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Нарx (сўм)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Захира (дона)
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Мин. захира
              </label>
              <input
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тавсиф
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Маҳсулот ҳақида қўшимча маълумот"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => { setShowAddModal(false); resetForm(); }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Бекор қилиш
            </button>
            <button
              onClick={handleAddProduct}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Save size={16} className="mr-2" />
              Сақлаш
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setCurrentProduct(null); resetForm(); }}
        title="Маҳсулотни Таҳрирлаш"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Маҳсулот номи *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Маҳсулот номини киритинг"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Маҳсулот SKU"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Категорияни танланг</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Таъминотчи *
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Таъминотчи номи"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Нарx (сўм)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Захира (дона)
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Мин. захира
              </label>
              <input
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тавсиф
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Маҳсулот ҳақида қўшимча маълумот"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => { setShowEditModal(false); setCurrentProduct(null); resetForm(); }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Бекор қилиш
            </button>
            <button
              onClick={handleEditProduct}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Save size={16} className="mr-2" />
              Янгилаш
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showViewModal}
        onClose={() => { setShowViewModal(false); setCurrentProduct(null); }}
        title="Маҳсулот Маълумотлари"
      >
        {currentProduct && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Маҳсулот номи
                  </label>
                  <p className="text-lg font-semibold text-gray-900">{currentProduct.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    ID / SKU
                  </label>
                  <p className="text-gray-900">
                    {currentProduct.id} {currentProduct.sku && `• ${currentProduct.sku}`}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Категория
                  </label>
                  <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                    {currentProduct.category}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Таъминотчи
                  </label>
                  <p className="text-gray-900">{currentProduct.supplier}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Нарx
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {currentProduct.price.toLocaleString()} сўм
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Захира
                  </label>
                  <p className="text-gray-900">
                    {currentProduct.stock} дона 
                    <span className="text-sm text-gray-500 ml-2">
                      (Мин: {currentProduct.minStock})
                    </span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Ҳолат
                  </label>
                  <div className="flex items-center">
                    {getStatusIcon(currentProduct.status)}
                    <span className="ml-2 text-gray-900">
                      {getStatusText(currentProduct.status)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Охирги янгиланиш
                  </label>
                  <p className="text-gray-900">{currentProduct.lastUpdated}</p>
                </div>
              </div>
            </div>

            {currentProduct.description && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Тавсиф
                </label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                  {currentProduct.description}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => { setShowViewModal(false); openEditModal(currentProduct); }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Edit3 size={16} className="mr-2" />
                Таҳрирлаш
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Inventory;