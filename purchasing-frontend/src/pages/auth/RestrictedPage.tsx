import React from 'react';
import { Link } from 'react-router-dom';

const RestrictedPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Accès Refusé</h1>
        <p className="text-gray-600 mb-8">Vous n'avez pas le droit pour accéder à cette page.</p>
        
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
};

export default RestrictedPage;