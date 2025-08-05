import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const LocationApp = ({ token, selectedBranchId }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [adminLocations, setAdminLocations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDeliverer, setSelectedDeliverer] = useState(null);

  // Google Maps configuration
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!token) {
      setError('Илтимос, амал қилувчи JWT токен тақдим этинг');
      return;
    }

    const socketIo = io('https://suddocs.uz/', {
      path: '/socket.io',
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      secure: true,
    });

    socketIo.on('connect', () => {
      setIsConnected(true);
      setError('');
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (err) {
        setError('Токен формати нотўғри');
      }
    });

    socketIo.on('connect_error', (err) => {
      setError(`Уланиш муваффақиятсиз: ${err.message}`);
      setIsConnected(false);
    });

    socketIo.on('error', (data) => {
      setError(data.message || 'Серверда хато юз берди');
      setIsConnected(false);
    });

    socketIo.on('onlineUsersUpdated', (users) => {
      console.log('Online users received:', users);
      setOnlineUsers(users);
    });

    socketIo.on('adminAllLocations', (locations) => {
      console.log('Admin locations received:', locations);
      setAdminLocations(locations);
    });

    socketIo.on('adminLocationUpdate', (location) => {
      console.log('Admin location update received:', location);
      setAdminLocations((prev) => {
        const updated = prev.filter((loc) => loc.userId !== location.userId);
        return [...updated, location];
      });
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [token]);

  // Automatically fetch online users for admins on mount
  useEffect(() => {
    if (userRole === 'ADMIN' && socket && isConnected) {
      console.log('Fetching all online users for admin');
      socket.emit('getAllOnlineUsers', { branchId: selectedBranchId || undefined });
    }
  }, [userRole, socket, isConnected, selectedBranchId]);

  // Open modal with deliverer location
  const openModal = (deliverer) => {
    setSelectedDeliverer(deliverer);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedDeliverer(null);
  };

  // Combine all locations for deliverers
  const allLocations = [...onlineUsers, ...adminLocations].filter(
    (loc, index, self) =>
      loc.latitude &&
      loc.longitude &&
      loc.user?.role === 'AUDITOR' &&
      index === self.findIndex((l) => l.userId === loc.userId)
  );

  // Debug deliverers
  console.log('Deliverers:', allLocations);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Геолокация</h1>

      {/* Connection Status */}
      <div className="mb-4">
        <p className={isConnected ? 'text-green-500' : 'text-red-500'}>
          Ҳолат: {isConnected ? 'Уланган' : 'Узилган'}
        </p>
        {error && <p className="text-red-500">{error}</p>}
        {userRole && <p className="text-blue-500">Рол: {userRole}</p>}
      </div>

      {/* Deliverers Table */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Етказиб берувчилар рўйхати</h2>
        {allLocations.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Фойдаланувчи ID</th>
                <th className="border border-gray-300 p-2">Исми</th>
                <th className="border border-gray-300 p-2">Филиал</th>
                <th className="border border-gray-300 p-2">Кенглик</th>
                <th className="border border-gray-300 p-2">Узунлик</th>
                <th className="border border-gray-300 p-2">Манзил</th>
                <th className="border border-gray-300 p-2">Охирги кўриниш</th>
                <th className="border border-gray-300 p-2">Харита</th>
              </tr>
            </thead>
            <tbody>
              {allLocations.map((loc) => (
                <tr key={loc.userId}>
                  <td className="border border-gray-300 p-2">{loc.userId}</td>
                  <td className="border border-gray-300 p-2">{loc.user?.name || 'N/A'}</td>
                  <td className="border border-gray-300 p-2">{loc.user?.branch?.name || 'Йўқ'}</td>
                  <td className="border border-gray-300 p-2">{loc.latitude}</td>
                  <td className="border border-gray-300 p-2">{loc.longitude}</td>
                  <td className="border border-gray-300 p-2">{loc.address || 'Йўқ'}</td>
                  <td className="border border-gray-300 p-2">
                    {new Date(loc.lastSeen).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => openModal(loc)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                    >
                      Харитада кўрсатиш
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Етказиб берувчилар топилмади.</p>
        )}
      </div>

      {/* Modal for Deliverer Location and Orders */}
      {modalOpen && selectedDeliverer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-lg font-semibold mb-4">
              {selectedDeliverer.user?.name || 'N/A'} жойлашуви
            </h2>
            <LoadScript googleMapsApiKey="AIzaSyAJYV8WGVNbGWvKIGCoYwaq4WVuKL_P2LI">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={{ lat: selectedDeliverer.latitude, lng: selectedDeliverer.longitude }}
                zoom={15}
              >
                <Marker
                  position={{ lat: selectedDeliverer.latitude, lng: selectedDeliverer.longitude }}
                  title={`${selectedDeliverer.user?.name || 'N/A'} (ID: ${selectedDeliverer.userId})`}
                  label={selectedDeliverer.user?.name?.charAt(0).toUpperCase() || '?'}
                />
              </GoogleMap>
            </LoadScript>
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2">Заказлар</h3>
              {selectedDeliverer.user?.orders?.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 p-2">Заказ ID</th>
                      <th className="border border-gray-300 p-2">Маҳсулотлар</th>
                      <th className="border border-gray-300 p-2">Адрес доставки</th>
                      <th className="border border-gray-300 p-2">Сана</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDeliverer.user.orders.map((order) => (
                      <tr key={order.id}>
                        <td className="border border-gray-300 p-2">{order.id}</td>
                        <td className="border border-gray-300 p-2">
                          {order.items?.map((item) => item.name).join(', ') || 'Маҳсулотлар йўқ'}
                        </td>
                        <td className="border border-gray-300 p-2">{order.deliveryAddress || 'Йўқ'}</td>
                        <td className="border border-gray-300 p-2">
                          {new Date(order.date).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Заказлар топилмади.</p>
              )}
            </div>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Ёпиш
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationApp;