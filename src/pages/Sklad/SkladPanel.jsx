import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Home, TrendingUp, TrendingDown, BarChart3, Box, Settings, LogOut, Bell, MapPin } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Chiqim from './pages/Chiqim';
import Tovarlar from './pages/Tovarlar';
import TovarlarRoyxati from './pages/TovarlarRoyxati';
import Hisobotlar from './pages/Hisobotlar';
import Logout from '../Chiqish/Logout';

// Define AuthContext
const AuthContext = React.createContext({
  token: null,
  setToken: () => {},
});

// ErrorBoundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-16">
          <h3 className="text-lg font-semibold text-red-600">Xatolik yuz berdi</h3>
          <p className="text-slate-500">Iltimos, sahifani qayta yuklang yoki administrator bilan bog'laning.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function SkladPanel() {
  const [token, setToken] = useState(localStorage.getItem('access_token') || 'mock-token');
  const [activeTab, setActiveTab] = useState('dashboard'); // Изменено с 'chiqim' на 'dashboard'
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
  );
  const [showPagesMenu, setShowPagesMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(() => localStorage.getItem('selectedBranchId') || '');
  const [branches, setBranches] = useState([{ id: '', name: 'Барча филиаллар' }]);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('Test User');

  const navigate = useNavigate();

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'tovarlar', name: 'Kirim', icon: TrendingUp },
    { id: 'chiqim', name: 'Chiqim', icon: TrendingDown },
    { id: 'tovarlarroyxati', name: 'Tovarlar Royxati', icon: Box },
    { id: 'hisobotlar', name: 'Hisobotlar', icon: BarChart3 },
    { id: 'geolocation', name: 'Geolocation', icon: MapPin },
  ];

  // Fetch user data and branches
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserName(parsedUser.name || parsedUser.firstName || 'User');
      } catch (e) {
        setUserName('User');
      }
    }

    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('https://suddocs.uz/branches', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch branches');
        }
        const data = await response.json();
        setBranches([{ id: '', name: 'Барча филиаллар' }, ...data]);
        if (selectedBranchId && !data.some((branch) => branch.id.toString() === selectedBranchId)) {
          setSelectedBranchId('');
          localStorage.setItem('selectedBranchId', '');
        }
      } catch (err) {
        // Mock branches for testing
        setBranches([
          { id: '', name: 'Барча филиаллар' },
          { id: '1', name: 'Main Branch' },
          { id: '2', name: 'Branch 2' },
        ]);
        setError(err.message || 'Failed to fetch branches');
        console.error('Error fetching branches:', err);
      }
    };

    fetchBranches();

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedBranchId]);

  useEffect(() => {
    localStorage.setItem('selectedBranchId', selectedBranchId);
  }, [selectedBranchId]);

  const handleLogoutConfirm = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('selectedBranchId');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    setToken(null);
    setActiveTab('dashboard');
    setShowPagesMenu(false);
    setShowLogoutModal(false);
    navigate('/');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleBranchChange = (e) => {
    setSelectedBranchId(e.target.value);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard selectedBranchId={selectedBranchId} />;
      case 'chiqim':
        return <Chiqim selectedBranchId={selectedBranchId} />;
      case 'tovarlar':
        return <Tovarlar selectedBranchId={selectedBranchId} />;
      case 'tovarlarroyxati':
        return <TovarlarRoyxati selectedBranchId={selectedBranchId} />;
      case 'hisobotlar':
        return <Hisobotlar selectedBranchId={selectedBranchId} />;
      case 'geolocation':
        return <div>Geolocation not implemented</div>;
      default:
        return <Dashboard selectedBranchId={selectedBranchId} />; // Изменено с Chiqim на Dashboard
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-sm shadow-xl z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-800">Men Texnika</h1>
                <p className="text-xs text-gray-600">Sklad Tizimi</p>
              </div>
            </div>
          </div>

          <nav className="mt-4 px-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#1178f8] bg-opacity-10 text-[#1178f8] border border-[#1178f8] border-opacity-20'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  aria-label={`O'tish ${item.name} sahifasiga`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-base font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
              aria-label="Tizimdan chiqish"
            >
              <LogOut className="w-6 h-6" />
              <span className="text-base font-medium">Chiqish</span>
            </button>
          </div>
        </div>

        {/* Logout Modal */}
        {showLogoutModal && (
          <Logout
            onConfirm={handleLogoutConfirm}
            onCancel={handleLogoutCancel}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col ml-64">
          <header className="bg-white/60 backdrop-blur-md border-b border-white/20 shadow-lg">
            <div className="px-6 py-4 flex justify-between items-center gap-y-2">
              <div className="flex flex-wrap items-center gap-2 w-full">
                <select
                  value={selectedBranchId}
                  onChange={handleBranchChange}
                  style={{ marginBottom: '0.1rem' }}
                  className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={error}
                >
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
                {error && <span className="ml-2 text-red-500 text-sm">{error}</span>}
              </div>

              <div className="flex items-center space-x-4 w-full justify-end">
                <div className="bg-white/80 px-4 py-2 rounded-xl border border-white/30 shadow-sm">
                  <p className="text-sm text-slate-600 font-medium">{currentTime}</p>
                </div>
                <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                </button>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{userName}</span>
                </div>
              </div>
            </div>

            {showPagesMenu && (
              <div className="mt-4 bg-white/90 rounded-xl shadow-md border border-white/30 overflow-hidden px-6">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowPagesMenu(false);
                    }}
                    className={`w-full text-left px-6 py-4 border-b border-white/10 ${
                      activeTab === item.id ? 'bg-blue-100/50 font-bold' : 'hover:bg-blue-50/50'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </header>

          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <ErrorBoundary>
                {renderContent()}
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </div>
    </AuthContext.Provider>
  );
}

export default SkladPanel;