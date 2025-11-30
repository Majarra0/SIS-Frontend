import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSearch, FaFilter, FaUserCircle, FaEnvelope, FaExclamationCircle } from 'react-icons/fa';
import { getUsers, deleteUser } from '../../api/users';
import DataTable from '../../components/tables/DataTable';
import useAuth from '../../hooks/useAuth';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { toast } from 'react-toastify';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm,
        role: roleFilter
      };
      const data = await getUsers(params);
      const filteredUsers = (data.results || data).filter(user => user.role);
      setUsers(filteredUsers);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, roleFilter]);

  const handleDelete = async (user) => {
    setLoading(true);
    try {
      await deleteUser(user.id);
      setUsers(users.filter(u => u.id !== user.id));
      toast.success(`User ${user.personal_info?.first_name} ${user.personal_info?.last_name} deleted successfully`);
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    } finally {
      setLoading(false);
      setDeleteModal({ isOpen: false, user: null });
    }
  };

  const actions = userRole === 'admin' ? [
    {
      label: 'View',
      onClick: (user) => navigate(`/admin/users/${user.id}`),
      className: 'bg-blue-500 text-white'
    },
    {
      label: 'Edit',
      onClick: (user) => navigate(`/admin/users/${user.id}/edit`),
      className: 'bg-yellow-500 text-white'
    },
    {
      label: 'Delete',
      onClick: (user) => setDeleteModal({ isOpen: true, user }),
      className: 'bg-red-500 text-white'
    }
  ] : [];

  const columns = [
    {
      field: 'id',
      header: 'ID',
      render: (_, row) => {    
        const year = '2025';
        const dept = row.department?.code?.toUpperCase() || 'CS';
        const sid = String(row.id);
    
        const combinedId = `${year}${dept}${sid}`;
    
        return <span className="font-mono text-sm text-gray-700">{combinedId}</span>;
      }
    },
    {
      field: 'personal_info',
      header: 'Name',
      render: (_, row) => {
        const fullName = [
          row.personal_info?.first_name,
          row.personal_info?.middle_name,
          row.personal_info?.last_name
        ]
          .filter(Boolean)
          .join(' ');
    
        return (
          <div className="flex items-center">
            <FaUserCircle className="text-gray-400 mr-2" />
            <div>
              <div className="font-medium text-gray-900">
                {fullName || 'No name provided'}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      field: 'email',
      header: 'Contact',
      render: (email) => (
        <div className="flex items-center">
          <FaEnvelope className="text-gray-400 mr-2" />
          <a href={`mailto:${email}`} className="text-blue-600 hover:text-blue-800">
            {email}
          </a>
        </div>
      )
    },
    // Replace the existing level field in columns with this new role/level field:
{
  field: 'role',
  header: 'Role/Level',
  render: (_, row) => {
    if (row.role === 'student') {
      const levels = ['Freshman', 'Sophomore', 'Junior', 'Senior'];
      const mockLevel = levels[row.id % levels.length];
      
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        bg-indigo-100 text-indigo-800">
          {mockLevel}
        </span>
      );
    }

    const roleColors = {
      admin: 'bg-purple-100 text-purple-800',
      faculty: 'bg-blue-100 text-blue-800',
      staff: 'bg-gray-100 text-gray-800'
    };

    const roleLabels = {
      admin: 'Administrator',
      faculty: 'Professor',
      staff: 'Staff Member'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${roleColors[row.role] || 'bg-gray-100 text-gray-800'}`}>
        {roleLabels[row.role] || row.role}
      </span>
    );
  }
},
    {
      field: 'status',
      header: 'Status',
      render: (_, row) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${row.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete User"
        message={
          <div className="text-center">
            <FaUserCircle className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-lg text-gray-900 font-medium mb-2">
              Delete User Account
            </p>
            <p className="text-gray-500">
              Are you sure you want to delete the account for{' '}
              <span className="font-medium text-gray-900">
                {deleteModal.user?.personal_info?.first_name}{' '}
                {deleteModal.user?.personal_info?.last_name}
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        }
        confirmText="Delete Account"
        confirmClassName="bg-red-600 hover:bg-red-700"
        onConfirm={() => handleDelete(deleteModal.user)}
        onCancel={() => setDeleteModal({ isOpen: false, user: null })}
      />

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage system users, roles, and permissions
            </p>
          </div>
          {userRole === 'admin' && (
            <button
              onClick={() => navigate('/admin/users/new')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                         focus:ring-blue-500 transition-colors duration-200"
            >
              <FaUserPlus className="mr-2" />
              Add New User
            </button>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Users
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or ID..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                           focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                           focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Roles</option>
                <option value="student">Students</option>
                <option value="faculty">Professors</option>
                <option value="admin">Deanship</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">Loading users...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <DataTable
            data={users}
            columns={columns}
            actions={actions}
            pagination={true}
            pageSize={10}
            className="min-w-full divide-y divide-gray-200"
          />
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {users.length} users {roleFilter && `with role "${roleFilter}"`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;