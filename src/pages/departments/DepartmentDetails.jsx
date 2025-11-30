import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDepartmentById } from '../../api/departments';
import { toast } from 'react-toastify';

const DepartmentDetails = () => {
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartment = async () => {
      setLoading(true);
      try {
        const data = await getDepartmentById(id);
        setDepartment(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching department:', err);
        setError('Failed to load department details');
        toast.error('Failed to load department details');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <p className="text-red-700">{error || 'Department not found'}</p>
      </div>
    );
  }

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

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{department.name}</h1>
            <p className="text-gray-600">Code: {department.code}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${
            department.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {department.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{department.description || 'No description available'}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Department Head</h2>
          {department.head ? (
            <div className="p-3 border rounded">
              <p className="font-medium">{department.head.username}</p>
              <p className="text-sm text-gray-600">{department.head.email}</p>
            </div>
          ) : (
            <p className="text-gray-500">Not Assigned</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;