import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/Kirish/SignIn';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import DeliveryPanel from './pages/Dastafka/DeliveryPanel';
import SkladPanel from './pages/Sklad/SkladPanel';
import Menyu from './pages/KassaUser/Menyu'; // kasir sahifasi
import Logout from './pages/Chiqish/logout'; // mavjud bo‘lsa

function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    setRole(savedRole);
  }, []);

  const PrivateRoute = ({ children, allowedRoles }) => {
    if (role === null) return null; // kutish holati
    return allowedRoles.includes(role) ? children : <Navigate to="/" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />

        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="/kasir"
          element={
            <PrivateRoute allowedRoles={['CASHIER']}>
              <Menyu />
            </PrivateRoute>
          }
        />
        <Route
          path="/dastafka"
          element={
            <PrivateRoute allowedRoles={['DELIVERY']}>
              <DeliveryPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="/sklad"
          element={
            <PrivateRoute allowedRoles={['STORAGE']}>
              <SkladPanel />
            </PrivateRoute>
          }
        />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
