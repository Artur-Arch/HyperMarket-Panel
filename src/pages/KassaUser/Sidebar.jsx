import React, { useState, useEffect } from 'react';
import { BarChart3, ShoppingCart, AlertTriangle, Package, Settings, LogOut } from 'lucide-react';
import Logout from '../Chiqish/logout';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(() => {
    return localStorage.getItem('selectedBranchId') || '';
  });
  const [branches, setBranches] = useState([{ id: '', name: 'Барча филиаллар' }]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Boshqarma', icon: BarChart3 },
    { id: 'sales', label: 'Sotish', icon: ShoppingCart },
    { id: 'defective', label: 'Brak/Qaytarish', icon: AlertTriangle }
  ];

  // Fetch branches from API
  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      throw new Error('No token found. Please login again.');
    }

    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('selectedBranchId');
      navigate('/login');
      throw new Error('Unauthorized: Session expired. Please login again.');
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    return response;
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetchWithAuth('https://suddocs.uz/branches');
        const data = await response.json();
        setBranches([{ id: '', name: 'Барча филиаллар' }, ...data]);
        if (selectedBranchId && !data.some((branch) => branch.id.toString() === selectedBranchId)) {
          setSelectedBranchId('');
          localStorage.setItem('selectedBranchId', '');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch branches');
        console.error('Error fetching branches:', err);
      }
    };

    fetchBranches();
  }, [selectedBranchId, navigate]);

  // Save selected branch to localStorage
  useEffect(() => {
    localStorage.setItem('selectedBranchId', selectedBranchId);

    const handleStorageChange = (e) => {
      if (e.key === 'selectedBranchId') {
        setSelectedBranchId(e.newValue || '');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [selectedBranchId]);

  const handleLogoutConfirm = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('selectedBranchId');
    navigate('/login');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleBranchChange = (e) => {
    setSelectedBranchId(e.target.value);
  };

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || 'Dr. Rodriguez';
  const userRole = localStorage.getItem('userRole') || 'Kassir';
  // Generate initials from the name
  const initials = userName
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white border-r border-gray-200 w-64 min-h-screen flex flex-col fixed top-0 left-0 h-full z-50">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-[#1178f8] rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Aminov</h1>
            <p className="text-sm text-gray-600">Savdo Tizimi</p>
          </div>
        </div>
        <select
          value={selectedBranchId}
          onChange={handleBranchChange}
          className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={error}
        >
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
        {error && <span className="mt-2 text-red-500 text-sm">{error}</span>}
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#1178f8] bg-opacity-10 text-[#1178f8] border border-[#1178f8] border-opacity-20'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div style={{ marginBottom: '5px' }} className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#1178f8] rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">{initials}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="text-xxs text-gray-600">{userRole === 'CASHIER' ? 'Kassir' : userRole || 'Kassir'}</p>
          </div>
        </div>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Chiqish</span>
        </button>
      </div>
      {showLogoutModal && (
        <Logout
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      )}
    </div>
  );
};

export default Sidebar;