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
  Building2,
  Users,
  DollarSign,
  Package,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Branches = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const branches = [
    {
      id: 'B001',
      name: 'Марказий Филиал',
      address: 'Тошкент, Амир Темур кўчаси 15',
      phone: '+998 71 123 45 67',
      email: 'markaziy@dokon.uz',
      manager: 'Акмал Тошматов',
      employeeCount: 12,
      monthlyRevenue: 85000000,
      monthlyTarget: 80000000,
      inventoryValue: 45000000,
      status: 'active',
      openingDate: '2020-03-15',
      workingHours: '09:00 - 21:00',
      area: 250
    },
    {
      id: 'B002',
      name: 'Чилонзор Филиали',
      address: 'Тошкент, Чилонзор тумани, Бунёдкор кўчаси 28',
      phone: '+998 71 234 56 78',
      email: 'chilonzor@dokon.uz',
      manager: 'Зарина Каримова',
      employeeCount: 8,
      monthlyRevenue: 62000000,
      monthlyTarget: 65000000,
      inventoryValue: 32000000,
      status: 'active',
      openingDate: '2021-06-20',
      workingHours: '10:00 - 20:00',
      area: 180
    },
    {
      id: 'B003',
      name: 'Юнусобод Филиали',
      address: 'Тошкент, Юнусобод тумани, Абдулла Қодирий кўчаси 45',
      phone: '+998 71 345 67 89',
      email: 'yunusobod@dokon.uz',
      manager: 'Жасур Эргашев',
      employeeCount: 10,
      monthlyRevenue: 73000000,
      monthlyTarget: 70000000,
      inventoryValue: 38000000,
      status: 'active',
      openingDate: '2021-09-10',
      workingHours: '09:30 - 20:30',
      area: 220
    },
    {
      id: 'B004',
      name: 'Сергели Филиали',
      address: 'Тошкент, Сергели тумани, Янги Сергели кўчаси 12',
      phone: '+998 71 456 78 90',
      email: 'sergeli@dokon.uz',
      manager: 'Мадина Султанова',
      employeeCount: 6,
      monthlyRevenue: 45000000,
      monthlyTarget: 50000000,
      inventoryValue: 25000000,
      status: 'maintenance',
      openingDate: '2022-02-14',
      workingHours: '10:00 - 19:00',
      area: 150
    },
    {
      id: 'B005',
      name: 'Олмазор Филиали',
      address: 'Тошкент, Олмазор тумани, Фаробий кўчаси 33',
      phone: '+998 71 567 89 01',
      email: 'olmazor@dokon.uz',
      manager: 'Равшан Назаров',
      employeeCount: 9,
      monthlyRevenue: 58000000,
      monthlyTarget: 60000000,
      inventoryValue: 30000000,
      status: 'active',
      openingDate: '2022-05-25',
      workingHours: '09:00 - 20:00',
      area: 200
    },
    {
      id: 'B006',
      name: 'Миробод Филиали',
      address: 'Тошкент, Миробод тумани, Навоий кўчаси 67',
      phone: '+998 71 678 90 12',
      email: 'mirobod@dokon.uz',
      manager: 'Гулнора Абдуллаева',
      employeeCount: 7,
      monthlyRevenue: 0,
      monthlyTarget: 55000000,
      inventoryValue: 28000000,
      status: 'inactive',
      openingDate: '2023-01-10',
      workingHours: '10:00 - 19:00',
      area: 170
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Фаол';
      case 'inactive':
        return 'Фаол эмас';
      case 'maintenance':
        return 'Таъмирлаш';
      default:
        return 'Номаълум';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'inactive':
        return <AlertCircle className="text-red-500" size={16} />;
      case 'maintenance':
        return <Clock className="text-yellow-500" size={16} />;
      default:
        return <Building2 className="text-gray-500" size={16} />;
    }
  };

  const getPerformanceColor = (revenue, target) => {
    if (revenue >= target) return 'text-green-600';
    if (revenue >= target * 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceIcon = (revenue, target) => {
    if (revenue >= target) return <TrendingUp className="text-green-500" size={16} />;
    return <TrendingDown className="text-red-500" size={16} />;
  };

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || branch.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalBranches = branches.length;
  const activeBranches = branches.filter(b => b.status === 'active').length;
  const totalEmployees = branches.reduce((sum, branch) => sum + branch.employeeCount, 0);
  const totalRevenue = branches.reduce((sum, branch) => sum + branch.monthlyRevenue, 0);
  const totalTarget = branches.reduce((sum, branch) => sum + branch.monthlyTarget, 0);
  const totalInventoryValue = branches.reduce((sum, branch) => sum + branch.inventoryValue, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Филиаллар Бошқаруви</h1>
          <p className="text-gray-600 mt-1">Барча филиаллар маълумотлари ва статистикаси</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <Plus size={20} className="mr-2" />
          Янги Филиал
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg mr-4">
              <Building2 className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Жами Филиаллар</p>
              <p className="text-2xl font-bold text-gray-900">{totalBranches}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg mr-4">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Фаол Филиаллар</p>
              <p className="text-2xl font-bold text-gray-900">{activeBranches}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg mr-4">
              <Users className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Жами Ходимлар</p>
              <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg mr-4">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Умумий Даромад</p>
              <p className="text-xl font-bold text-gray-900">{(totalRevenue / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-50 rounded-lg mr-4">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Мақсад</p>
              <p className="text-xl font-bold text-gray-900">{(totalTarget / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-50 rounded-lg mr-4">
              <Package className="text-indigo-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Инвентар</p>
              <p className="text-xl font-bold text-gray-900">{(totalInventoryValue / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Филиаллар Самарадорлиги</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Умумий Мақсадга Эришиш</span>
            <span className={`text-sm font-semibold ${getPerformanceColor(totalRevenue, totalTarget)}`}>
              {((totalRevenue / totalTarget) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${totalRevenue >= totalTarget ? 'bg-green-600' : 'bg-yellow-600'}`}
              style={{ width: `${Math.min((totalRevenue / totalTarget) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Филиал номи, манзил ёки менежери..."
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
              <option value="maintenance">Таъмирлаш</option>
              <option value="inactive">Фаол эмас</option>
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
                  Филиал
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Манзил
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Менежери
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ходимлар
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ойлик Даромад
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Мақсад
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Самарадорлик
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
              {filteredBranches.map((branch) => (
                <tr key={branch.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-4">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{branch.name}</div>
                        <div className="text-sm text-gray-500">ID: {branch.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <MapPin size={14} className="mr-2 mt-1 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-900">{branch.address}</div>
                        <div className="text-xs text-gray-500">{branch.area}м² • {branch.workingHours}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">{branch.manager}</div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone size={12} className="mr-1" />
                        {branch.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users size={14} className="mr-2 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{branch.employeeCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {branch.monthlyRevenue.toLocaleString()} сўм
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {branch.monthlyTarget.toLocaleString()} сўм
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPerformanceIcon(branch.monthlyRevenue, branch.monthlyTarget)}
                      <span className={`ml-2 text-sm font-medium ${getPerformanceColor(branch.monthlyRevenue, branch.monthlyTarget)}`}>
                        {branch.monthlyTarget > 0 ? ((branch.monthlyRevenue / branch.monthlyTarget) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(branch.status)}
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(branch.status)}`}>
                        {getStatusText(branch.status)}
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

export default Branches;