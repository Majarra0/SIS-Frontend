import React, { useState } from 'react';

const DataTable = ({ 
  data, 
  columns, 
  onRowClick, 
  actions = [], 
  pagination = true,
  pageSize = 10 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate pagination
  const totalPages = pagination ? Math.ceil(data.length / pageSize) : 1;
  const paginatedData = pagination 
    ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize) 
    : data;
    
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <th 
                key={column.field} 
                className="px-4 py-2 text-left text-sm font-medium text-gray-600"
              >
                {column.header}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex} 
                onClick={() => onRowClick && onRowClick(row)}
                className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
              >
                {columns.map((column) => (
                  <td key={column.field} className="border-t px-4 py-2 text-sm">
                  {column.render 
                    ? column.render(getNestedValue(row, column.field), row)
                    : getNestedValue(row, column.field)}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="border-t px-4 py-2 text-sm">
                    <div className="flex space-x-2">
                      {actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(row);
                          }}
                          className={`px-2 py-1 text-xs rounded ${action.className || 'bg-blue-500 text-white'}`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={columns.length + (actions.length > 0 ? 1 : 0)} 
                className="border-t px-4 py-8 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {pagination && totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, data.length)} of {data.length} entries
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded border disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(totalPages).keys()].map(page => (
              <button
                key={page + 1}
                onClick={() => handlePageChange(page + 1)}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === page + 1 
                    ? 'bg-blue-500 text-white' 
                    : 'border'
                }`}
              >
                {page + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm rounded border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;