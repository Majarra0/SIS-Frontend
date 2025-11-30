import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUniversity, FaSearch, FaPlus, FaDownload, 
         FaUserTie, FaBuilding } from 'react-icons/fa';
import { getDepartments, deleteDepartment } from '../../api/departments';
import DataTable from '../../components/tables/DataTable';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  const { userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const params = {
          search: searchTerm,
          page: currentPage,
          page_size: pageSize
        };
        const data = await getDepartments(params);
        setDepartments(data.results || data);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Failed to load departments');
        toast.error('Failed to load departments');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchDepartments, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentPage, pageSize]);

  const handleDelete = async (department) => {
    try {
      await deleteDepartment(department.id);
      setDepartments(departments.filter(d => d.id !== department.id));
      toast.success(`Department ${department.name} deleted successfully`);
    } catch (err) {
      console.error('Error deleting department:', err);
      toast.error('Failed to delete department');
    }
  };

  const actions = userRole === 'admin' ? [
    {
      label: 'Edit',
      onClick: (department) => navigate(`/admin/departments/${department.id}/edit`),
      className: 'bg-yellow-500 text-white'
    }
  ] : [];

  const handleRowClick = (department) => {
    navigate(`/admin/departments/${department.id}`);
  };

  const columns = [
    { 
      field: 'department_code', 
      header: 'Department Code',
      render: (code) => (
        <div className="font-mono text-sm font-medium text-blue-600">
          {code}
        </div>
      )
    },
    { 
      field: 'name', 
      header: 'Department Name',
      render: (name) => (
        <div className="flex items-center">
          <FaBuilding className="text-gray-400 mr-2" />
          <span className="font-medium text-gray-900">{name}</span>
        </div>
      )
    },
    {
      field: 'head_faculty',
      header: 'Department Head',
      render: (head_faculty) => (
        <div className="flex items-center">
          <FaUserTie className="text-gray-400 mr-2" />
          <div>
            {head_faculty && head_faculty.personal_info ? (
              <>
                <div className="font-medium text-gray-900">
                  {`${head_faculty.personal_info.first_name} ${head_faculty.personal_info.middle_name} ${head_faculty.personal_info.last_name}`}
                </div>
                <div className="text-sm text-gray-500">
                  {head_faculty.email || head_faculty.username}
                </div>
              </>
            ) : (
              <span className="text-gray-500">Not Assigned</span>
            )}
          </div>
        </div>
      )
    },
    {
      field: 'is_active',
      header: 'Status',
      render: (isActive) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium
          ${isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'}`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <FaUniversity className="text-blue-600 text-3xl mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
              <p className="text-sm text-gray-500">
                Manage academic departments and their heads
              </p>
            </div>
          </div>
          
          {userRole === 'admin' && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate('/admin/departments/new')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 
                         text-white rounded-lg hover:bg-blue-700 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-blue-500 transition-colors"
              >
                <FaPlus className="mr-2" />
                Add Department
              </button>
              <button
                onClick={() => {/* Export logic */}}
                className="inline-flex items-center px-4 py-2 bg-gray-100 
                         text-gray-700 rounded-lg hover:bg-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-gray-500 transition-colors"
              >
                <FaDownload className="mr-2" />
                Export List
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="max-w-xl">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Departments
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by code, name, or department head..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 
                       rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaExclamationCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <DataTable
            data={departments}
            columns={columns}
            actions={actions}
            pagination={true}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            loading={loading}
            error={error}
            onRowClick={handleRowClick}
            className="min-w-full divide-y divide-gray-200"
          />
        )}
      </div>
    </div>
  );
};

export default DepartmentList;