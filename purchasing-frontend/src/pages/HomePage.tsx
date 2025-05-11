import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {

  return (
    <Layout>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Bienvenue sur l'Application d'Achat</h1>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Bonjour!</h2>
        <p className="text-gray-600">Que souhaitez-vous faire aujourd'hui?</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Produits</h3>
          <p className="text-gray-600 mb-4">Parcourir et gérer vos produits</p>
          <Link 
            to="/products" 
            className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-base font-medium rounded text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
          >
            Voir les produits
          </Link>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Commandes</h3>
          <p className="text-gray-600 mb-4">Gérer vos commandes en cours</p>
          <Link 
            to="/orders" 
            className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-base font-medium rounded text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
          >
            Voir les commandes
          </Link>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Profil</h3>
          <p className="text-gray-600 mb-4">Gérer votre compte et vos préférences</p>
          <Link 
            to="/settings" 
            className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-base font-medium rounded text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
          >
            Voir le profil
          </Link>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default HomePage;