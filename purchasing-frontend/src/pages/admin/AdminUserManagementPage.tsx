import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { SimpleDataTable } from '../../components/datatable/SimpleDataTable';
import { userService } from '../../services/userService';
import type { UserCreationData, UserUpdateData } from '../../services/userService';
import type { User } from '../../types';
import { useNavigate } from 'react-router-dom';

// Fonction pour transformer la réponse de l'API
const transformApiResponse = (data: any): User[] => {
  // Si la réponse est au format hydra/API Platform avec "member"
  if (data && data.member && Array.isArray(data.member)) {
    return data.member.map((user: any) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles || [],
      isActive: user.isActive !== undefined ? user.isActive : true,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt
    }));
  }
  
  // Si la réponse est déjà un tableau d'utilisateurs
  if (Array.isArray(data)) {
    return data.map((user: any) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles || [],
      isActive: user.isActive !== undefined ? user.isActive : true,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt
    }));
  }
  
  // Si la réponse est d'un format inattendu, retourner un tableau vide
  console.error('Format de réponse API inattendu:', data);
  return [];
};

const AdminUserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserCreationData | UserUpdateData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    roles: ['ROLE_USER'],
    isActive: true
  });
  const navigate = useNavigate();

  // Configuration des colonnes pour la DataTable
  const columns = [
    {
      key: 'name',
      header: 'Nom',
      render: (user: User) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
            {user.firstName.charAt(0) + user.lastName.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (user: User) => (
        <div className="text-sm text-gray-500">{user.email}</div>
      ),
    },
    {
      key: 'roles',
      header: 'Rôle',
      render: (user: User) => (
        <div className="flex flex-wrap gap-1">
          {user.roles.map((role, index) => (
            <span 
              key={index}
              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                role.includes('ADMIN') 
                  ? 'bg-teal-100 text-teal-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {role}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'isActive',
      header: 'Statut',
      render: (user: User) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          user.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {user.isActive ? 'Actif' : 'Inactif'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: User) => (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => openEditModal(user)}
            className="text-teal-600 hover:text-teal-900"
            disabled={isLoading}
            style={{ backgroundColor: 'transparent', border: 'none' }}
          >
            Modifier
          </button>
          <button
            onClick={() => user.id && handleDelete(user.id.toString())}
            className="text-red-600 hover:text-red-900"
            disabled={isLoading}
            style={{ backgroundColor: 'transparent', border: 'none' }}
          >
            Supprimer
          </button>
        </div>
      ),
    }
  ];

  // Afficher les messages pendant 3 secondes
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (errorMessage || successMessage) {
      timer = setTimeout(() => {
        setErrorMessage(null);
        setSuccessMessage(null);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [errorMessage, successMessage]);

  // Charger les utilisateurs
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.getUsers();
      console.log('Réponse brute de l\'API:', response);
      
      // Transformer la réponse si nécessaire
      const transformedData = transformApiResponse(response);
      console.log('Données transformées:', transformedData);
      
      setUsers(transformedData);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      
      // Si erreur d'authentification (401)
      if (err.statusCode === 401) {
        // Clear any auth tokens
        localStorage.removeItem('token');
        
        // Redirect to login
        navigate('/login', { 
          state: { 
            from: location.pathname,
            message: "Veuillez vous connecter avec un compte administrateur pour accéder à cette page." 
          } 
        });
      } 
      // Si erreur serveur (500)
      else if (err.statusCode === 500) {
        setError(
          "Une erreur de configuration du serveur s'est produite. " +
          "Veuillez contacter l'administrateur système. " +
          "Détail: " + (err.message || "Erreur inconnue")
        );
      } 
      // Autres erreurs
      else {
        setError(err.message || "Impossible de charger les utilisateurs");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      roles: ['ROLE_USER'],
      isActive: true
    });
    setEditingUser(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    // Ne pas inclure le mot de passe lors de l'édition
    setFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      isActive: user.isActive !== undefined ? user.isActive : true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      if (editingUser) {
        // Mise à jour d'un utilisateur existant
        if (editingUser && editingUser.id) {
          await userService.updateUser(editingUser.id, formData as UserUpdateData);
        }
        setSuccessMessage("Utilisateur mis à jour avec succès");
      } else {
        // Ajout d'un nouvel utilisateur
        await userService.createUser(formData as UserCreationData);
        setSuccessMessage("Utilisateur créé avec succès");
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchUsers(); // Recharger la liste après modification
    } catch (error: any) {
      console.error("Erreur lors de l'opération", error);
      setErrorMessage(error.message || (editingUser 
        ? "Impossible de mettre à jour l'utilisateur" 
        : "Impossible de créer l'utilisateur"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      try {
        setIsLoading(true);
        await userService.deleteUser(id);
        setSuccessMessage("Utilisateur supprimé avec succès");
        fetchUsers(); // Recharger la liste après suppression
      } catch (error: any) {
        console.error("Erreur lors de la suppression", error);
        setErrorMessage(error.message || "Impossible de supprimer l'utilisateur");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Layout title="Gestion des utilisateurs" subtitle="Ajouter, modifier ou supprimer des utilisateurs">
      {/* Messages d'alerte */}
      {errorMessage && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}

      {/* Afficher l'erreur de chargement des utilisateurs */}
      {error && (
        <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <div className="flex">
            <div className="py-1">
              <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold">Erreur serveur</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow border border-teal-100 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-teal-100">
          <div>
            <h2 className="text-lg font-medium text-teal-800">Liste des utilisateurs</h2>
            <p className="text-sm text-gray-500">Total: {users.length} utilisateurs</p>
          </div>
          <button
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            onClick={openAddModal}
            disabled={isLoading}
          >
            + Ajouter
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading && users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
              Chargement des utilisateurs...
            </div>
          ) : (
            <SimpleDataTable columns={columns} data={users} />
          )}
        </div>
      </div>
      
      {/* Modal pour ajouter/modifier un utilisateur */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-teal-800">
                {editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName || ''}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName || ''}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>
                
                {!editingUser && (
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={formData.password || ''}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      required={!editingUser}
                    />
                  </div>
                )}
                
                <div>
                  <label htmlFor="roles" className="block text-sm font-medium text-gray-700">
                    Rôle
                  </label>
                  <select
                    id="roles"
                    value={formData.roles ? formData.roles[0] : 'ROLE_USER'}
                    onChange={(e) => setFormData({...formData, roles: [e.target.value]})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="ROLE_USER">Utilisateur</option>
                    <option value="ROLE_ADMIN">Administrateur</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive === undefined ? true : formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Compte actif
                  </label>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-2 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                  style={{ backgroundColor: 'transparent' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement...
                    </span>
                  ) : (
                    editingUser ? 'Enregistrer' : 'Ajouter'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminUserManagementPage;