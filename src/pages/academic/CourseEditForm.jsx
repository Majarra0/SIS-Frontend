import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { getCourse, updateCourse, getCourses } from '../../api/academic';
import { getDepartments } from '../../api/departments';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';

const CourseEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  const GRADE_OPTIONS = [
    4.0,
    3.0,
    2.0,
    1.0,
  ];

  const [formData, setFormData] = useState({
    course_code: '',
    title: '',
    description: '',
    credit_hours: 3,
    department: '',
    course_level: '100',
    is_active: true,
    prerequisites: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseData, departmentsData, coursesData] = await Promise.all([
          getCourse(id),
          getDepartments(),
          getCourses()
        ]);
  
        // Format the prerequisites data correctly
        const prerequisites = courseData.prerequisites?.map(prereq => ({
          course_id: prereq.required_course,  // Changed from required_course_id
          minimum_grade: prereq.minimum_grade
        })) || [];
  
        setFormData({
          course_code: courseData.course_code,
          title: courseData.title,
          description: courseData.description || '',
          credit_hours: courseData.credit_hours,
          department: courseData.department?.id || '',
          course_level: courseData.course_level,
          is_active: courseData.is_active,
          prerequisites: prerequisites
        });
        
        const courses = Array.isArray(coursesData) ? coursesData : coursesData.results || [];
        setDepartments(Array.isArray(departmentsData) ? departmentsData : departmentsData.results || []);
        setAvailableCourses(courses.filter(course => course.id !== parseInt(id)));
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to load course data');
        setError('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePrerequisiteChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.map((prereq, i) => 
        i === index 
          ? { 
              ...prereq, 
              [field]: field === 'course_id' 
                ? (value ? parseInt(value) : '') 
                : value
            }
          : prereq
      )
    }));
  };
  
  const addPrerequisite = () => {
    setFormData(prev => ({
      ...prev,
      prerequisites: [...prev.prerequisites, { course_id: '', minimum_grade: 4 }]
    }));
  };

  const removePrerequisite = (index) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!/^[A-Z]{2,4}\d{3}$/.test(formData.course_code)) {
      toast.error('Course code must be 2-4 letters followed by 3 numbers');
      return false;
    }
    if (formData.credit_hours < 1 || formData.credit_hours > 6) {
      toast.error('Credit hours must be between 1 and 6');
      return false;
    }
    if (!formData.department) {
      toast.error('Please select a department');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setLoading(true);
    setError(null);
  
    try {
      const updatedData = {
        course_code: formData.course_code,
        title: formData.title,
        description: formData.description,
        credit_hours: parseInt(formData.credit_hours),
        department: parseInt(formData.department),
        course_level: formData.course_level,
        is_active: formData.is_active,
        prerequisites: formData.prerequisites
          .filter(prereq => prereq.course_id)
          .map(prereq => ({
            course_id: parseInt(prereq.course_id),
            minimum_grade: parseFloat(prereq.minimum_grade)
          }))
      };
  
      await updateCourse(id, updatedData);
      toast.success('Course updated successfully');
      navigate('/admin/courses');
    } catch (err) {
      console.error('Update error:', err);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.error || 
                          'Failed to update course';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (userRole !== 'admin') {
    return <Navigate to="/unauthorized" />;
  }

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Course</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Back
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Code</label>
            <input
              type="text"
              name="course_code"
              value={formData.course_code}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Credit Hours</label>
            <input
              type="number"
              name="credit_hours"
              value={formData.credit_hours}
              onChange={handleChange}
              min="1"
              max="6"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Course Level</label>
            <select
              name="course_level"
              value={formData.course_level}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              {['100', '200', '300', '400'].map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Active</label>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
<div className="mb-6">
  <label className="block text-sm font-medium text-gray-700 mb-2">Prerequisites</label>
  <div className="space-y-2">
    {formData.prerequisites.map((prereq, index) => (
      <div key={index} className="flex items-center gap-2">
        <select
          value={prereq.course_id || ''}
          onChange={(e) => handlePrerequisiteChange(index, 'course_id', e.target.value)}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select Course</option>
          {availableCourses
            .filter(course => {
              // Filter out current course and already selected prerequisites
              const isCurrentCourse = course.id === parseInt(id);
              const isAlreadySelected = formData.prerequisites.some(
                (p, i) => i !== index && parseInt(p.course_id) === course.id
              );
              return !isCurrentCourse && !isAlreadySelected;
            })
            .map(course => (
              <option key={course.id} value={course.id}>
                {course.course_code} - {course.title}
              </option>
            ))}
        </select>
        <select
  value={prereq.minimum_grade ?? 1}
  onChange={(e) =>
    handlePrerequisiteChange(index, 'minimum_grade', parseFloat(e.target.value))
  }
  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
>
  {GRADE_OPTIONS.map(grade => (
    <option key={grade} value={grade}>{grade}</option>
  ))}
</select>
        <button
          type="button"
          onClick={() => removePrerequisite(index)}
          className="p-2 text-red-600 hover:text-red-800"
        >
          Remove
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={addPrerequisite}
      className="text-blue-600 hover:text-blue-800 text-sm"
    >
      + Add Prerequisite
    </button>
  </div>
</div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/courses')}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseEditForm;