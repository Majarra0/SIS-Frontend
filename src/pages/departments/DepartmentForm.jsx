import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDepartment } from '../../api/departments';
import { toast } from 'react-toastify';

const DepartmentForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    is_active: true
  });

  const [validation, setValidation] = useState({
    code: '',
    name: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear validation error when user types
    if (validation[name]) {
      setValidation(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newValidation = {};
    if (!formData.code.trim()) {
      newValidation.code = 'Department code is required';
    }
    if (!formData.name.trim()) {
      newValidation.name = 'Department name is required';
    }
    setValidation(newValidation);
    return Object.keys(newValidation).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await createDepartment(formData);
      toast.success('Department created successfully');
      navigate('/admin/departments');
    } catch (err) {
      console.error('Error creating department:', err);
      toast.error(err.response?.data?.detail || 'Failed to create department');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/departments')}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Departments
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Department</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department Code *
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validation.code ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter department code"
            />
            {validation.code && (
              <p className="mt-1 text-sm text-red-500">{validation.code}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                validation.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter department name"
            />
            {validation.name && (
              <p className="mt-1 text-sm text-red-500">{validation.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter department description"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/departments')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating...' : 'Create Department'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DepartmentForm;