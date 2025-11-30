import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaGraduationCap, FaSearch, FaFilter, FaPlus, 
  FaBook, FaUniversity, FaExclamationCircle 
} from 'react-icons/fa';
import { getCourses, deleteCourse } from '../../api/academic';
import DataTable from '../../components/tables/DataTable';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { getDepartments } from '../../api/departments';


const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  
  const { userRole } = useAuth();
  const navigate = useNavigate();

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, course: null });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data.results || data);
      } catch (err) {
        console.error('Error fetching departments:', err);
        toast.error('Failed to load departments');
      }
    };
  
    fetchDepartments();
  }, []);

  // Add this useEffect after the fetchDepartments useEffect
useEffect(() => {
  const timeoutId = setTimeout(() => {
    fetchCourses();
  }, 500); // Debounce search for 500ms

  return () => clearTimeout(timeoutId);
}, [searchTerm, departmentFilter, filters]); // Dependencies that trigger a new search
  
const fetchCourses = async () => {
  setLoading(true);
  try {
    const params = { 
      search: searchTerm,
      department_id: departmentFilter, // Changed from 'department' to 'department_id'
      ...filters 
    };
    const data = await getCourses(params);
    setCourses(data.results || data);
    setError(null);
  } catch (err) {
    console.error('Error fetching courses:', err);
    const errorMessage = err.response?.data?.detail || 'Failed to load courses';
    toast.error(errorMessage);
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};
  
  const handleRowClick = (course) => {
    navigate(`/admin/courses/${course.id}`);
  };

  const getDepartmentName = (departmentValue) => {
    if (!departmentValue) {
      return 'N/A';
    }
    const deptId = typeof departmentValue === 'object' ? departmentValue.id : Number(departmentValue);
    const department = departments.find(d => d.id === deptId) || (typeof departmentValue === 'object' ? departmentValue : null);
    return department?.name || 'N/A';
  };
  
  const handleDelete = async (course) => {
    setLoading(true);
    try {
      await deleteCourse(course.id);
      setCourses(courses.filter(c => c.id !== course.id));
      toast.success(`Course ${course.course_code} successfully deleted`); // Changed from course_code to course_code
    } catch (err) {
      console.error('Error deleting course:', err);
      toast.error(`Failed to delete course: ${err.message}`);
      setError(`Failed to delete course: ${err.message}`);
    } finally {
      setLoading(false);
      setDeleteModal({ isOpen: false, course: null });
    }
  };

  const actions = userRole === 'admin' ? [
    {
      label: 'Edit',
      onClick: (course) => navigate(`/admin/courses/${course.id}/edit`),
      className: 'bg-yellow-500 text-white hover:bg-yellow-600'
    },
    {
      label: 'Delete',
      onClick: (course) => setDeleteModal({ isOpen: true, course }),
      className: 'bg-red-500 text-white hover:bg-red-600'
    }
  ] : [];


  const columns = [
    { 
      field: 'course_code',
      header: 'Course Code',
      render: (code) => (
        <div className="font-mono text-sm font-medium text-blue-600">
          {code}
        </div>
      )
    },
    { 
      field: 'title',
      header: 'Course Title',
      render: (title) => (
        <div className="font-medium text-gray-900">
          {title}
        </div>
      )
    },
    { 
      field: 'credit_hours',
      header: 'Credits',
      render: (credits) => (
        <div className="text-center font-medium text-gray-700">
          {credits} cr
        </div>
      )
    },
    {
      field: 'department',
      header: 'Department',
      render: (value, row) => (
        <div className="flex items-center">
          <FaUniversity className="text-gray-400 mr-2" />
          <span className="text-gray-700">
            {getDepartmentName(row.department)}
          </span>
        </div>
      )
    },
    {
      field: 'course_level',
      header: 'Level',
      render: (level) => {
        const levelMap = {
          100: 'Level One',
          200: 'Level Two',
          300: 'Level Three',
          400: 'Level Four'
        };
    
        return (
          <div className="text-center">
            <span className={`px-3 py-1 rounded-full text-xs font-medium 
              ${level <= 2 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-purple-100 text-purple-800'}`}
            >
              {levelMap[level] || `Level ${level}`}
            </span>
          </div>
        );
      }
    },
    {
      field: 'is_active',
      header: 'Status',
      render: (isActive) => (
        <div className="text-center">
          <span className={`px-3 py-1 rounded-full text-xs font-medium
            ${isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
            }`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <FaGraduationCap className="text-blue-600 text-3xl mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
              <p className="text-sm text-gray-500">
                Manage and organize academic courses
              </p>
            </div>
          </div>
          {userRole === 'admin' && (
            <button
              onClick={() => navigate('/admin/courses/new')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white 
                         rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 
                         focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <FaPlus className="mr-2" />
              Add New Course
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-7">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Courses
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by code, title, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 
                           rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department Filter
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 
                           rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="md:col-span-2 flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setDepartmentFilter('');
                setFilters({});
                fetchCourses();
              }}
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg 
                         hover:bg-gray-200 focus:outline-none focus:ring-2 
                         focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-sm text-gray-500">Loading courses...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
          <div className="flex">
            <FaExclamationCircle className="h-5 w-5 text-red-400 mr-3" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <DataTable
            data={courses}
            columns={columns}
            onRowClick={handleRowClick}
            actions={actions}
            pagination={true}
            pageSize={10}
            className="min-w-full divide-y divide-gray-200"
          />
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {courses.length} courses
            </p>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Course"
        message={
          <div className="text-center">
            <FaBook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Delete Course
            </p>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete{' '}
              <span className="font-medium text-gray-900">
                {deleteModal.course?.course_code}
              </span>
              ? This action cannot be undone.
            </p>
          </div>
        }
        confirmText="Delete Course"
        confirmClassName="bg-red-600 hover:bg-red-700"
        onConfirm={() => handleDelete(deleteModal.course)}
        onCancel={() => setDeleteModal({ isOpen: false, course: null })}
      />
    </div>
  );
};

export default CourseList;
