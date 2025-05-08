import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface AdminRouteProps {
  element: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ element }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // if the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // if the user authentifcated but not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // if the user is admin
  return <>{element}</>;
};

export default AdminRoute;