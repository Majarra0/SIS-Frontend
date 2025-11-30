import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, updateUser } from '../../api/users';
import useAuth from '../../hooks/useAuth';

const UserDetail = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getUserById(id);
        setUser(data);
        setFormData(data);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err.message || 'Failed to load user details');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Handle nested form data
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(id, formData);
      setUser(formData);
      setEditing(false);
    } catch (err) {
      setError('Failed to update user details');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Details</h1>
        {userRole === 'admin' && (
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Personal Information
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
  type="text"
  name="personal_info.first_name"
  value={formData.personal_info?.first_name || ''}
  onChange={handleInputChange}
  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                  <input
                    type="text"
                    name="middle_name"
                    value={formData.personal_info?.middle_name || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.personal_info?.last_name || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={formData.personal_info?.gender || 'M'}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        {/* Contact Information Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Contact Information
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Primary Phone</label>
                  <input
  type="text"
  name="contact_info.primary_phone"
  value={formData.contact_info?.primary_phone || ''}
  onChange={handleInputChange}
  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.contact_info?.address || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                {/* Add other contact fields similarly */}
              </div>
            </div>
          </div>
      {/* Buttons */}
      <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* View Personal Information */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Personal Information
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user.personal_info?.first_name} {user.personal_info?.middle_name} {user.personal_info?.last_name}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Gender</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user.personal_info?.gender === 'M' ? 'Male' : 'Female'}
                  </dd>
                </div>
                {/* ...existing email and role fields... */}
              </dl>
            </div>
          </div>

          {/* View Contact Information */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Contact Information
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user.contact_info?.primary_phone || 'N/A'}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user.contact_info?.address || 'N/A'}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Emergency Contact</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user.contact_info?.emergency_contact_name || 'N/A'} ({user.contact_info?.emergency_contact_relation || 'N/A'})
                    <br />
                    {user.contact_info?.emergency_contact_phone || 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;