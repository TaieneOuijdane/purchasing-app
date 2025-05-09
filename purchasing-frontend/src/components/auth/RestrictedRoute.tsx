import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface RestrictedRouteProps {
  element: React.ReactNode;
}

const RestrictedRoute: React.FC<RestrictedRouteProps> = ({ element }) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
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

  // if the user is not admin
  if (!isAdmin) {
    return <Navigate to="/restricted" state={{ from: location }} replace />;
  }

  return <>{element}</>;
};

export default RestrictedRoute;