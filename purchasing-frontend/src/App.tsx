import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import RestrictedRoute from './components/auth/RestrictedRoute';
import RestrictedPage from './pages/auth/RestrictedPage';
import CreateOrderPage from './pages/order/CreateOrderPage';
import OrderManagementPage from './pages/order/OrderManagementPage';
import ProfilPage from './pages/ProfilPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
        <Router>
          <Routes>
            {/* Public pages */}
            <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
            
            {/* Protected pages */}
            <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
            <Route path="/orders" element={<ProtectedRoute element={<OrderManagementPage />} />} />
            <Route path="/orders/create" element={<ProtectedRoute element={<CreateOrderPage />} />} />
            <Route path="/products" element={<ProtectedRoute element={<ProductManagementPage />} />} />
            <Route path="/settings" element={<ProtectedRoute element={<ProfilPage />} />} />
            
            {/* Admin pages */}
            <Route path="/admin/users" element={<RestrictedRoute element={<AdminUserManagementPage />} />} />

            {/* Redirections & Page 404 */}
            <Route path="/restricted" element={<RestrictedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
    </AuthProvider>
  );
};

export default App;