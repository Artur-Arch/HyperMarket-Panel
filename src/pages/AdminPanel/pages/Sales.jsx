import React, { useState } from 'react';
import { 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Filter,
  Download,
  Plus,
  CreditCard,
  Banknote,
  Clock
} from 'lucide-react';

const Sales = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const sales = [
    {
      id: 'S001',
      customerName: 'Азиз Каримов',
      items: ['iPhone 14 Pro', 'AirPods Pro'],
      total: 18500000,
      paymentMethod: 'card',
      status: 'completed',
      date: '2024-01-15',
      time: '14:30'
    },
    {
      id: 'S002',
      customerName: 'Малика Тошева',
      items: ['Samsung Galaxy S23', 'Samsung Charger'],
      total: 12750000,
      paymentMethod: 'cash',
      status: 'completed',
      date: '2024-01-15',
      time: '13:45'
    },
    {
      id: 'S003',
      customerName: 'Жаҳонгир Умаров',
      items: ['MacBook Air M2'],
      total: 25000000,
      paymentMethod: 'transfer',
      status: 'pending',
      date: '2024-01-15',
      time: '12:15'
    },
    {
      id: 'S004',
      customerName: 'Нилуфар Саидова',
      items: ['Dell XPS 13', 'Mouse Logitech'],
      total: 18200000,
      paymentMethod: 'card',
      status: 'completed',
      date: '2024-01-14',
      time: '16:20'
    },
    {
      id: 'S005',
      customerName: 'Бобур Раҳимов',
      items: ['iPad Air', 'Apple Pencil'],
      total: 8900000,
      paymentMethod: 'cash',
      status: 'cancelled',
      date: '2024-01-14',
      time: '11:30'
    }
  ];

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'cash':
        return <Banknote className="text-green-500" size={16} />;
      case 'card':
        return <CreditCard className="text-blue-500" size={16} />;
      case 'transfer':
        return <DollarSign className="text-purple-500" size={16} />;
      default:
        return <DollarSign className="text-gray-500" size={16} />;
    }
  };

  const getPaymentText = (method) => {
    switch (method) {
      case 'cash':
        return 'Нақд';
      case 'card':
        return 'Карта';
      case 'transfer':
        return 'Ўтказма';
      default:
        return 'Номаълум';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Тугалланган';
      case 'pending':
        return 'Кутилмоқда';
      case 'cancelled':
        return 'Бекор қилинган';
      default:
        return 'Номаълум';
    }
  };

  const todaySales = sales.filter(sale => sale.date === selectedDate);
  const completedSales = sales.filter(sale => sale.status === 'completed');
  const totalRevenue = completedSales.reduce((sum, sale) => sum + sale.total, 0);
  const averageOrderValue = completedSales.length > 0 ? totalRevenue / completedSales.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Сотувлар Бошқаруви</h1>
          <p className="text-gray-500 mt-1">Сотувлар тарихи ва статистикаси</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Download size={20} className="mr-2" />
            Экспорт
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <Plus size={20} className="mr-2" />
            Янги Сотув
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg mr-4">
              <DollarSign className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Бугунги Даромад</p>
              <p className="text-2xl font-bold text-gray-900">
                {todaySales.filter(s => s.status === 'completed').reduce((sum, sale) => sum + sale.total, 0).toLocaleString()} сўм
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg mr-4">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Бугунги Сотувлар</p>
              <p className="text-2xl font-bold text-gray-900">{todaySales.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg mr-4">
              <Calendar className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Ўртача Буюртма</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(averageOrderValue).toLocaleString()} сўм
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-50 rounded-lg mr-4">
              <Clock className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Кутилмоқда</p>
              <p className="text-2xl font-bold text-gray-900">
                {sales.filter(s => s.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center">
              <Calendar className="text-gray-400 mr-2" size={20} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <option value="completed">Тугалланган</option>
                <option value="pending">Кутилмоқда</option>
                <option value="cancelled">Бекор қилинган</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сотув ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Мижоз
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Маҳсулотлар
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сумма
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тўлов усули
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ҳолат
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сана/Вақт
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Амаллар
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales
                .filter(sale => selectedStatus === 'all' || sale.status === selectedStatus)
                .map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">{sale.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                        {sale.customerName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{sale.customerName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {sale.items.join(', ')}
                    </div>
                    <div className="text-xs text-gray-500">{sale.items.length} маҳсулот</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {sale.total.toLocaleString()} сўм
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPaymentIcon(sale.paymentMethod)}
                      <span className="ml-2 text-sm text-gray-700">
                        {getPaymentText(sale.paymentMethod)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(sale.status)}`}>
                      {getStatusText(sale.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sale.date}</div>
                    <div className="text-xs text-gray-500">{sale.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                      <Eye size={16} />
                    </button>
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

export default Sales;