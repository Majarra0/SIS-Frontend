import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaIdCard, FaPhone, FaMapMarkerAlt, FaEnvelope, FaLock, FaUserShield } from 'react-icons/fa';
import { createUser } from '../../api/users';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';

const UserForm = () => {
  const [formData, setFormData] = useState({
    // User data
    username: '',
    password: '',
    email: '',
    role: 'student',
    is_active: true,
    // Personal info
    first_name: '',
    middle_name: '', // Add this line
    last_name: '',
    gender: 'M',
    date_of_birth: '',
    national_id: '',
    // Contact info
    primary_phone: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relation: '',
    address: '',
    city: '',
    state: '',
    country: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Add error state
  const { userRole, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || user.role !== 'admin') {
        toast.error('This page is only accessible to administrators');
        navigate('/unauthorized');
        return;
      }
    };
    checkAccess();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form data
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setError(Object.values(validationErrors).join(', '));
      setLoading(false);
      return;
    }
  
    try {
      await createUser(formData);
      toast.success('User created successfully');
      navigate('/admin/users');
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (data) => {
    const errors = {};
    
    // Email validation
    if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Invalid email address';
    }
    
    // Password validation
    if (data.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    // Username validation
    if (!data.username.match(/^[a-zA-Z0-9_]+$/)) {
      errors.username = 'Username can only contain letters, numbers and underscores';
    }
    
    // Phone number validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(data.primary_phone)) {
      errors.primary_phone = 'Invalid phone number';
    }
    if (!phoneRegex.test(data.emergency_contact_phone)) {
      errors.emergency_contact_phone = 'Invalid emergency contact phone number';
    }
    
    // Required fields validation
    const requiredFields = [
      'emergency_contact_name',
      'emergency_contact_relation',
      'address',
      'city',
      'state',
      'country'
    ];
    
    requiredFields.forEach(field => {
      if (!data[field]?.trim()) {
        errors[field] = `${field.replace(/_/g, ' ')} is required`;
      }
    });
  
    return errors;
  };

  const formSections = [
    {
      title: 'Personal Information',
      icon: <FaUser className="text-blue-600" />,
      fields: [
        {
          grid: 'grid-cols-3',
          inputs: [
            { name: 'first_name', label: 'First Name', type: 'text', required: true },
            { name: 'middle_name', label: 'Second Name', type: 'text', required: true },
            { name: 'last_name', label: 'Third Name', type: 'text', required: true }
          ]
        },
        {
          grid: 'grid-cols-3',
          inputs: [
            { 
              name: 'gender', 
              label: 'Gender', 
              type: 'select',
              options: [
                { value: 'M', label: 'Male' },
                { value: 'F', label: 'Female' }
              ]
            },
            { name: 'date_of_birth', label: 'Date of Birth', type: 'date' },
            { name: 'national_id', label: 'National ID', type: 'text' }
          ]
        }
      ]
    },
    {
      title: 'Contact Information',
      icon: <FaPhone className="text-blue-600" />,
      fields: [
        {
          grid: 'grid-cols-2',
          inputs: [
            { name: 'primary_phone', label: 'Primary Phone', type: 'tel', required: true },
            { name: 'emergency_contact_phone', label: 'Emergency Contact Phone', type: 'tel'}
          ]
        }
      ]
    },
    {
      title: 'Address Information',
      icon: <FaMapMarkerAlt className="text-blue-600" />,
      fields: [
        {
          grid: 'grid-cols-1',
          inputs: [
            { name: 'address', label: 'Address', type: 'text', required: true }
          ]
        },
        {
          grid: 'grid-cols-3',
          inputs: [
            { name: 'city', label: 'City', type: 'text', required: true },
            { name: 'state', label: 'State', type: 'text', required: true },
            { name: 'country', label: 'Country', type: 'text', required: true }
          ]
        }
      ]
    },
    {
      title: 'Account Information',
      icon: <FaUserShield className="text-blue-600" />,
      fields: [
        {
          grid: 'grid-cols-2',
          inputs: [
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'username', label: 'Username', type: 'text', required: true }
          ]
        },
        {
          grid: 'grid-cols-2',
          inputs: [
            { name: 'password', label: 'Password', type: 'password', required: true },
            { 
              name: 'role', 
              label: 'Role', 
              type: 'select',
              required: true,
              options: [
                { value: 'student', label: 'Student' },
                { value: 'faculty', label: 'Faculty' },
                { value: 'admin', label: 'Admin' }
              ]
            },
            { 
              name: 'level', 
              label: 'Level', 
              type: 'select',
              required: true,
              options: [
                { value: 'Freshman', label: 'Freshman' }
              ]
            }
          ]
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <FaIdCard className="text-blue-600 text-3xl mr-4" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
            <p className="text-gray-600">Create a new user account in the system</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {formSections.map((section, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                {section.icon}
                <h2 className="text-lg font-semibold text-gray-900 ml-2">
                  {section.title}
                </h2>
              </div>
              
              <div className="space-y-4">
                {section.fields.map((field, fieldIdx) => (
                  <div key={fieldIdx} className={`grid ${field.grid} gap-4`}>
                    {field.inputs.map((input, inputIdx) => (
                      <div key={inputIdx}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {input.label}
                          {input.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {input.type === 'select' ? (
                          <select
                            name={input.name}
                            value={formData[input.name]}
                            onChange={handleChange}
                            required={input.required}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                                     focus:border-blue-500 focus:ring-blue-500 transition-colors"
                          >
                            {input.options.map((option, optIdx) => (
                              <option key={optIdx} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={input.type}
                            name={input.name}
                            value={formData[input.name]}
                            onChange={handleChange}
                            required={input.required}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                                     focus:border-blue-500 focus:ring-blue-500 transition-colors"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 
                       hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200
                       flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;