import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import Table from '../../components/ui/Table'; // Crée un composant Table pour afficher les utilisateurs
import { useAuth } from '../../hooks/useAuth';

const AdminPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
    fetchUsers();
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await userService.deleteUser(id);
      fetchUsers(); // Recharger les utilisateurs après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestion des utilisateurs</h1>
      <Table users={users} onDelete={handleDelete} />
    </div>
  );
};

export default AdminPage;
