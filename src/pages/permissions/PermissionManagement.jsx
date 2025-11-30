import React, { useState } from 'react';
import { FaShieldAlt, FaSave, FaUndo, FaCheck, FaSearch, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Mock users data
const mockUsers = [
  {
    id: 1,
    name: 'Ali Ahmed',
    email: 'AliAhmed@example.com',
    role: 'faculty',
    department: 'Computer Science',
    customPermissions: {
      courses: { view: true, edit: true, create: true, delete: false },
      grades: { view: true, edit: true, create: true },
      attendance: { view: true, edit: true, create: true },
      students: { view: true },
      profile: { view: true, edit: true }
    }
  },
  {
    id: 2,
    name: 'Sarah Ali',
    email: 'sarahali@example.com',
    role: 'faculty',
    department: 'Engineering',
    customPermissions: {
      courses: { view: true, edit: true, create: false, delete: false },
      grades: { view: true, edit: true, create: true },
      attendance: { view: true, edit: true, create: false },
      students: { view: true },
      profile: { view: true, edit: true }
    }
  },
  {
    id: 3,
    name: 'Saif Ahmed',
    email: 'saidahmed@example.com',
    role: 'admin',
    department: 'Administration',
    customPermissions: {
      courses: { view: true, edit: true, create: true, delete: true },
      grades: { view: true, edit: true, create: true, delete: true },
      attendance: { view: true, edit: true, create: true, delete: true },
      users: { view: true, edit: true, create: true, delete: true },
      departments: { view: true, edit: true, create: true, delete: true },
      settings: { view: true, edit: true },
      permissions: { view: true, edit: true }
    }
  }
];

const PermissionManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePermissionChange = (module, action) => {
    if (!selectedUser) return;

    setUsers(prev => prev.map(user => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          customPermissions: {
            ...user.customPermissions,
            [module]: {
              ...user.customPermissions[module],
              [action]: !user.customPermissions[module][action]
            }
          }
        };
      }
      return user;
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Permissions updated for ${selectedUser.name}`);
    } catch (error) {
      toast.error('Failed to update permissions');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <FaShieldAlt className="text-blue-600 text-3xl mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Permissions</h1>
              <p className="text-sm text-gray-500">
                Manage individual user permissions
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">Search Users</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full 
                           pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Search by name, email..."
                />
              </div>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all
                    ${selectedUser?.id === user.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-200'}`}
                >
                  <div className="flex items-center">
                    <FaUser className="text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-xs text-gray-400">{user.department}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="lg:col-span-2">
          {selectedUser ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">
                    Permissions for {selectedUser.name}
                  </h2>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 
                             text-white rounded-lg hover:bg-blue-700 
                             focus:outline-none focus:ring-2 focus:ring-offset-2 
                             focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                             fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" 
                                  stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" 
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Module
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        View
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Create
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Edit
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(selectedUser.customPermissions).map(([module, actions]) => (
                      <tr key={module}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                          {module}
                        </td>
                        {['view', 'create', 'edit', 'delete'].map(action => (
                          <td key={action} className="px-6 py-4 whitespace-nowrap text-center">
                            {actions[action] !== undefined && (
                              <button
                                onClick={() => handlePermissionChange(module, action)}
                                className={`w-6 h-6 rounded flex items-center justify-center
                                  ${actions[action] 
                                    ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                              >
                                <FaCheck className={`w-3 h-3 ${actions[action] ? 'opacity-100' : 'opacity-0'}`} />
                              </button>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <FaUser className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a User
              </h3>
              <p className="text-gray-500">
                Choose a user from the list to manage their permissions
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionManagement;