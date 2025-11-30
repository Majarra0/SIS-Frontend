import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses } from '../../api/academic';
import { createEnrollment } from '../../api/enrollment';
import useAuth from '../../hooks/useAuth';

const EnrollmentForm = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadAvailableCourses = async () => {
      try {
        const data = await getCourses({ enrollment_open: true });
        setCourses(data.results || data);
      } catch (err) {
        setError('Failed to load available courses');
      } finally {
        setLoading(false);
      }
    };

    loadAvailableCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCourses.length === 0) {
      setError('Please select at least one course');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await Promise.all(
        selectedCourses.map(courseId =>
          createEnrollment({
            student: user.id,
            course: courseId,
            semester: new Date().getFullYear() // You might want to make this configurable
          })
        )
      );
      navigate('/student/enrollments');
    } catch (err) {
      setError('Failed to enroll in courses. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCourseToggle = (courseId) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Course Enrollment</h1>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4">
          {courses.map(course => (
            <div 
              key={course.id}
              className="p-4 border rounded hover:bg-gray-50"
            >
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course.id)}
                  onChange={() => handleCourseToggle(course.id)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium">{course.code} - {course.title}</div>
                  <div className="text-sm text-gray-500">
                    Credits: {course.credits} | Department: {course.department.name}
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || selectedCourses.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Enrolling...' : 'Enroll in Selected Courses'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnrollmentForm;