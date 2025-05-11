import React, { useState, useEffect } from 'react';
import { SimpleDataTable } from '../../components/datatable/SimpleDataTable';

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
}

export interface DataTablePageProps<T> {
  title: string;
  subtitle?: string;
  columns: Column<T>[];
  data: T[];
  isLoading: boolean;
  error: string | null;
  errorMessage: string | null;
  successMessage: string | null;
  onAddClick: () => void;
  addButtonLabel: string;
}

const DataTablePage = <T extends {}>({
  title,
  subtitle,
  columns,
  data,
  isLoading,
  error,
  errorMessage,
  successMessage,
  onAddClick,
  addButtonLabel
}: DataTablePageProps<T>) => {
  const [visibleErrorMessage, setVisibleErrorMessage] = useState<string | null>(null);
  const [visibleSuccessMessage, setVisibleSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setVisibleErrorMessage(errorMessage);
    setVisibleSuccessMessage(successMessage);
    
    let timer: NodeJS.Timeout;
    if (errorMessage || successMessage) {
      timer = setTimeout(() => {
        setVisibleErrorMessage(null);
        setVisibleSuccessMessage(null);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [errorMessage, successMessage]);

  return (
    <div>
      {/* Messages d'alerte */}
      {visibleErrorMessage && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {visibleErrorMessage}
        </div>
      )}
      
      {visibleSuccessMessage && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {visibleSuccessMessage}
        </div>
      )}

      {/* Afficher l'erreur de chargement */}
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
            <h2 className="text-lg font-medium text-teal-800">{title}</h2>
            <p className="text-sm text-gray-500">Total: {data.length} éléments</p>
          </div>
          <button
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            onClick={onAddClick}
            disabled={isLoading}
          >
            {addButtonLabel}
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading && data.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
              Chargement...
            </div>
          ) : (
            <SimpleDataTable columns={columns} data={data} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTablePage;