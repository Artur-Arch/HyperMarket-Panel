import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Users, 
  ShoppingCart,
  AlertTriangle
} from 'lucide-react';

const StatCard = ({ title, value, change, isPositive, icon: Icon }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        <div className="flex items-center mt-2">
          {isPositive ? (
            <TrendingUp className="text-green-500 mr-1" size={16} />
          ) : (
            <TrendingDown className="text-red-500 mr-1" size={16} />
          )}
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
          <span className="text-gray-500 text-sm ml-1">охирги ойга нисбатан</span>
        </div>
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon className="text-blue-600" size={24} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const stats = [
    {
      title: 'Умумий Даромад',
      value: '45,280,000 сўм',
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign
    },
    {
      title: 'Маҳсулотлар Сони',
      value: '1,245',
      change: '+3.2%',
      isPositive: true,
      icon: Package
    },
    {
      title: 'Мижозлар',
      value: '892',
      change: '+8.1%',
      isPositive: true,
      icon: Users
    },
    {
      title: 'Бугунги Сотувлар',
      value: '127',
      change: '-2.4%',
      isPositive: false,
      icon: ShoppingCart
    }
  ];

  const recentSales = [
    { id: '001', customer: 'Азиз Каримов', amount: '450,000', time: '10:30', status: 'Тугалланган' },
    { id: '002', customer: 'Малика Тошева', amount: '780,000', time: '10:15', status: 'Тугалланган' },
    { id: '003', customer: 'Жаҳонгир Умаров', amount: '320,000', time: '09:45', status: 'Кутилмоқда' },
    { id: '004', customer: 'Нилуфар Саидова', amount: '650,000', time: '09:30', status: 'Тугалланган' },
    { id: '005', customer: 'Бобур Раҳимов', amount: '890,000', time: '09:15', status: 'Тугалланган' },
  ];

  const lowStockItems = [
    { name: 'Samsung Galaxy A54', current: 5, minimum: 20, category: 'Телефонлар' },
    { name: 'iPhone 13 Pro', current: 3, minimum: 15, category: 'Телефонлар' },
    { name: 'MacBook Air M2', current: 2, minimum: 10, category: 'Ноутбуклар' },
    { name: 'AirPods Pro', current: 8, minimum: 25, category: 'Аксессуарлар' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Бошқарув Панели</h1>
          <p className="text-gray-600 mt-1">Бугунги санага умумий маълумотлар</p>
        </div>
        <div className="text-sm text-gray-500">
          Охирги янгиланиш: {new Date().toLocaleString('uz-Cyrl-UZ')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Сўнгги Сотувлар</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {sale.customer.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{sale.customer}</p>
                      <p className="text-sm text-gray-500">Соат {sale.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{sale.amount} сўм</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      sale.status === 'Тугалланган' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sale.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center">
              <AlertTriangle className="text-orange-500 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">Кам Қолган Маҳсулотлар</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="border-l-4 border-orange-400 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-orange-600">
                        {item.current}/{item.minimum}
                      </p>
                      <p className="text-xs text-gray-500">жорий/мин</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors duration-150 text-sm font-medium">
              Барча Огоҳлантиришлар
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Тез Амаллар</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-150">
            <Package className="text-blue-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">Янги Маҳсулот</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors duration-150">
            <ShoppingCart className="text-green-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">Янги Сотув</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors duration-150">
            <Users className="text-purple-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">Янги Мижоз</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors duration-150">
            <TrendingUp className="text-orange-600 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-700">Ҳисобот</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;