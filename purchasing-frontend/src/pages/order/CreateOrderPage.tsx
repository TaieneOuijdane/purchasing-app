import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import Layout from '../../components/layout/Layout';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import type { Product, OrderCreationData } from '../../types';

const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { control, handleSubmit, watch, formState: { errors } } = useForm<OrderCreationData>({
    defaultValues: {
      productOrders: [{
        product: '',
        quantity: 1
      }],
      notes: '',
      status: 'pending'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productOrders'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts();
      console.log('data received:', data);
      console.log('Type of data:', typeof data);
      setProducts(data);
    } catch (err: any) {
      setError("Impossible de charger les produits");
      console.error('Error fetching products:', err);
    }
  };

  const getProductDetails = (productId: string) => {
    const product = products.find(p => p.id?.toString() === productId);
    return product;
  };

  const calculateLineTotal = (productId: string, quantity: number) => {
    const product = getProductDetails(productId);
    if (!product) return 0;
    return (parseFloat(product.price) || 0) * quantity;
  };

  const calculateOrderTotal = () => {
    const productOrders = watch('productOrders');
    return productOrders.reduce((total, item) => {
      if (item.product && item.quantity > 0) {
        return total + calculateLineTotal(item.product, item.quantity);
      }
      return total;
    }, 0);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    });
  };

  const onSubmit = async (data: OrderCreationData) => {
    const validProducts = data.productOrders.filter(item => 
      item.product && item.quantity > 0
    );
  
    if (validProducts.length === 0) {
      setError("Veuillez ajouter au moins un produit à la commande");
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      // Préparer les données pour l'API
      const orderData = {
        productOrders: validProducts.map(item => ({
          product: `/api/products/${item.product}`,
          quantity: item.quantity
        })),
        notes: data.notes,
        status: data.status
      };
  
      await orderService.createOrder(orderData);
      setSuccessMessage("Commande créée avec succès");
      
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création de la commande");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Nouvelle Commande" subtitle="Créer une commande d'achat">
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-teal-800 mb-4">Produits</h2>
          
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix unitaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fields.map((field, index) => {
                  const productId = watch(`productOrders.${index}.product`);
                  const quantity = watch(`productOrders.${index}.quantity`);
                  const product = getProductDetails(productId);
                  const unitPrice = product ? parseFloat(product.price) || 0 : 0;
                  const lineTotal = calculateLineTotal(productId, quantity);

                  return (
                    <tr key={field.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Controller
                          name={`productOrders.${index}.product`}
                          control={control}
                          rules={{ required: 'Veuillez sélectionner un produit' }}
                          render={({ field: { onChange, value, ref } }) => (
                            <select
                              ref={ref}
                              value={value}
                              onChange={onChange}
                              className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-300 ${
                                errors.productOrders?.[index]?.product
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-300 bg-white hover:border-gray-400'
                              }`}
                            >
                              <option value="">Sélectionner un produit</option>
                              {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.name}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                        {errors.productOrders?.[index]?.product && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.productOrders[index]?.product?.message}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(unitPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Controller
                          name={`productOrders.${index}.quantity`}
                          control={control}
                          rules={{ 
                            required: 'Quantité requise',
                            min: { value: 1, message: 'Minimum 1' }
                          }}
                          render={({ field: { onChange, value, ref } }) => (
                            <input
                              ref={ref}
                              type="number"
                              min="1"
                              value={value}
                              onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                              className={`block w-24 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-300 ${
                                errors.productOrders?.[index]?.quantity
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-300 bg-white hover:border-gray-400'
                              }`}
                            />
                          )}
                        />
                        {errors.productOrders?.[index]?.quantity && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.productOrders[index]?.quantity?.message}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(lineTotal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <button
            type="button"
            onClick={() => append({ product: '', quantity: 1 })}
            className="mt-4 inline-flex items-center px-4 py-2 border border-teal-300 rounded-md shadow-sm text-sm font-medium text-teal-700 bg-white hover:bg-teal-50"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ajouter un produit
          </button>
        </div>

        <div className="mb-6">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <Controller
            name="status"
            control={control}
            rules={{ required: 'Le statut est obligatoire' }}
            render={({ field: { onChange, value, ref } }) => (
              <select
                ref={ref}
                id="status"
                value={value}
                onChange={onChange}
                className={`block px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-300 ${
                errors.status
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <option value="">Sélectionner un statut</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvé</option>
                <option value="rejected">Rejeté</option>
                <option value="completed">Terminé</option>
              </select>
            )}
          />
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">
              {errors.status.message}
            </p>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes (optionnel)
          </label>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="notes"
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-300 hover:border-gray-400"
                placeholder="Ajouter des notes pour cette commande..."
              />
            )}
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-end">
            <div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-medium text-gray-900">
                  <span>Total de la commande:</span>
                  <span className="text-teal-700">{formatPrice(calculateOrderTotal())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
          >
            {isLoading ? 'Création en cours...' : 'Créer la commande'}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default CreateOrderPage;