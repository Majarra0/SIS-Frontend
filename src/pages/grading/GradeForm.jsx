import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Mock data
const mockCourses = [
  { id: 1, code: 'CS301', title: 'Data Structures' },
  { id: 2, code: 'CS302', title: 'Algorithms' },
  { id: 3, code: 'CS401', title: 'Database Systems' }
];

const mockComponents = [
  { id: 1, name: 'Midterm Exam', weight: 30 },
  { id: 2, name: 'Final Exam', weight: 40 },
  { id: 3, name: 'Assignments', weight: 20 },
  { id: 4, name: 'Participation', weight: 10 }
];

const mockStudents = [
  { id: 1, studentId: '2023001', firstName: 'John', lastName: 'Doe', currentGrade: '85' },
  { id: 2, studentId: '2023002', firstName: 'Jane', lastName: 'Smith', currentGrade: '92' },
  { id: 3, studentId: '2023003', firstName: 'Mike', lastName: 'Johnson', currentGrade: '78' },
  { id: 4, studentId: '2023004', firstName: 'Sarah', lastName: 'Williams', currentGrade: '95' },
];

const GradeForm = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('');
  const [grades, setGrades] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bulkGrade, setBulkGrade] = useState('');
  const [filteredStudents, setFilteredStudents] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Initialize all grades with empty values
  useEffect(() => {
    const initialGrades = {};
    mockStudents.forEach(student => {
      initialGrades[student.id] = '';
    });
    setGrades(initialGrades);
  }, []);
  
  // Filter students based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredStudents(mockStudents);
      return;
    }
    
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = mockStudents.filter(student => 
      student.firstName.toLowerCase().includes(lowerSearch) || 
      student.lastName.toLowerCase().includes(lowerSearch) || 
      student.studentId.includes(searchTerm)
    );
    
    setFilteredStudents(filtered);
  }, [searchTerm]);

  const handleGradeChange = (studentId, value) => {
    const numValue = value === '' ? '' : Math.min(100, Math.max(0, Number(value)));
    setGrades(prev => ({
      ...prev,
      [studentId]: numValue
    }));
  };

  const applyBulkGrade = () => {
    const numValue = bulkGrade === '' ? '' : Math.min(100, Math.max(0, Number(bulkGrade)));
    const newGrades = { ...grades };
    
    filteredStudents.forEach(student => {
      newGrades[student.id] = numValue;
    });
    
    setGrades(newGrades);
    toast.info('Bulk grade applied to all visible students');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Grades submitted successfully');
    setShowConfirmation(false);
    setSubmitting(false);
    
    // Reset form
    setSelectedCourse('');
    setSelectedComponent('');
    setBulkGrade('');
    setSearchTerm('');
    
    const resetGrades = {};
    mockStudents.forEach(student => {
      resetGrades[student.id] = '';
    });
    setGrades(resetGrades);
  };

  const cancelSubmit = () => {
    setShowConfirmation(false);
  };
  
  const getCourseById = (id) => mockCourses.find(c => c.id === Number(id))?.title || '';
  const getComponentById = (id) => mockComponents.find(c => c.id === Number(id))?.name || '';
  
  const getGradeColor = (grade) => {
    if (grade >= 90) return 'bg-green-100 text-green-800';
    if (grade >= 80) return 'bg-blue-100 text-blue-800';
    if (grade >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-100 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Grade Submission</h1>
            <p className="text-gray-600">Enter and submit student grades efficiently</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Course
              </label>
              <div className="relative">
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
                  required
                >
                  <option value="">-- Select Course --</option>
                  {mockCourses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.title}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Grade Component
              </label>
              <div className="relative">
                <select
                  value={selectedComponent}
                  onChange={(e) => setSelectedComponent(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
                  required
                >
                  <option value="">-- Select Component --</option>
                  {mockComponents.map(component => (
                    <option key={component.id} value={component.id}>
                      {component.name} ({component.weight}%)
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {selectedCourse && selectedComponent && (
            <div className="mt-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-blue-700 font-medium">
                      Entering grades for: {getCourseById(selectedCourse)} - {getComponentById(selectedComponent)}
                    </p>
                    <p className="text-blue-600 text-sm mt-1">
                      All grades must be between 0-100. Click Submit when finished.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search by ID or name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Apply grade to all"
                      value={bulkGrade}
                      onChange={(e) => setBulkGrade(e.target.value)}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={applyBulkGrade}
                    disabled={bulkGrade === ''}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Current Grade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          New Grade
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                          <tr key={student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {student.studentId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {student.firstName} {student.lastName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getGradeColor(student.currentGrade)}`}>
                                {student.currentGrade}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={grades[student.id]}
                                onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-center"
                                required
                              />
                              {grades[student.id] && (
                                <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getGradeColor(grades[student.id])}`}>
                                  {grades[student.id]}%
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                            No students found matching your search criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-2 text-right text-sm text-gray-500">
                Showing {filteredStudents.length} of {mockStudents.length} students
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => {
                setSelectedCourse('');
                setSelectedComponent('');
                setBulkGrade('');
                setSearchTerm('');
                const resetGrades = {};
                mockStudents.forEach(student => {
                  resetGrades[student.id] = '';
                });
                setGrades(resetGrades);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedCourse || !selectedComponent || Object.values(grades).some(g => g === '')}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Grades'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Confirm Grade Submission</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  You are about to submit grades for {getCourseById(selectedCourse)} - {getComponentById(selectedComponent)}.
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                type="button"
                onClick={cancelSubmit}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSubmit}
                disabled={submitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Processing...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeForm;