import React, { useState } from 'react';
import { 
  Building, 
  DollarSign, 
  Percent, 
  Bell, 
  CreditCard, 
  Plus, 
  Edit3, 
  Trash2, 
  Mail, 
  MessageSquare, 
  Save, 
  Settings as SettingsIcon 
} from 'lucide-react';

const Settings = () => {
  const [branches, setBranches] = useState([
    { id: 'B001', name: 'Марказий филиал', address: 'Тошкент, Чилонзор кўч., 45' },
    { id: 'B002', name: 'Юнусобод филиали', address: 'Тошкент, Юнусобод кўч., 12' },
    { id: 'B003', name: 'Сергели филиали', address: 'Тошкент, Сергели кўч., 89' }
  ]);
  const [currency, setCurrency] = useState('UZS');
  const [taxRate, setTaxRate] = useState(12);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [integrations, setIntegrations] = useState({
    payme: true,
    click: false,
    uzcard: true,
    crm: false
  });
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');

  const handleAddBranch = () => {
    if (newBranchName && newBranchAddress) {
      setBranches([...branches, {
        id: `B${branches.length + 1}`.padStart(4, '0'),
        name: newBranchName,
        address: newBranchAddress
      }]);
      setNewBranchName('');
      setNewBranchAddress('');
    }
  };

  const handleDeleteBranch = (id) => {
    setBranches(branches.filter(branch => branch.id !== id));
  };

  const handleSaveSettings = () => {
    // Здесь можно добавить логику сохранения настроек
    alert('Созламалар сақланди!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <SettingsIcon className="text-blue-600" size={32} />
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Созламалар</h1>
          <p className="text-gray-500 mt-1">Супермаркетингизнинг асосий созламаларини бошқаринг</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Филиаллар</h2>
        <div className="space-y-4">
          {branches.map(branch => (
            <div key={branch.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{branch.name}</p>
                <p className="text-sm text-gray-500">{branch.address}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:text-blue-900 rounded hover:bg-blue-50">
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => handleDeleteBranch(branch.id)}
                  className="p-2 text-red-600 hover:text-red-900 rounded hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Янги филиал номи"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Филиал манзили"
              value={newBranchAddress}
              onChange={(e) => setNewBranchAddress(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              onClick={handleAddBranch}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus size={20} className="mr-2" />
              Қўшиш
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Валюта ва Нарх Формати</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Асосий валюта</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="UZS">UZS (Сўм)</option>
                <option value="USD">USD (Доллар)</option>
                <option value="EUR">EUR (Евро)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">ҚҚС ставкаси (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Билдиришномалар</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="text-gray-500" size={20} />
                <span className="text-sm font-medium text-gray-700">Email билдиришномалар</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="text-gray-500" size={20} />
                <span className="text-sm font-medium text-gray-700">SMS билдиришномалар</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={() => setSmsNotifications(!smsNotifications)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Интеграциялар</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="text-gray-500" size={20} />
              <span className="text-sm font-medium text-gray-700">Payme</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={integrations.payme}
                onChange={() => setIntegrations({ ...integrations, payme: !integrations.payme })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="text-gray-500" size={20} />
              <span className="text-sm font-medium text-gray-700">Click</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={integrations.click}
                onChange={() => setIntegrations({ ...integrations, click: !integrations.click })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="text-gray-500" size={20} />
              <span className="text-sm font-medium text-gray-700">Uzcard</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={integrations.uzcard}
                onChange={() => setIntegrations({ ...integrations, uzcard: !integrations.uzcard })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <SettingsIcon className="text-gray-500" size={20} />
              <span className="text-sm font-medium text-gray-700">CRM интеграцияси</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={integrations.crm}
                onChange={() => setIntegrations({ ...integrations, crm: !integrations.crm })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSaveSettings}
          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          <Save size={20} className="mr-2" />
          Сақлаш
        </button>
      </div>
    </div>
  );
};

export default Settings;