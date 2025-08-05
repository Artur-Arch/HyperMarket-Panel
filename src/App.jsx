import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/Kirish/SignIn';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import SkladPanel from './pages/Sklad/SkladPanel';
import Menyu from './pages/KassaUser/Menyu';
import Logout from './pages/Chiqish/logout';
import Dastafka from './pages/Dastafka/DeliveryPanel';

function App() {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('access_token');

    if (token) { 
      fetch('https://suddocs.uz/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Invalid token');
        })
        .then((data) => {
          console.log('Profile data:', data);
          setRole(savedRole);
        })
        .catch((error) => {
          console.error('Token validation error:', error.message);
          localStorage.clear();
          setRole(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setRole(savedRole);
      setIsLoading(false);
    }
  }, []);

  const PrivateRoute = ({ children, allowedRoles }) => {
    if (isLoading) {
      return <>
  <div
    style={{
      width: "40px",
      height: "40px",
      border: "4px solid #ccc",
      borderTop: "4px solid #3498db",
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "auto",
    }}
  ></div>

  <style>
    {`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}
  </style>
</>

    }

    const currentRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('access_token');
    console.log('PrivateRoute: Role:', currentRole, 'Token:', !!token, 'Allowed:', allowedRoles);

    if (!currentRole || !token) {
      console.log('PrivateRoute: No role or token, redirecting to /');
      return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(currentRole)) {
      console.log('PrivateRoute: Role not allowed, redirecting to /');
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
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
          path="/sklad"
          element={
            <PrivateRoute allowedRoles={['WAREHOUSE']}>
              <SkladPanel />
            </PrivateRoute>
          }
        />
        <Route
          path="/dastafka"
          element={
            <PrivateRoute allowedRoles={['AUDITOR']}>
              <Dastafka />
            </PrivateRoute>
          }
        />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;