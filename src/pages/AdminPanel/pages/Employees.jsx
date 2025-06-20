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
  UserCheck,
  UserX,
  Shield,
  User
} from 'lucide-react';

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const employees = [
    {
      id: 'E001',
      name: 'Акмал Тошматов',
      email: 'akmal.toshmatov@dokon.uz',
      phone: '+998 90 123 45 67',
      position: 'Дўкон Мудири',
      department: 'Бошқарув',
      salary: 8000000,
      hireDate: '2022-03-15',
      status: 'active',
      role: 'admin'
    },
    {
      id: 'E002',
      name: 'Зарина Каримова',
      email: 'zarina.karimova@dokon.uz',
      phone: '+998 91 234 56 78',
      position: 'Сотувчи',
      department: 'Савдо',
      salary: 4500000,
      hireDate: '2023-01-20',
      status: 'active',
      role: 'sales'
    },
    {
      id: 'E003',
      name: 'Жасур Эргашев',
      email: 'jasur.ergashev@dokon.uz',
      phone: '+998 93 345 67 89',
      position: 'Кассир',
      department: 'Савдо',
      salary: 4000000,
      hireDate: '2023-05-10',
      status: 'active',
      role: 'cashier'
    },
    {
      id: 'E004',
      name: 'Мадина Султанова',
      email: 'madina.sultanova@dokon.uz',
      phone: '+998 94 456 78 90',
      position: 'Омборчи',
      department: 'Омбор',
      salary: 3800000,
      hireDate: '2022-11-05',
      status: 'on_leave',
      role: 'manager'
    },
    {
      id: 'E005',
      name: 'Равшан Назаров',
      email: 'ravshan.nazarov@dokon.uz',
      phone: '+998 95 567 89 01',
      position: 'Ёрдамчи Сотувчи',
      department: 'Савдо',
      salary: 4500000,
      hireDate: '2023-08-05',
      status: 'active',
      role: 'sales'
    },
    {
      id: 'E006',
      name: 'Гулнора Абдуллаева',
      email: 'gulnora.abdullayeva@dokon.uz',
      phone: '+998 97 678 90 12',
      position: 'Ҳисобчи',
      department: 'Молия',
      salary: 5500000,
      hireDate: '2022-07-10',
      status: 'active',
      role: 'contributor'
    }
  ];

  const departments = [
    'all',
    'Бошқарув',
    'Савдо',
    'Омбор',
    'Молия'
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'badge badge-success';
      case 'inactive':
        return 'badge badge-error';
      case 'on_leave':
        return 'badge badge-warning';
      default:
        return 'badge badge-info';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Фаол';
      case 'inactive':
        return 'Ишламайди';
      case 'on_leave':
        return 'Таътилда';
      default:
        return 'Номаълум';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <UserCheck className="text-blue-600" size={20} />;
      case 'inactive':
        return null;
      case 'on_leave':
        return <Calendar className="text-yellow-600" size={20} />;
      default:
        return <User className="text-gray-500" size={20} />;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="text-red-500" size={16} />;
      case 'manager':
        return <Shield className="text-blue-500" size={16} />;
      default:
        return <User className="text-gray-500" size={16} />;
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin':
        return 'Администратор';
      case 'manager':
        return 'Менежер';
      case 'cashier':
        return 'Кассир';
      case 'sales':
        return 'Сотувчи';
      default:
        return 'Ходим';
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || employee.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const onLeaveEmployees = employees.filter(e => e.status === 'on_leave').length;
  const totalSalary = employees.filter(e => e.status === 'active').reduce((sum, emp) => sum + emp.salary, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Ходимлар Бошқаруви</h1>
          <p className="text-gray-500 mt-1">Ходимлар маълумотлари ва бошқаруви</p>
        </div>
        <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <Plus size={20} className="mr-2" />
          Янги Ходим
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <User className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Жами Ходимлар</p>
              <p className="text-2xl font-semibold text-gray-900">{totalEmployees}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <UserCheck className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Фаол Ходимлар</p>
              <p className="text-2xl font-semibold text-gray-900">{activeEmployees}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Calendar className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Таътилда</p>
              <p className="text-2xl font-semibold text-gray-900">{onLeaveEmployees}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Shield className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Умумий Ойлик</p>
              <p className="text-xl font-semibold text-gray-900">{(totalSalary / 1000000).toFixed(1)}M</p>
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
              placeholder="Ходим номи, email ёки лавозим..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center">
              <Filter className="text-gray-400 mr-2" size={20} />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'Барча бўлимлар' : dept}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Барча ҳолатлар</option>
              <option value="active">Фаол</option>
              <option value="on_leave">Таътилда</option>
              <option value="inactive">Ишламайди</option>
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
                  Ходим
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Лавозим / Бўлим
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Алоқа
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ойлик Маош
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Иш Бошлаган Сана
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Рол
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
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-4">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">ID: {employee.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{employee.position}</div>
                      <div className="text-sm text-gray-500">{employee.department}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail size={14} className="mr-2" />
                        <span className="truncate">{employee.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone size={14} className="mr-2" />
                        {employee.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {employee.salary.toLocaleString()} сўм
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="mr-2" />
                      {employee.hireDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRoleIcon(employee.role)}
                      <span className="ml-2 text-sm text-gray-700">
                        {getRoleText(employee.role)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(employee.status)}
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(employee.status)}`}>
                        {getStatusText(employee.status)}
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

export default Employees;