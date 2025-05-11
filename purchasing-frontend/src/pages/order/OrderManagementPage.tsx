import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Order } from '../../types';
import DataTablePage from '../../components/common/DataTablePage';
import Layout from '../../components/layout/Layout';
import { orderService } from '../../services/orderService';
import { authService } from '../../services/authService'; 
import { formatPrice } from '../../utils/formatters';

const OrderManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  // Définir les labels pour les statuts
  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté',
      completed: 'Terminé'
    };
    return statusLabels[status] || status;
  };

  // Définir les couleurs pour les statuts
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  // Colonnes pour la DataTable
  const columns = [
    {
      key: 'orderNumber',
      header: 'N° Commande',
      render: (order: Order) => (
        <div className="text-sm font-medium text-gray-900">
          {order.orderNumber}
        </div>
      ),
    },
    // Faire apparaitre le client juste aux admins
    ...(isAdmin ? [{
      key: 'customer',
      header: 'Client',
      render: (order: Order) => (
        <div className="text-sm text-gray-900">
          {typeof order.customer === 'string' 
            ? `User #${order.customer.split('/').pop()}` 
            : (typeof order.customer === 'object' && order.customer 
              ? `${order.customer.firstName} ${order.customer.lastName}` 
              : 'N/A')}
        </div>
      ),
    }] : []),
    {
      key: 'status',
      header: 'Statut',
      render: (order: Order) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          getStatusColor(order.status)
        }`}>
          {getStatusLabel(order.status)}
        </span>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total',
      render: (order: Order) => (
        <div className="text-sm text-gray-900 font-medium">
          {formatPrice(order.totalAmount)}
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Articles',
      render: (order: Order) => {
        let itemCount = 0;
        if (typeof order.productOrders === 'string') {
          itemCount = 0;
        } else if (Array.isArray(order.productOrders)) {
          itemCount = order.productOrders.length;
        }
        
        return (
          <div className="text-sm text-gray-500">
            {itemCount} article(s)
          </div>
        );
      },
    },
    {
      key: 'orderDate',
      header: 'Date commande',
      render: (order: Order) => (
        <div className="text-sm text-gray-500">
          {new Date(order.orderDate).toLocaleDateString('fr-FR')}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (order: Order) => (
        <div className="space-x-2">
          <button
            onClick={() => handleViewDetails(order.id!)}
            className="text-teal-600 hover:text-teal-900 py-1 rounded hover:bg-teal-50 transition-colors"
            disabled={isLoading}
          >
            Modifier
          </button>
          {/* Only admins can delete orders */}
          {isAdmin && (
            <button
              onClick={() => handleDelete(order.id!)}
              className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 transition-colors"
              disabled={isLoading}
            >
              Supprimer
            </button>
          )}
        </div>
      ),
    }
  ];

  useEffect(() => {
    checkUserRoleAndFetchOrders();
  }, []);

  const checkUserRoleAndFetchOrders = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        setIsAdmin(user.roles.includes('ROLE_ADMIN'));
        await fetchOrders();
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      navigate('/login', { 
        state: { 
          from: location.pathname,
          message: "Veuillez vous connecter pour accéder à cette page." 
        } 
      });
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await orderService.getOrders();
      console.log('Réponse de l\'orderService:', response);
      
      setOrders(response);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      
      if (err.statusCode === 401) {
        authService.clearAuthData();
        
        // Redirect to login
        navigate('/login', { 
          state: { 
            from: location.pathname,
            message: "Votre session a expiré. Veuillez vous reconnecter pour accéder à vos commandes." 
          } 
        });
      } 
      else if (err.statusCode === 500) {
        setError(
          "Une erreur de configuration du serveur s'est produite. " +
          "Veuillez contacter l'administrateur système. " +
          "Détail: " + (err.message || "Erreur inconnue")
        );
      } 
      else {
        setError(err.message || "Impossible de charger les commandes");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrder = () => {
    navigate('/orders/create');
  };

  const handleViewDetails = (orderId: number) => {
    navigate(`/orders/update/${orderId}`);
  };

  const handleDelete = async (orderId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande?')) {
      try {
        setIsLoading(true);
        await orderService.deleteOrder(orderId.toString());
        setSuccessMessage("Commande supprimée avec succès");
        fetchOrders(); // Recharger la liste après suppression
      } catch (error: any) {
        console.error("Erreur lors de la suppression", error);
        setErrorMessage(error.message || "Impossible de supprimer la commande");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Layout 
      title="Gestion des commandes"
      subtitle="Visualiser et gérer les commandes"
    >
      <DataTablePage<Order>
        title="Liste des commandes"
        subtitle=""
        columns={columns}
        data={orders}
        isLoading={isLoading}
        error={error}
        errorMessage={errorMessage}
        successMessage={successMessage}
        onAddClick={handleAddOrder}
        addButtonLabel="+ Nouvelle commande"
      />
    </Layout>
  );
};

export default OrderManagementPage;
