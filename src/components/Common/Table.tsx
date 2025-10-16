import React, { useState, useMemo } from 'react';
import { Eye, Edit, Trash2, MoreVertical, ArrowUp, ArrowDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortKey?: string; // Key to send to API for sorting (defaults to key if not provided)
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  sortFunction?: (a: T, b: T) => number;
}

export interface TableAction<T = any> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: T) => void;
  variant?: 'default' | 'primary' | 'danger' | 'success';
  show?: (row: T) => boolean;
}

// Pagination is now consistent across the application
const DEFAULT_PAGINATION = {
  enabled: true,
  pageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
  showPageSizeSelector: true,
};

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  actions?: {
    view?: TableAction<T>;
    edit?: TableAction<T>;
    delete?: TableAction<T>;
    custom?: TableAction<T>[];
  };
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  onSort?: (sortKey: string, sortOrder: 'asc' | 'desc') => void; // Callback for API sorting
}

const Table = <T extends Record<string, any>>({
  columns,
  data,
  actions,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  striped = true,
  hoverable = true,
  onSort,
}: TableProps<T>) => {
  const hasActions = actions && (actions.view || actions.edit || actions.delete || actions.custom);
  
  // Sorting state - default sort order is always 'asc', no default sort key
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGINATION.pageSize);

  // Handle column sort
  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable) return;

    const newSortOrder = sortKey === column.key ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';
    const apiSortKey = column.sortKey || column.key; // Use sortKey for API, fallback to key

    if (sortKey === column.key) {
      // Toggle sort order
      setSortOrder(newSortOrder);
    } else {
      // New column sort
      setSortKey(column.key);
      setSortOrder(newSortOrder);
    }
    
    // Reset to first page when sorting
    setCurrentPage(1);
    
    // Call onSort callback if provided (for API sorting)
    if (onSort) {
      onSort(apiSortKey, newSortOrder);
    }
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    const column = columns.find(col => col.key === sortKey);
    const sorted = [...data].sort((a, b) => {
      // Use custom sort function if provided
      if (column?.sortFunction) {
        return column.sortFunction(a, b);
      }

      // Default sort
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }

      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    });

    return sortOrder === 'desc' ? sorted.reverse() : sorted;
  }, [data, sortKey, sortOrder, columns]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!DEFAULT_PAGINATION.enabled) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startRecord = sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, sortedData.length);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const getActionVariantClass = (variant?: string) => {
    switch (variant) {
      case 'primary':
        return 'text-primary-600 hover:text-primary-700 hover:bg-primary-50';
      case 'danger':
        return 'text-red-600 hover:text-red-700 hover:bg-red-50';
      case 'success':
        return 'text-green-600 hover:text-green-700 hover:bg-green-50';
      default:
        return 'text-gray-600 hover:text-gray-700 hover:bg-gray-50';
    }
  };

  const renderActionButton = (action: TableAction<T>, row: T, icon: React.ComponentType<{ className?: string }>) => {
    // Check if action should be shown for this row
    if (action.show && !action.show(row)) {
      return null;
    }

    const Icon = action.icon || icon;

    return (
      <button
        key={action.label}
        onClick={(e) => {
          e.stopPropagation();
          action.onClick(row);
        }}
        className={`p-2 rounded-lg transition-colors ${getActionVariantClass(action.variant)}`}
        title={action.label}
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  };

  const renderCellValue = (column: TableColumn<T>, row: T) => {
    const value = row[column.key];
    
    if (column.render) {
      return column.render(value, row);
    }
    
    return value !== null && value !== undefined ? String(value) : '-';
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const renderSortIcon = (column: TableColumn<T>) => {
    if (!column.sortable) return null;

    if (sortKey !== column.key) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }

    return sortOrder === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-primary-600" />
      : <ArrowDown className="w-4 h-4 text-primary-600" />;
  };

  const displayData = DEFAULT_PAGINATION.enabled ? paginatedData : sortedData;

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-left py-3 px-4 text-sm font-semibold text-gray-700 ${
                    column.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {renderSortIcon(column)}
                  </div>
                </th>
              ))}
              {hasActions && (
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {displayData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="py-8 px-4 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              displayData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`
                    border-b border-gray-100 last:border-0
                    ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''}
                    ${hoverable ? 'hover:bg-gray-100' : ''}
                    ${onRowClick ? 'cursor-pointer' : ''}
                    transition-colors
                  `}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="py-3 px-4 text-sm text-gray-900"
                    >
                      {renderCellValue(column, row)}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {actions.view && renderActionButton(actions.view, row, Eye)}
                        {actions.edit && renderActionButton(actions.edit, row, Edit)}
                        {actions.delete && renderActionButton(actions.delete, row, Trash2)}
                        {actions.custom?.map((customAction) =>
                          renderActionButton(customAction, row, MoreVertical)
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {DEFAULT_PAGINATION.enabled && sortedData.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            {/* Records info */}
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{startRecord}</span> to{' '}
              <span className="font-medium">{endRecord}</span> of{' '}
              <span className="font-medium">{sortedData.length}</span> results
            </div>

            <div className="flex items-center space-x-4">
              {/* Page size selector */}
              {DEFAULT_PAGINATION.showPageSizeSelector && (
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-700">Rows per page:</label>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {DEFAULT_PAGINATION.pageSizeOptions.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Pagination controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-primary-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
