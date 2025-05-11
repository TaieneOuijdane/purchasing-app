import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/layout/Layout';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-500">
            Veuillez vous connecter pour voir votre profil.
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-3xl">👤</span>
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-teal-100">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 text-gray-600 mb-1">
                  <span>📧</span>
                  <span className="text-sm font-medium">Email</span>
                </div>
                <p className="text-gray-900">{user.email}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 text-gray-600 mb-1">
                  <span>📱</span>
                  <span className="text-sm font-medium">Téléphone</span>
                </div>
                <p className="text-gray-900">+212 640070538</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 text-gray-600 mb-1">
                  <span>📅</span>
                  <span className="text-sm font-medium">Membre depuis</span>
                </div>
                <p className="text-gray-900">
                  {user.createdAt ? 
                    new Date(user.createdAt).toLocaleDateString('fr-FR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 
                    'Janvier 2024'
                  }
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 text-gray-600 mb-1">
                  <span>📍</span>
                  <span className="text-sm font-medium">Localisation</span>
                </div>
                <p className="text-gray-900">Maroc</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Rôles & Permissions</h3>
          <div className="flex flex-wrap gap-2">
            {user.roles.map((role, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
              >
                {role.replace('ROLE_', '')}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;