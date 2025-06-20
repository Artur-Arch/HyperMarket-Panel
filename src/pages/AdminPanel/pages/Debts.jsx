import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  Calendar,
  Eye,
  Edit3,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  CreditCard,
  User,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const Debts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');

  const debts = [
    {
      id: 'D001',
      customerName: 'Азиз Каримов',
      customerPhone: '+998 90 123 45 67',
      customerEmail: 'aziz.karimov@email.com',
      totalAmount: 15000000,
      paidAmount: 5000000,
      remainingAmount: 10000000,
      dueDate: '2024-02-15',
      createdDate: '2024-01-15',
      status: 'active',
      description: 'iPhone 14 Pro ва аксессуарлар',
      branch: 'Марказий филиал'
    },
    {
      id: 'D002',
      customerName: 'Малика Тошева',
      customerPhone: '+998 91 234 56 78',
      customerEmail: 'malika.tosheva@email.com',
      totalAmount: 8500000,
      paidAmount: 0,
      remainingAmount: 8500000,
      dueDate: '2024-01-20',
      createdDate: '2023-12-20',
      status: 'overdue',
      description: 'Samsung Galaxy S23',
      branch: 'Чилонзор филиали'
    },
    {
      id: 'D003',
      customerName: 'Жаҳонгир Умаров',
      customerPhone: '+998 93 345 67 89',
      customerEmail: 'jahongir.umarov@email.com',
      totalAmount: 25000000,
      paidAmount: 25000000,
      remainingAmount: 0,
      dueDate: '2024-01-10',
      createdDate: '2023-12-10',
      status: 'paid',
      description: 'MacBook Air M2',
      branch: 'Юнусобод филиали'
    },
    {
      id: 'D004',
      customerName: 'Нилуфар Саидова',
      customerPhone: '+998 94 456 78 90',
      customerEmail: 'nilufar.saidova@email.com',
      totalAmount: 12000000,
      paidAmount: 7000000,
      remainingAmount: 5000000,
      dueDate: '2024-02-01',
      createdDate: '2024-01-01',
      status: 'partial',
      description: 'Dell XPS 13 ва аксессуарлар',
      branch: 'Сергели филиали'
    },
    {
      id: 'D005',
      customerName: 'Бобур Раҳимов',
      customerPhone: '+998 95 567 89 01',
      customerEmail: 'bobur.rahimov@email.com',
      totalAmount: 6500000,
      paidAmount: 2000000,
      remainingAmount: 4500000,
      dueDate: '2024-01-25',
      createdDate: '2023-12-25',
      status: 'overdue',
      description: 'iPad Air ва Apple Pencil',
      branch: 'Марказий филиал'
    },
    {
      id: 'D006',
      customerName: 'Дилдора Назарова',
      customerPhone: '+998 97 678 90 12',
      customerEmail: 'dildora.nazarova@email.com',
      totalAmount: 4200000,
      paidAmount: 1500000,
      remainingAmount: 2700000,
      dueDate: '2024-02-20',
      createdDate: '2024-01-20',
      status: 'active',
      description: 'AirPods Pro 2 ва аксессуарлар',
      branch: 'Олмазор филиали'
    }
  ];

  const branches = ['all', 'Марказий филиал', 'Чилонзор филиали', 'Юнусобод филиали', 'Сергели филиали', 'Олмазор филиали'];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Фаол';
      case 'overdue':
        return 'Муддати ўтган';
      case 'paid':
        return 'Тўланган';
      case 'partial':
        return 'Қисман тўланган';
      default:
        return 'Номаълум';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Clock className="text-blue-500" size={16} />;
      case 'overdue':
        return <AlertTriangle className="text-red-500" size={16} />;
      case 'paid':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'partial':
        return <CreditCard className="text-yellow-500" size={16} />;
      default:
        return <Clock className="text-gray-500" size={16} />;
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const filteredDebts = debts.filter(debt => {
    const matchesSearch = debt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         debt.customerPhone.includes(searchTerm) ||
                         debt.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || debt.status === selectedStatus;
    const matchesBranch = selectedBranch === 'all' || debt.branch === selectedBranch;
    return matchesSearch && matchesStatus && matchesBranch;
  });

  const totalDebts = debts.length;
  const activeDebts = debts.filter(d => d.status === 'active' || d.status === 'partial').length;
  const overdueDebts = debts.filter(d => d.status === 'overdue').length;
  const totalDebtAmount = debts.filter(d => d.status !== 'paid').reduce((sum, debt) => sum + debt.remainingAmount, 0);
  const totalPaidAmount = debts.reduce((sum, debt) => sum + debt.paidAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Қарздорлик Бошқаруви</h1>
          <p className="text-gray-500 mt-1">Мижозлар қарзи ва тўловларни кузатиш</p>
        </div>
        <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <Plus size={20} className="mr-2" />
          Янги Қарз
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <CreditCard className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Жами Қарзлар</p>
              <p className="text-2xl font-semibold text-gray-900">{totalDebts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Фаол Қарзлар</p>
              <p className="text-2xl font-semibold text-gray-900">{activeDebts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Муддати Ўтган</p>
              <p className="text-2xl font-semibold text-gray-900">{overdueDebts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <TrendingDown className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Қолган Қарз</p>
              <p className="text-xl font-semibold text-gray-900">{(totalDebtAmount / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Тўланган</p>
              <p className="text-xl font-semibold text-gray-900">{(totalPaidAmount / 1000000).toFixed(1)}M</p>
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
              placeholder="Мижоз номи, телефон ёки маҳсулот..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center">
              <Filter className="text-gray-400 mr-2" size={20} />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Барча ҳолатлар</option>
                <option value="active">Фаол</option>
                <option value="partial">Қисман тўланган</option>
                <option value="overdue">Муддати ўтган</option>
                <option value="paid">Тўланган</option>
              </select>
            </div>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {branches.map(branch => (
                <option key={branch} value={branch}>
                  {branch === 'all' ? 'Барча филиаллар' : branch}
                </option>
              ))}
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
                  Маҳсулот
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Жами Сумма
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тўланган
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Қолган
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Муддат
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Филиал
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
              {filteredDebts.map((debt) => (
                <tr key={debt.id} className={`hover:bg-gray-50 transition-colors duration-150 ${debt.status === 'overdue' ? 'bg-red-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-4">
                        {debt.customerName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{debt.customerName}</div>
                        <div className="text-sm text-gray-500">ID: {debt.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone size={14} className="mr-2" />
                        {debt.customerPhone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail size={14} className="mr-2" />
                        <span className="truncate">{debt.customerEmail}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{debt.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {debt.totalAmount.toLocaleString()} сўм
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      {debt.paidAmount.toLocaleString()} сўм
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-semibold ${debt.remainingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {debt.remainingAmount.toLocaleString()} сўм
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm">
                      <Calendar size={14} className="mr-2" />
                      <span className={isOverdue(debt.dueDate) && debt.status !== 'paid' ? 'text-red-600 font-medium' : 'text-gray-600'}>
                        {debt.dueDate}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {debt.branch}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(debt.status)}
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(debt.status)}`}>
                        {getStatusText(debt.status)}
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
                      <button className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50">
                        <DollarSign size={16} />
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

export default Debts;