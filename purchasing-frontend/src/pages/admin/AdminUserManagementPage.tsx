import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { Path } from 'react-hook-form';
import { userService } from '../../services/userService';
import type { UserCreationData, UserUpdateData } from '../../services/userService';
import type { User } from '../../types';
import DataTablePage from '../../components/common/DataTablePage';
import EntityForm from '../../components/common/EntityForm';
import type { FormField } from '../../components/common/EntityForm';
import Layout from '../../components/layout/Layout';
import { authService } from '../../services/authService';

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

type FormValues = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isActive: boolean;
};

const AdminUserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Configuration de react-hook-form
  const { 
    control, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      roles: ['ROLE_USER'],
      isActive: true
    }
  });

  // Définition des champs du formulaire
  const formFields: FormField<FormValues>[] = [
    {
      name: 'firstName' as Path<FormValues>,
      label: 'Prénom',
      type: 'text',
      required: true,
      col: 'half'
    },
    {
      name: 'lastName' as Path<FormValues>,
      label: 'Nom',
      type: 'text',
      required: true,
      col: 'half'
    },
    {
      name: 'email' as Path<FormValues>,
      label: 'Email',
      type: 'email',
      required: true,
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Adresse email invalide'
      }
    },
    {
      name: 'password' as Path<FormValues>,
      label: 'Mot de passe',
      type: 'password',
      required: !editingUser,
      minLength: 6,
      hidden: !!editingUser
    },
    {
      name: 'roles' as Path<FormValues>,
      label: 'Rôle',
      type: 'select',
      options: [
        { value: 'ROLE_USER', label: 'Utilisateur' },
        { value: 'ROLE_ADMIN', label: 'Administrateur' }
      ]
    },
    {
      name: 'isActive' as Path<FormValues>,
      label: 'Compte actif',
      type: 'checkbox'
    }
  ];

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
      header: 'Role',
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
        // Clear auth tokens
        authService.clearAuthData();
        
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

  const openAddModal = () => {
    reset({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      roles: ['ROLE_USER'],
      isActive: true
    });
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    // Ne pas inclure le mot de passe lors de l'édition
    reset({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      isActive: user.isActive !== undefined ? user.isActive : true,
      password: '' 
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      
      if (editingUser) {
        // Mise à jour d'un utilisateur existant
        if (editingUser && editingUser.id) {
          const updateData: UserUpdateData = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            roles: data.roles,
            isActive: data.isActive
          };
          if (data.password) {
            updateData.password = data.password;
          }
          
          await userService.updateUser(editingUser.id, updateData);
        }
        setSuccessMessage("Utilisateur mis à jour avec succès");
      } else {
        // Ajout d'un nouvel utilisateur
        await userService.createUser(data as UserCreationData);
        setSuccessMessage("Utilisateur créé avec succès");
      }
      
      setIsModalOpen(false);
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
    if (window.confirm('Etes-vous sur de vouloir supprimer cet utilisateur?')) {
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(onSubmit)();
  };

  return (
    <Layout title="Gestion des utilisateurs" subtitle="Ajouter, modifier ou supprimer des utilisateurs">
      <DataTablePage<User>
        title="Liste des utilisateurs"
        subtitle=""
        columns={columns}
        data={users}
        isLoading={isLoading}
        error={error}
        errorMessage={errorMessage}
        successMessage={successMessage}
        onAddClick={openAddModal}
        addButtonLabel="+ Ajouter"
      />
      
      {/* Modal pour ajouter/modifier un utilisateur */}
      {isModalOpen && (
        <EntityForm<FormValues>
          title={editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
          fields={formFields}
          errors={errors}
          control={control}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isLoading}
          submitLabel={editingUser ? 'Enregistrer' : 'Ajouter'}
        />
      )}
    </Layout>
  );
};

export default AdminUserManagementPage;