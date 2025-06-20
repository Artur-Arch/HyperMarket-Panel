import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  MapPin,
  Eye,
  Edit3,
  ShoppingBag,
  Calendar,
  Star
} from 'lucide-react';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const customers = [
    {
      id: 'C001',
      name: 'Азиз Каримов',
      email: 'aziz.karimov@email.com',
      phone: '+998 90 123 45 67',
      address: 'Тошкент, Чилонзор тумани',
      totalPurchases: 45000000,
      lastPurchase: '2024-01-15',
      registrationDate: '2023-06-15',
      status: 'vip'
    },
    {
      id: 'C002',
      name: 'Малика Тошева',
      email: 'malika.tosheva@email.com',
      phone: '+998 91 234 56 78',
      address: 'Тошкент, Миробод тумани',
      totalPurchases: 28000000,
      lastPurchase: '2024-01-14',
      registrationDate: '2023-08-20',
      status: 'active'
    },
    {
      id: 'C003',
      name: 'Жаҳонгир Умаров',
      email: 'jahongir.umarov@email.com',
      phone: '+998 93 345 67 89',
      address: 'Тошкент, Юнусобод тумани',
      totalPurchases: 18500000,
      lastPurchase: '2024-01-12',
      registrationDate: '2023-09-10',
      status: 'active'
    },
    {
      id: 'C004',
      name: 'Нилуфар Саидова',
      email: 'nilufar.saidova@email.com',
      phone: '+998 94 456 78 90',
      address: 'Тошкент, Шайхонтоҳур тумани',
      totalPurchases: 8200000,
      lastPurchase: '2023-12-28',
      registrationDate: '2023-05-12',
      status: 'inactive'
    },
    {
      id: 'C005',
      name: 'Бобур Раҳимов',
      email: 'bobur.rahimov@email.com',
      phone: '+998 95 567 89 01',
      address: 'Тошкент, Сергели тумани',
      totalPurchases: 52000000,
      lastPurchase: '2024-01-13',
      registrationDate: '2022-11-08',
      status: 'vip'
    },
    {
      id: 'C006',
      name: 'Дилдора Назарова',
      email: 'dildora.nazarova@email.com',
      phone: '+998 97 678 90 12',
      address: 'Тошкент, Олмазор тумани',
      totalPurchases: 15600000,
      lastPurchase: '2024-01-11',
      registrationDate: '2023-07-25',
      status: 'active'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'vip':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'vip':
        return 'VIP';
      case 'active':
        return 'Фаол';
      case 'inactive':
        return 'Нофаол';
      default:
        return 'Номаълум';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'vip') {
      return <Star className="text-yellow-500 mr-1" size={20} />;
    }
    return null;
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const vipCustomers = customers.filter(c => c.status === 'vip').length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalPurchases, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Мижозлар Бошқаруви</h1>
          <p className="text-gray-500 mt-1">Мижозлар маълумотлари ва статистика</p>
        </div>
        <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <Plus size={20} className="mr-2" />
          Янги Мижоз
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <ShoppingBag className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Жами Мижозлар</p>
              <p className="text-2xl font-semibold text-gray-900">{totalCustomers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <ShoppingBag className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Фаол Мижозлар</p>
              <p className="text-2xl font-semibold text-gray-900">{activeCustomers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Star className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">VIP Мижозлар</p>
              <p className="text-2xl font-semibold text-gray-900">{vipCustomers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <ShoppingBag className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Жами Савдо</p>
              <p className="text-xl font-semibold text-gray-900">{(totalRevenue / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Мижоз номи, email ёки телефон рақами..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <Filter className="text-gray-400 mr-2" size={20} />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Барча ҳолатлар</option>
              <option value="active">Фаол</option>
              <option value="vip">VIP</option>
              <option value="inactive">Нофаол</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Мижоз
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Алоқа
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Манзил
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Жами Харидлар
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Охирги Харид
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ҳолат
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Амаллар
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-4">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">ID: {customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail size={14} className="mr-2" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone size={14} className="mr-2" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={14} className="mr-2" />
                      {customer.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {customer.totalPurchases.toLocaleString()} сўм
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="mr-2" />
                      {customer.lastPurchase}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(customer.status)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(customer.status)}`}>
                        {getStatusText(customer.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50">
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;