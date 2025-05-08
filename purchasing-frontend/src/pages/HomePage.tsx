import React from 'react';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Bienvenue sur l'Application d'Achat</h1>
      
      {user && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Bonjour, {user.firstName}!</h2>
          <p className="text-gray-600">Que souhaitez-vous faire aujourd'hui?</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Produits</h3>
          <p className="text-gray-600 mb-4">Parcourir et commander des produits</p>
          <a 
            href="/products" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Voir les produits
          </a>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Commandes</h3>
          <p className="text-gray-600 mb-4">Gérer vos commandes en cours</p>
          <a 
            href="/orders" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Voir les commandes
          </a>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Profil</h3>
          <p className="text-gray-600 mb-4">Gérer votre compte et vos préférences</p>
          <a 
            href="/profile" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Voir le profil
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;