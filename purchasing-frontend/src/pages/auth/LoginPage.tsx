import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../hooks/useAuth';

const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Si l'utilisateur est déjà connecté, redirigez-le vers la page d'accueil
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-teal-50 py-6 px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-4">
          <svg className="mx-auto h-12 w-12 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="mt-2 text-center text-2xl font-bold text-teal-800">
            Connectez-vous à votre compte
          </h2>
          <p className="mt-1 text-center text-sm text-teal-600">
            Accédez à l'application de gestion
          </p>
        </div>

        <div className="bg-white py-6 px-4 shadow-lg sm:rounded-lg sm:px-8 border border-teal-100 mx-auto">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;