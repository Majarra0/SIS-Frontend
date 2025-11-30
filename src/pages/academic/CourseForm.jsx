import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse } from '../../api/academic';
import { getDepartments } from '../../api/departments';
import { getCourses } from '../../api/academic';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';

const CourseForm = () => {
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

  const [departments, setDepartments] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { userRole } = useAuth();

  // Add validation state
  const [validation, setValidation] = useState({
    course_code: '',
    credit_hours: '',
    department: ''
  });

  const validateForm = () => {
    const newValidation = {};
    
    // Course code validation (e.g., CS101 format)
    if (!/^[A-Z]{2,4}\d{3}$/.test(formData.course_code)) {
      newValidation.course_code = 'Course code must be 2-4 letters followed by 3 numbers';
    }

    // Credit hours validation (1-6)
    if (formData.credit_hours < 1 || formData.credit_hours > 6) {
      newValidation.credit_hours = 'Credit hours must be between 1 and 6';
    }

    // Department validation
    if (!formData.department) {
      newValidation.department = 'Please select a department';
    }

    setValidation(newValidation);
    return Object.keys(newValidation).length === 0;
  };

  // Fetch departments and available courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptData, coursesData] = await Promise.all([
          getDepartments(),
          getCourses()
        ]);
        setDepartments(deptData.results || deptData);
        setAvailableCourses(coursesData.results || coursesData);
      } catch (err) {
        setError('Failed to load form data');
        toast.error('Failed to load form data');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }
  
    setLoading(true);
    setError(null);
  

    // Example of prerequisite format
    // "prerequisites": [{
      //"required_course": 2,
    //  "minimum_grade": 2.0
  //}]

    try {
      const courseData = {
        ...formData,
        course_level: parseInt(formData.course_level),
        // Transform prerequisites into an array of course IDs
        prerequisite_courses: formData.prerequisites
          .filter(prereq => prereq.course_id)
          .map(prereq => parseInt(prereq.course_id))
      };
  
      const result = await createCourse(courseData);
      toast.success('Course created successfully');
      navigate('/admin/courses');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to create course';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Add grade options constant
  const GRADE_OPTIONS = [1.0, 2.0, 3.0, 4.0];

  // Update prerequisite section in the form
  const renderPrerequisiteFields = () => (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Prerequisites
      </label>
      <div className="space-y-2">
        {formData.prerequisites.map((prereq, index) => (
          <div key={index} className="flex items-center gap-2">
            <select
              value={prereq.course_id}
              onChange={(e) => handlePrerequisiteChange(index, 'course_id', e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Course</option>
              {availableCourses
                .filter(course => course.id !== formData.id)
                .map(course => (
                  <option key={course.id} value={course.id}>
                    {course.course_code} - {course.title}
                  </option>
                ))}
            </select>
            <select
              value={prereq.minimum_grade}
              onChange={(e) => handlePrerequisiteChange(index, 'minimum_grade', e.target.value)}
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
          onClick={() => addPrerequisite()}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          + Add Prerequisite
        </button>
      </div>
    </div>
  );

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Convert specific fields to numbers
    let processedValue = value;
    if (name === 'department' || name === 'credit_hours') {
      processedValue = value === '' ? '' : parseInt(value, 10);
    } else if (type === 'checkbox') {
      processedValue = e.target.checked;
    }
  
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handlePrerequisiteChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.map((prereq, i) => 
        i === index 
          ? { ...prereq, [field]: field === 'course_id' ? parseInt(value) : value }
          : prereq
      )
    }));
  };
  
  const addPrerequisite = () => {
    setFormData(prev => ({
      ...prev,
      prerequisites: [
        ...prev.prerequisites,
        { prerequisite_course: '', minimum_grade: 1 }
      ]
    }));
  };
  
  // Update remove prerequisite function to use index
  const removePrerequisite = (index) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }));
  };

  if (userRole !== 'admin') {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Course</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
    <label className="block text-sm font-medium text-gray-700">Course Code</label>
    <input
      type="text"
      name="course_code"
      required
      value={formData.course_code}
      onChange={handleChange}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      placeholder="e.g., CS101"
    />
  </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
    <label className="block text-sm font-medium text-gray-700">Credit Hours</label>
    <input
      type="number"
      name="credit_hours"
      required
      min="1"
      max="6"
      value={formData.credit_hours}
      onChange={handleChange}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    />
  </div>

  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700">Course Level</label>
    <select
      name="course_level"
      required
      value={formData.course_level}
      onChange={handleChange}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    >
      <option value="100">100 Level</option>
      <option value="200">200 Level</option>
      <option value="300">300 Level</option>
      <option value="400">400 Level</option>
      <option value="500">500 Level</option>
    </select>
  </div>

  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700">Department</label>
    <select
      name="department"
      required
      value={formData.department}
      onChange={handleChange}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    >
      <option value="">Select Department</option>
      {departments.map(dept => (
        <option key={dept.id} value={dept.id}>
          {dept.name}
        </option>
      ))}
    </select>
  </div>

  <div className="md:col-span-2">
    <div className="flex items-center">
      <input
        type="checkbox"
        name="is_active"
        checked={formData.is_active}
        onChange={(e) => handleChange({
          target: { name: 'is_active', value: e.target.checked }
        })}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label className="ml-2 block text-sm text-gray-900">Active</label>
    </div>
  </div>

<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Prerequisites
  </label>
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
              const isCurrentCourse = course.id === formData.id;
              const isAlreadySelected = formData.prerequisites.some(
                (p, i) => i !== index && p.course_id === course.id
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
          <span className="sr-only">Remove</span>
          ×
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
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;