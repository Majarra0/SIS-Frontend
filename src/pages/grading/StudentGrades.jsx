import React, { useState, useMemo } from 'react';
import { FaGraduationCap, FaChartBar, FaDownload, FaBook } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Mock data for the logged-in student
const mockStudentGrades = [
  {
    id: 1,
    course: {
      code: 'CS301',
      title: 'Data Structures',
      semester: 'Spring 2025',
      credits: 3
    },
    grades: [
      {
        component: 'Midterm Exam',
        grade: 85,
        weight: 30,
        max_grade: 100,
        feedback: 'Good understanding of basic concepts',
        date_graded: '2025-03-15'
      },
      {
        component: 'Final Project',
        grade: 92,
        weight: 40,
        max_grade: 100,
        feedback: 'Excellent project implementation',
        date_graded: '2025-04-20'
      },
      {
        component: 'Assignments',
        grade: 88,
        weight: 30,
        max_grade: 100,
        feedback: 'Consistent performance throughout',
        date_graded: '2025-05-01'
      }
    ],
    instructor: 'Dr. Ali',
    finalGrade: 88.7
  },
  {
    id: 2,
    course: {
      code: 'CS302',
      title: 'Algorithms',
      semester: 'Spring 2025',
      credits: 3
    },
    grades: [
      {
        component: 'Midterm',
        grade: 78,
        weight: 30,
        max_grade: 100,
        feedback: 'Need to improve on time complexity analysis',
        date_graded: '2025-03-20'
      },
      {
        component: 'Final Exam',
        grade: 85,
        weight: 40,
        max_grade: 100,
        feedback: 'Good improvement in problem-solving',
        date_graded: '2025-05-10'
      },
      {
        component: 'Quizzes',
        grade: 90,
        weight: 30,
        max_grade: 100,
        feedback: 'Excellent quiz performance',
        date_graded: '2025-04-25'
      }
    ],
    instructor: 'Dr. Mohammed',
    finalGrade: 84.3
  }
];

const StudentGrades = () => {
  const [selectedSemester, setSelectedSemester] = useState('Spring 2025');
  const [showStats, setShowStats] = useState(false);

  // Calculate overall statistics
  const stats = useMemo(() => {
    const courseGrades = mockStudentGrades.map(c => c.finalGrade);
    return {
      gpa: (courseGrades.reduce((a, b) => a + b, 0) / courseGrades.length / 20).toFixed(2),
      highest: Math.max(...courseGrades).toFixed(1),
      lowest: Math.min(...courseGrades).toFixed(1),
      average: (courseGrades.reduce((a, b) => a + b, 0) / courseGrades.length).toFixed(1)
    };
  }, []);

  const handleDownloadTranscript = () => {
    toast.info('Downloading transcript...');
    // Implement download logic here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <FaGraduationCap className="text-blue-600 text-3xl mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Grades</h1>
              <p className="text-sm text-gray-500">
                View your academic performance and progress
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg
                       hover:bg-blue-700"
            >
              <FaChartBar className="mr-2" />
              {showStats ? 'Hide' : 'Show'} Statistics
            </button>
            <button
              onClick={handleDownloadTranscript}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg
                       hover:bg-green-700"
            >
              <FaDownload className="mr-2" />
              Download Transcript
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {showStats && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-blue-600">Current GPA</div>
              <div className="text-2xl font-bold text-blue-900">{stats.gpa}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-green-600">Highest Grade</div>
              <div className="text-2xl font-bold text-green-900">{stats.highest}%</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-yellow-600">Average Grade</div>
              <div className="text-2xl font-bold text-yellow-900">{stats.average}%</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-purple-600">Total Credits</div>
              <div className="text-2xl font-bold text-purple-900">
                {mockStudentGrades.reduce((sum, course) => sum + course.course.credits, 0)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Cards */}
      <div className="space-y-6">
        {mockStudentGrades.map(course => (
          <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Course Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <FaBook className="text-blue-600 text-2xl mr-4" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{course.course.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">{course.course.code}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {course.course.credits} Credits
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                        {course.course.semester}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Final Grade</div>
                  <div className={`text-2xl font-bold ${
                    course.finalGrade >= 90 ? 'text-green-600' :
                    course.finalGrade >= 80 ? 'text-blue-600' :
                    course.finalGrade >= 70 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {course.finalGrade}%
                  </div>
                </div>
              </div>
            </div>

            {/* Grade Components */}
            <div className="px-6 py-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                      Component
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                      Grade
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                      Weight
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                      Feedback
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {course.grades.map((grade, index) => (
                    <tr key={index}>
                      <td className="py-3">
                        <span className="text-sm font-medium text-gray-900">
                          {grade.component}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${grade.grade >= 90 ? 'bg-green-100 text-green-800' :
                          grade.grade >= 80 ? 'bg-blue-100 text-blue-800' :
                          grade.grade >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                          {grade.grade}%
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-sm text-gray-500">
                          {grade.weight}%
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-gray-500">
                          {grade.feedback}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Course Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Instructor: {course.instructor}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentGrades;