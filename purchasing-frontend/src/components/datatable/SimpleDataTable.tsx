// src/components/DataTable/SimpleDataTable.tsx
import React, { useState, useMemo } from 'react';
import * as Separator from '@radix-ui/react-separator';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

interface SimpleDataTableProps<T> {
  data: T[];
  columns: {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
  }[];
  pageSize?: number;
}

export function SimpleDataTable<T>({
  data,
  columns,
  pageSize = 10,
}: SimpleDataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  // Calculer le nombre total de pages
  const pageCount = Math.ceil(data.length / currentPageSize);

  // Obtenir les données pour la page actuelle
  const paginatedData = useMemo(() => {
    const start = currentPage * currentPageSize;
    const end = start + currentPageSize;
    return data.slice(start, end);
  }, [data, currentPage, currentPageSize]);

  // Changement de page
  const goToPage = (pageIndex: number) => {
    setCurrentPage(Math.max(0, Math.min(pageIndex, pageCount - 1)));
  };

  // Pages suivante et précédente
  const nextPage = () => goToPage(currentPage + 1);
  const previousPage = () => goToPage(currentPage - 1);

  return (
    <div className="w-full">
      <div className="rounded-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-green-50 to-teal-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {column.render 
                        ? column.render(item) 
                        : (item as any)[column.key]
                      }
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-6 text-center text-sm text-gray-500"
                >
                  Aucun résultat trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-700">
            Page{' '}
            <span className="font-medium">
              {Math.min(currentPage + 1, pageCount) || 1}
            </span>{' '}
            sur{' '}
            <span className="font-medium">
              {pageCount || 1}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={currentPageSize}
            onChange={(e) => {
              setCurrentPageSize(Number(e.target.value));
              setCurrentPage(0); 
            }}
            className="h-9 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
          >
            {[10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size} par page
              </option>
            ))}
          </select>

          <Separator.Root
            orientation="vertical"
            className="h-6 w-px bg-gray-200"
          />

          <button
            className="inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            onClick={previousPage}
            disabled={currentPage === 0}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            className="inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            onClick={nextPage}
            disabled={currentPage >= pageCount - 1}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}