import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { Path } from 'react-hook-form';
import Layout from '../../components/layout/Layout';
import DataTablePage from '../../components/common/DataTablePage';
import EntityForm from '../../components/common/EntityForm';
import type { FormField } from '../../components/common/EntityForm';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import type { ProductCreationData, ProductUpdateData } from '../../services/productService';
import type { CategoryCreationData, CategoryUpdateData } from '../../services/categoryService';
import type { Product, Category } from '../../types';

// Fonction pour le prix
const formatPrice = (price: string): string => {
  return parseFloat(price).toLocaleString('fr-MA', {
    style: 'currency',
    currency: 'MAD'
  });
};

type ProductFormValues = {
  name: string;
  description: string;
  price: string;
  sku: string;
  stock: number;
  image: string;
  isActive: boolean;
  categoryId: string;
};

type CategoryFormValues = {
  name: string;
  description: string;
};

const ProductManagementPage: React.FC = () => {
  // État pour les onglets
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  
  // États communs
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les produits
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // États pour les catégories
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const navigate = useNavigate();
  
  const { 
    control: productControl, 
    handleSubmit: handleProductSubmit, 
    reset: resetProductForm, 
    formState: { errors: productErrors } 
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      sku: '',
      stock: 0,
      image: '',
      isActive: true,
      categoryId: ''
    }
  });
  
  const { 
    control: categoryControl, 
    handleSubmit: handleCategorySubmit, 
    reset: resetCategoryForm, 
    formState: { errors: categoryErrors } 
  } = useForm<CategoryFormValues>({
    defaultValues: {
      name: '',
      description: ''
    }
  });

  // Colonnes pour la DataTable des produits
  const productColumns = [
    {
      key: 'image',
      header: 'Image',
      render: (product: Product) => (
        <div className="flex items-center justify-center">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="h-10 w-10 object-cover rounded-md"
            />
          ) : (
            <div className="h-10 w-10 bg-gray-200 flex items-center justify-center rounded-md text-gray-500">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Nom',
      render: (product: Product) => (
        <div className="text-sm font-medium text-gray-900">{product.name}</div>
      ),
    },
    {
      key: 'sku',
      header: 'SKU',
      render: (product: Product) => (
        <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{product.sku}</div>
      ),
    },
    {
      key: 'price',
      header: 'Prix',
      render: (product: Product) => (
        <div className="text-sm text-gray-700 font-medium">{formatPrice(product.price)}</div>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (product: Product) => (
        <div className={`text-sm ${product.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
          {product.stock} unités
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Catégorie',
      render: (product: Product) => {
        const categoryId = typeof product.category === 'number' 
          ? product.category 
          : (product.category as any)?.id || 0;
          
        const categoryName = typeof product.category === 'object' && product.category 
          ? (product.category as Category).name 
          : categories.find(c => c.id === categoryId)?.name || 'Non définie';
          
        return (
          <div className="text-sm px-2 py-1 bg-teal-50 text-teal-700 rounded-full inline-block">
            {categoryName}
          </div>
        );
      },
    },
    {
      key: 'isActive',
      header: 'Statut',
      render: (product: Product) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          product.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {product.isActive ? 'Actif' : 'Inactif'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (product: Product) => (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => openEditProductModal(product)}
            className="text-teal-600 hover:text-teal-900"
            disabled={isLoading}
            style={{ backgroundColor: 'transparent', border: 'none' }}
          >
            Modifier
          </button>
          <button
            onClick={() => product.id && handleDeleteProduct(product.id.toString())}
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

  // Colonnes pour la DataTable des catégories
  const categoryColumns = [
    {
      key: 'name',
      header: 'Nom',
      render: (category: Category) => (
        <div className="text-sm font-medium text-gray-900">{category.name}</div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (category: Category) => (
        <div className="text-sm text-gray-500">
          {category.description || <span className="text-gray-400 italic">Aucune description</span>}
        </div>
      ),
    },
    {
      key: 'productsCount',
      header: 'Produits associés',
      render: (category: Category) => {
        const count = products.filter(p => {
          if (typeof p.category === 'object' && p.category) {
            return (p.category as Category).id === category.id;
          }
          return p.category === category.id;
        }).length;
        
        return (
          <div className="text-sm">
            <span className="px-2 py-1 bg-teal-50 text-teal-700 rounded-full">
              {count} produit{count !== 1 ? 's' : ''}
            </span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (category: Category) => (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => openEditCategoryModal(category)}
            className="text-teal-600 hover:text-teal-900"
            disabled={isLoading}
            style={{ backgroundColor: 'transparent', border: 'none' }}
          >
            Modifier
          </button>
          <button
            onClick={() => category.id && handleDeleteCategory(category.id.toString())}
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

  // Charger les produits et les catégories
  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()]);
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await productService.getProducts();
      console.log('Produits chargés:', data);
      setProducts(data);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      
      if (err.statusCode === 401) {
        localStorage.removeItem('token');
        navigate('/login', { 
          state: { 
            from: location.pathname,
            message: "Veuillez vous connecter avec un compte administrateur pour accéder à cette page." 
          } 
        });
      } else {
        setError(err.message || "Impossible de charger les produits");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Définition des champs du formulaire produit
  const getProductFormFields = (): FormField<ProductFormValues>[] => [
    {
      name: 'name' as Path<ProductFormValues>,
      label: 'Nom du produit',
      type: 'text',
      required: true
    },
    {
      name: 'description' as Path<ProductFormValues>,
      label: 'Description',
      type: 'text'
    },
    {
      name: 'price' as Path<ProductFormValues>,
      label: 'Prix (€)',
      type: 'text',
      col: 'half',
      required: true,
      validationRules: {
        required: 'Le prix est requis',
        pattern: {
          value: /^\d+(\.\d{1,2})?$/,
          message: 'Veuillez entrer un prix valide (exemple: 19.99)'
        }
      }
    },
    {
      name: 'sku' as Path<ProductFormValues>,
      label: 'SKU',
      type: 'text',
      col: 'half',
      required: true
    },
    {
      name: 'stock' as Path<ProductFormValues>,
      label: 'Stock',
      type: 'text',
      col: 'half',
      required: true,
      validationRules: {
        required: 'Le stock est requis',
        pattern: {
          value: /^\d+$/,
          message: 'Veuillez entrer un nombre entier valide'
        }
      }
    },
    {
      name: 'categoryId' as Path<ProductFormValues>,
      label: 'Catégorie',
      type: 'select',
      col: 'half',
      required: true,
      options: [
        { value: '', label: 'Sélectionner une catégorie' },
        ...categories.map(cat => ({ 
          value: cat.id ? cat.id.toString() : '', 
          label: cat.name 
        }))
      ]
    },
    {
      name: 'image' as Path<ProductFormValues>,
      label: 'URL de l\'image',
      type: 'text'
    },
    {
      name: 'isActive' as Path<ProductFormValues>,
      label: 'Produit actif',
      type: 'checkbox'
    }
  ];

  // Définition des champs du formulaire catégorie
  const getCategoryFormFields = (): FormField<CategoryFormValues>[] => [
    {
      name: 'name' as Path<CategoryFormValues>,
      label: 'Nom de la catégorie',
      type: 'text',
      required: true
    },
    {
      name: 'description' as Path<CategoryFormValues>,
      label: 'Description',
      type: 'text'
    }
  ];

  const openAddProductModal = () => {
    resetProductForm({
      name: '',
      description: '',
      price: '',
      sku: '',
      stock: 0,
      image: '',
      isActive: true,
      categoryId: ''
    });
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    
    let categoryId: string = '';
    if (typeof product.category === 'object' && product.category && 'id' in product.category) {
      categoryId = ((product.category as Category).id || '').toString();
    } else if (typeof product.category === 'number') {
      categoryId = product.category.toString();
    } else if (typeof product.category === 'string') {
      const categoryString = product.category as string;
      if (categoryString.includes('/api/categories/')) {
        const matches = categoryString.match(/\/api\/categories\/(\d+)/);
        if (matches && matches[1]) {
          categoryId = matches[1];
        }
      }
    }
    
    resetProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      sku: product.sku,
      stock: product.stock,
      image: product.image || '',
      isActive: product.isActive ?? true,
      categoryId: categoryId
    });
    
    setIsModalOpen(true);
  };

  const openAddCategoryModal = () => {
    resetCategoryForm({
      name: '',
      description: ''
    });
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditCategoryModal = (category: Category) => {
    setEditingCategory(category);
    
    resetCategoryForm({
      name: category.name,
      description: category.description || ''
    });
    
    setIsModalOpen(true);
  };

  const onProductSubmit = async (data: ProductFormValues) => {
    try {
      setIsLoading(true);
      
      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        sku: data.sku,
        stock: parseInt(data.stock.toString()),
        image: data.image,
        isActive: data.isActive,
        category: data.categoryId ? `/api/categories/${data.categoryId}` : null
      };
      
      if (editingProduct) {
        // Mise à jour d'un produit existant
        if (editingProduct.id) {
          await productService.updateProduct(
            editingProduct.id, 
            productData as ProductUpdateData
          );
        }
        setSuccessMessage("Produit mis à jour avec succès");
      } else {
        // Ajout d'un nouveau produit
        await productService.createProduct(productData as ProductCreationData);
        setSuccessMessage("Produit créé avec succès");
      }
      
      setIsModalOpen(false);
      fetchProducts(); // Recharger la liste après modification
    } catch (error: any) {
      console.error("Erreur lors de l'opération", error);
      setErrorMessage(error.message || (editingProduct 
        ? "Impossible de mettre à jour le produit" 
        : "Impossible de créer le produit"));
    } finally {
      setIsLoading(false);
    }
  };

  const onCategorySubmit = async (data: CategoryFormValues) => {
    try {
      setIsLoading(true);
      
      const categoryData = {
        name: data.name,
        description: data.description
      };
      
      if (editingCategory) {
        // Mise à jour d'une catégorie existante
        if (editingCategory.id) {
          await categoryService.updateCategory(
            editingCategory.id, 
            categoryData as CategoryUpdateData
          );
        }
        setSuccessMessage("Catégorie mise à jour avec succès");
      } else {
        // Ajout d'une nouvelle catégorie
        await categoryService.createCategory(categoryData as CategoryCreationData);
        setSuccessMessage("Catégorie créée avec succès");
      }
      
      setIsModalOpen(false);
      fetchCategories(); // Recharger la liste après modification
      fetchProducts();
    } catch (error: any) {
      console.error("Erreur lors de l'opération", error);
      setErrorMessage(error.message || (editingCategory 
        ? "Impossible de mettre à jour la catégorie" 
        : "Impossible de créer la catégorie"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Etes-vous sur de vouloir supprimer ce produit?')) {
      try {
        setIsLoading(true);
        await productService.deleteProduct(id);
        setSuccessMessage("Produit supprimé avec succès");
        fetchProducts();
      } catch (error: any) {
        console.error("Erreur lors de la suppression", error);
        setErrorMessage(error.message || "Impossible de supprimer le produit");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Fonctions pour les catégories
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoryService.getCategories();
      console.log('Catégories chargées:', data);
      setCategories(data);
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setErrorMessage("Impossible de charger les catégories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const productsWithCategory = products.filter(p => {
      if (typeof p.category === 'object' && p.category) {
        return (p.category as Category).id === parseInt(id);
      }
      return p.category === parseInt(id);
    });
    
    if (productsWithCategory.length > 0) {
      setErrorMessage(`Impossible de supprimer cette catégorie : ${productsWithCategory.length} produit(s) y sont associés.`);
      return;
    }
    
    if (window.confirm('Etes-vous sur de vouloir supprimer cette catégorie?')) {
      try {
        setIsLoading(true);
        await categoryService.deleteCategory(id);
        setSuccessMessage("Catégorie supprimée avec succès");
        fetchCategories();
      } catch (error: any) {
        console.error("Erreur lors de la suppression", error);
        setErrorMessage(error.message || "Impossible de supprimer la catégorie");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'products') {
      handleProductSubmit(onProductSubmit)();
    } else {
      handleCategorySubmit(onCategorySubmit)();
    }
  };

  return (
    <Layout title="Gestion du catalogue" subtitle="Administrez vos produits et catégories">
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('products')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Produits
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Catégories
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'products' ? (
        <DataTablePage<Product>
          title="Liste des produits"
          subtitle=""
          columns={productColumns}
          data={products}
          isLoading={isLoading}
          error={error}
          errorMessage={errorMessage}
          successMessage={successMessage}
          onAddClick={openAddProductModal}
          addButtonLabel="+ Ajouter un produit"
        />
      ) : (
        <DataTablePage<Category>
          title="Liste des catégories"
          subtitle=""
          columns={categoryColumns}
          data={categories}
          isLoading={isLoading}
          error={error}
          errorMessage={errorMessage}
          successMessage={successMessage}
          onAddClick={openAddCategoryModal}
          addButtonLabel="+ Ajouter une catégorie"
        />
      )}
      
      {/* Modal pour ajouter/modifier un produit ou une catégorie */}
      {isModalOpen && (
        activeTab === 'products' ? (
          <EntityForm<ProductFormValues>
            title={editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
            fields={getProductFormFields()}
            errors={productErrors}
            control={productControl}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
            isLoading={isLoading}
            submitLabel={editingProduct ? 'Enregistrer' : 'Ajouter'}
          />
        ) : (
          <EntityForm<CategoryFormValues>
            title={editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
            fields={getCategoryFormFields()}
            errors={categoryErrors}
            control={categoryControl}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
            isLoading={isLoading}
            submitLabel={editingCategory ? 'Enregistrer' : 'Ajouter'}
          />
        )
      )}
    </Layout>
  );
};

export default ProductManagementPage;