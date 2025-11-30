import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourseOfferings } from '../../api/enrollment';
import { getEnrolledStudents } from '../../api/enrollment';
import { bulkCreateAttendance } from '../../api/attendance';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';

const AttendanceForm = () => {
  const [courseOfferings, setCourseOfferings] = useState([]);
  const [selectedOffering, setSelectedOffering] = useState('');
  const [date, setDate] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Load faculty's course offerings
  useEffect(() => {
    const loadCourseOfferings = async () => {
      try {
        const data = await getCourseOfferings({ faculty_id: user.id });
        setCourseOfferings(data.results || data);
      } catch (err) {
        setError('Failed to load courses');
        toast.error('Failed to load courses');
      }
    };
    
    loadCourseOfferings();
  }, [user.id]);
  
  // Load enrolled students when course offering is selected
  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedOffering) return;
      
      try {
        const data = await getEnrolledStudents(selectedOffering);
        setStudents(data.map(student => ({
          ...student,
          is_present: false
        })));
      } catch (err) {
        setError('Failed to load students');
        toast.error('Failed to load students');
      }
    };
    
    loadStudents();
  }, [selectedOffering]);
  
  const handleStudentAttendance = (studentId, isPresent) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, is_present: isPresent } : student
    ));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await bulkCreateAttendance({
        course_offering_id: selectedOffering,
        date,
        attendance_records: students.map(student => ({
          student_id: student.id,
          status: student.is_present ? 'present' : 'absent'
        }))
      });
      toast.success('Attendance saved successfully');
      navigate('/faculty/attendance');
    } catch (err) {
      setError('Failed to save attendance');
      toast.error('Failed to save attendance');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Take Attendance</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Course
          </label>
          <select
            value={selectedOffering}
            onChange={(e) => setSelectedOffering(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a course</option>
            {courseOfferings.map(offering => (
              <option key={offering.id} value={offering.id}>
                {offering.course.code} - {offering.course.title}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {students.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Students</h3>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {students.map(student => (
                  <li key={student.id} className="px-4 py-4 flex items-center justify-between">
                    <div>
                      {student.personal_info.first_name} {student.personal_info.last_name}
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={student.is_present}
                          onChange={(e) => handleStudentAttendance(student.id, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">Present</span>
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading || !selectedOffering || !date || students.length === 0}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Attendance'}
        </button>
      </form>
    </div>
  );
};

export default AttendanceForm;