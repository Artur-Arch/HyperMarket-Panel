import React, { useState, useEffect } from 'react';
import { MapPin, Package, User, Settings as SettingsIcon, Phone, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import Profile from './components/Profile';
import Settings from './components/Settings';
import { translations } from './utils/translations';

function DeliveryPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState('uz-latn');
  const [location, setLocation] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: 'Alisher Karimov',
      phone: '+998901234567',
      address: 'Toshkent sh., Yunusobod t., 12-uy',
      product: 'Samsung Galaxy S24',
      price: '12,000,000',
      status: 'pending',
      time: '10:30',
      distance: '2.5 km'
    },
    {
      id: 2,
      customer: 'Malika Tosheva',
      phone: '+998909876543',
      address: 'Toshkent sh., Chilonzor t., 5-uy',
      product: 'iPhone 15 Pro',
      price: '18,500,000',
      status: 'assigned',
      time: '11:45',
      distance: '4.2 km'
    },
    {
      id: 3,
      customer: 'Bobur Rahimov',
      phone: '+998901111111',
      address: 'Toshkent sh., Sergeli t., 8-uy',
      product: 'MacBook Air M2',
      price: '15,000,000',
      status: 'pending',
      time: '14:20',
      distance: '1.8 km'
    }
  ]);

  const t = translations[language];

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          t={t} 
          location={location} 
          isAvailable={isAvailable} 
          setIsAvailable={setIsAvailable}
          orders={orders}
        />;
      case 'orders':
        return <Orders t={t} orders={orders} setOrders={setOrders} />;
      case 'profile':
        return <Profile t={t} />;
      case 'settings':
        return <Settings t={t} language={language} setLanguage={setLanguage} />;
      default:
        return <Dashboard 
          t={t} 
          location={location} 
          isAvailable={isAvailable} 
          setIsAvailable={setIsAvailable}
          orders={orders}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">TechCourier</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isAvailable 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isAvailable ? t.available : t.busy}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-colors ${
                activeTab === 'dashboard' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="text-xs mt-1">{t.dashboard}</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-colors ${
                activeTab === 'orders' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="text-xs mt-1">{t.orders}</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-colors ${
                activeTab === 'profile' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs mt-1">{t.profile}</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-colors ${
                activeTab === 'settings' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <SettingsIcon className="w-5 h-5" />
              <span className="text-xs mt-1">{t.settings}</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default DeliveryPanel;