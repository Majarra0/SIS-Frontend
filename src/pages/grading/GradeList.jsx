import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaFilter, FaDownload, FaEye, FaEyeSlash, 
         FaChartBar, FaBell, FaHistory, FaPlus, FaChartLine } from 'react-icons/fa';
import DataTable from '../../components/tables/DataTable';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';

// More realistic mock data with better distribution of grades
const mockGrades = [
  {
    id: 1,
    course: { code: 'CS301', title: 'Data Structures', semester: 'Spring 2025' },
    student: { first_name: 'Ahmed', last_name: 'Ali', id: '2023001' },
    component: 'Midterm',
    grade: 85,
    max_grade: 100,
    weight: 30,
    submitted_date: '2025-05-01',
    status: 'published',
    component_visibility: true,
    feedback: 'Good understanding of basic concepts, but missed optimization in problem 3.',
    graded_by: 'Dr. Smith',
    last_modified: '2025-05-01T14:30:00Z'
  },
  {
    id: 2,
    course: { code: 'CS301', title: 'Data Structures', semester: 'Spring 2025' },
    student: { first_name: 'Layla', last_name: 'Hassan', id: '2023014' },
    component: 'Midterm',
    grade: 92,
    max_grade: 100,
    weight: 30,
    submitted_date: '2025-05-01',
    status: 'published',
    component_visibility: true,
    feedback: 'Excellent work. Creative solution on problem 4.',
    graded_by: 'Dr. Smith',
    last_modified: '2025-05-01T15:10:00Z'
  },
  {
    id: 3,
    course: { code: 'CS301', title: 'Data Structures', semester: 'Spring 2025' },
    student: { first_name: 'Omar', last_name: 'Zaid', id: '2023008' },
    component: 'Midterm',
    grade: 78,
    max_grade: 100,
    weight: 30,
    submitted_date: '2025-05-01',
    status: 'published',
    component_visibility: true,
    feedback: 'Good effort, but need to work on time complexity analysis.',
    graded_by: 'Dr. Smith',
    last_modified: '2025-05-01T14:45:00Z'
  },
  {
    id: 4,
    course: { code: 'CS301', title: 'Data Structures', semester: 'Spring 2025' },
    student: { first_name: 'Fatima', last_name: 'Yousef', id: '2023022' },
    component: 'Assignment',
    grade: 88,
    max_grade: 100,
    weight: 15,
    submitted_date: '2025-04-15',
    status: 'published',
    component_visibility: true,
    feedback: 'Well-structured code. Comments could be more descriptive.',
    graded_by: 'Dr. Smith',
    last_modified: '2025-04-18T09:20:00Z'
  },
  {
    id: 5,
    course: { code: 'CS302', title: 'Algorithms', semester: 'Spring 2025' },
    student: { first_name: 'Amna', last_name: 'Nasser', id: '2023CS02' },
    component: 'Project',
    grade: 94,
    max_grade: 100,
    weight: 40,
    submitted_date: '2025-05-20',
    status: 'published',
    component_visibility: false,
    feedback: 'Outstanding work. Your implementation was elegant and efficient.',
    graded_by: 'Dr. Johnson',
    last_modified: '2025-05-22T16:20:00Z'
  },
  {
    id: 6,
    course: { code: 'CS302', title: 'Algorithms', semester: 'Spring 2025' },
    student: { first_name: 'Youssef', last_name: 'Ali', id: '2023CS05' },
    component: 'Project',
    grade: 82,
    max_grade: 100,
    weight: 40,
    submitted_date: '2025-05-20',
    status: 'published',
    component_visibility: false,
    feedback: 'Good attempt. Your analysis was thorough but implementation had some inefficiencies.',
    graded_by: 'Dr. Johnson',
    last_modified: '2025-05-22T16:45:00Z'
  },
  {
    id: 7,
    course: { code: 'MATH201', title: 'Linear Algebra', semester: 'Spring 2025' },
    student: { first_name: 'Karim', last_name: 'Sami', id: '2023011' },
    component: 'Quiz 3',
    grade: 75,
    max_grade: 100,
    weight: 10,
    submitted_date: '2025-04-10',
    status: 'published',
    component_visibility: true,
    feedback: 'Need to improve on eigenvalue calculations.',
    graded_by: 'Prof. Williams',
    last_modified: '2025-04-11T10:30:00Z'
  },
  {
    id: 8,
    course: { code: 'PHYS101', title: 'Introduction to Physics', semester: 'Spring 2025' },
    student: { first_name: 'Mariam', last_name: 'Othman', id: '2023027' },
    component: 'Lab Report',
    grade: 89,
    max_grade: 100,
    weight: 15,
    submitted_date: '2025-03-28',
    status: 'draft',
    component_visibility: false,
    feedback: 'Excellent data analysis. Discussion section could be more detailed.',
    graded_by: 'Dr. Martinez',
    last_modified: '2025-03-30T11:15:00Z'
  }
];


// Component mapping to organize courses and components
const courseComponentMap = {
  'CS301': {
    title: 'Data Structures',
    components: ['Midterm Exam', 'Final Exam', 'Assignment 1', 'Assignment 2', 'Quiz 1', 'Quiz 2']
  },
  'CS302': {
    title: 'Algorithms',
    components: ['Midterm Exam', 'Final Exam', 'Final Project', 'Weekly Problem Sets']
  },
  'MATH201': {
    title: 'Linear Algebra',
    components: ['Midterm Exam', 'Final Exam', 'Quiz 1', 'Quiz 2', 'Quiz 3']
  },
  'PHYS101': {
    title: 'Introduction to Physics',
    components: ['Midterm Exam', 'Final Exam', 'Lab Report 1', 'Lab Report 2', 'Lab Report 3']
  }
};

const GradeList = () => {
  const [grades, setGrades] = useState(mockGrades);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    course: '',
    component: '',
    status: '',
    visibility: 'all'
  });
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [curveModal, setCurveModal] = useState({ isOpen: false, type: '', value: 0 });
  
  const { userRole, user } = useAuth();
  const navigate = useNavigate();

  // Calculate statistics for selected course/component
  const stats = useMemo(() => {
    const filteredGrades = grades.filter(g => 
      (!filters.course || g.course.code === filters.course) &&
      (!filters.component || g.component === filters.component)
    );

    if (!filteredGrades.length) return { average: 0, highest: 0, lowest: 0, distribution: {} };

    return {
      average: filteredGrades.reduce((acc, g) => acc + g.grade, 0) / filteredGrades.length,
      highest: Math.max(...filteredGrades.map(g => g.grade)),
      lowest: Math.min(...filteredGrades.map(g => g.grade)),
      distribution: {
        'A': filteredGrades.filter(g => g.grade >= 90).length,
        'B': filteredGrades.filter(g => g.grade >= 80 && g.grade < 90).length,
        'C': filteredGrades.filter(g => g.grade >= 70 && g.grade < 80).length,
        'D': filteredGrades.filter(g => g.grade >= 60 && g.grade < 70).length,
        'F': filteredGrades.filter(g => g.grade < 60).length
      }
    };
  }, [grades, filters]);

  // Get unique courses for filtering
  const courses = useMemo(() => {
    const uniqueCourses = [...new Set(grades.map(g => g.course.code))];
    return uniqueCourses.map(code => ({
      code,
      title: grades.find(g => g.course.code === code)?.course.title || ''
    }));
  }, [grades]);

  // Get unique components for filtering
  const components = useMemo(() => {
    if (!filters.course) {
      return [...new Set(grades.map(g => g.component))];
    }
    return courseComponentMap[filters.course]?.components || [];
  }, [filters.course, grades]);

  // Toggle visibility for all grades with matching course and component
  const handleVisibilityToggle = (course, component) => {
    const affectedGrades = grades.filter(g => 
      g.course.code === course && g.component === component
    );
    
    // Get current visibility state
    const currentVisibility = affectedGrades[0]?.component_visibility;
    
    // Toggle visibility for all matching grades
    setGrades(prev => prev.map(grade => 
      (grade.course.code === course && grade.component === component)
        ? { ...grade, component_visibility: !currentVisibility }
        : grade
    ));
    
    toast.success(`Visibility ${currentVisibility ? 'hidden' : 'shown'} for ${component} in ${course}`);
  };

  const handleBulkAction = async (action) => {
    if (!selectedGrades.length) {
      toast.warning('Please select grades first');
      return;
    }

    setLoading(true);
    try {
      switch (action) {
        case 'publish':
          setGrades(prev => prev.map(grade => 
            selectedGrades.includes(grade.id) 
              ? { ...grade, status: 'published' }
              : grade
          ));
          toast.success('Grades published successfully');
          break;
        case 'notify':
          // Simulate notification sending
          await new Promise(resolve => setTimeout(resolve, 1000));
          toast.success('Notifications sent to students');
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setLoading(false);
      setSelectedGrades([]);
    }
  };

  const applyCurve = (grades, type, value) => {
    switch (type) {
      case 'flat':
        return grades.map(grade => ({
          ...grade,
          grade: Math.min(100, grade.grade + value)
        }));
      case 'percentage':
        return grades.map(grade => ({
          ...grade,
          grade: Math.min(100, grade.grade * (1 + value / 100))
        }));
      case 'highest':
        const highest = Math.max(...grades.map(g => g.grade));
        const boost = value - highest;
        return grades.map(grade => ({
          ...grade,
          grade: Math.min(100, grade.grade + boost)
        }));
      default:
        return grades;
    }
  };

  const handleApplyCurve = () => {
    const { type, value } = curveModal;
    if (!type || !value) {
      toast.error('Please select a curve type and value');
      return;
    }

    // Only apply curve to grades matching the current filter
    setGrades(prev => {
      const gradesToCurve = prev.filter(g => 
        (!filters.course || g.course.code === filters.course) &&
        (!filters.component || g.component === filters.component)
      );
      
      const otherGrades = prev.filter(g => 
        (filters.course && g.course.code !== filters.course) ||
        (filters.component && g.component !== filters.component)
      );
      
      const curvedGrades = applyCurve(gradesToCurve, type, Number(value));
      
      toast.success(`Curve applied to ${curvedGrades.length} grades: ${type} ${value}${type === 'percentage' ? '%' : ' points'}`);
      
      return [...otherGrades, ...curvedGrades];
    });
    
    setCurveModal({ isOpen: false, type: '', value: 0 });
  };

  const CurveModal = ({ isOpen, onClose }) => isOpen && (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Apply Grade Curve</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Curve Type
            </label>
            <select
              value={curveModal.type}
              onChange={(e) => setCurveModal(prev => ({ ...prev, type: e.target.value }))}
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Curve Type</option>
              <option value="flat">Flat Points</option>
              <option value="percentage">Percentage Boost</option>
              <option value="highest">Set Highest Grade</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {curveModal.type === 'percentage' ? 'Percentage Boost' : 'Points'}
            </label>
            <input
              type="number"
              value={curveModal.value}
              onChange={(e) => setCurveModal(prev => ({ ...prev, value: e.target.value }))}
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder={curveModal.type === 'percentage' ? 'Enter percentage' : 'Enter points'}
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyCurve}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Curve
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Group grades by course and component for visibility toggle
  const groupedComponents = useMemo(() => {
    const result = {};
    
    grades.forEach(grade => {
      const key = `${grade.course.code}-${grade.component}`;
      if (!result[key]) {
        result[key] = {
          course: grade.course,
          component: grade.component,
          isVisible: grade.component_visibility,
          count: 1
        };
      } else {
        result[key].count++;
      }
    });
    
    return Object.values(result);
  }, [grades]);

  const columns = [
    {
      field: 'select',
      header: '',
      width: '40px',
      render: (_, row) => userRole === 'faculty' && (
        <input
          type="checkbox"
          checked={selectedGrades.includes(row.id)}
          onChange={(e) => {
            setSelectedGrades(prev => 
              e.target.checked
                ? [...prev, row.id]
                : prev.filter(id => id !== row.id)
            );
          }}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      )
    },
    {
      field: 'course',
      header: 'Course',
      render: (course) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{course.title}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{course.code}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {course.semester}
            </span>
          </div>
        </div>
      )
    },
    {
      field: 'student',
      header: 'Student',
      hidden: userRole === 'student',
      render: (student) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">
            {student.first_name} {student.last_name}
          </span>
          <span className="text-sm text-gray-500">ID: {student.id}</span>
        </div>
      )
    },
    {
      field: 'component',
      header: 'Component',
      render: (component) => (
        <span className="px-4 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
          {component}
        </span>
      )
    },
    {
      field: 'grade',
      header: 'Grade',
      render: (grade, row) => (
        <div className="space-y-1">
          <span className={`font-semibold ${
            grade >= 90 ? 'text-green-600' :
            grade >= 80 ? 'text-blue-600' :
            grade >= 70 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {grade}%
          </span>
          <div className="text-xs text-gray-500">
            Weight: {row.weight}% | Max: {row.max_grade}
          </div>
        </div>
      )
    },
    {
      field: 'feedback',
      header: 'Feedback',
      render: (feedback) => (
        <div className="max-w-xs truncate" title={feedback}>
          {feedback}
        </div>
      )
    },
    {
      field: 'last_modified',
      header: 'Last Modified',
      render: (date) => (
        <div className="text-sm text-gray-600">
          {new Date(date).toLocaleString()}
        </div>
      )
    }
  ].filter(col => !col.hidden);

  const actions = userRole === 'faculty' ? [
    {
      label: 'Edit',
      onClick: (grade) => navigate(`/faculty/grades/${grade.id}/edit`),
      className: 'bg-yellow-500 text-white hover:bg-yellow-600'
    },
    {
      label: 'Delete',
      onClick: (grade) => {
        if (window.confirm('Are you sure you want to delete this grade?')) {
          // Handle delete
        }
      },
      className: 'bg-red-500 text-white hover:bg-red-600'
    }
  ] : [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <FaGraduationCap className="text-blue-600 text-3xl mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Grade Management</h1>
              <p className="text-sm text-gray-500">
                {userRole === 'faculty' ? 'Manage and publish student grades' : 'View your course grades'}
              </p>
            </div>
          </div>
          
          {userRole === 'faculty' && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate('/faculty/grades/new')}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg
                          hover:bg-green-700"
              >
                <FaPlus className="mr-2" />
                Add Grades
              </button>
              <button
                disabled={!selectedGrades.length}
                onClick={() => handleBulkAction('publish')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg
                          hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaEye className="mr-2" />
                Publish Selected
              </button>
              <button
                onClick={() => setShowStats(!showStats)}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg
                          hover:bg-purple-700"
              >
                <FaChartBar className="mr-2" />
                {showStats ? 'Hide' : 'Show'} Statistics
              </button>
              <button
                onClick={() => setCurveModal({ isOpen: true, type: '', value: 0 })}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg
                          hover:bg-indigo-700"
              >
                <FaChartLine className="mr-2" />
                Apply Curve
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Section */}
      {showStats && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Class Average</div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.average ? stats.average.toFixed(1) : 'N/A'}%
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Highest Grade</div>
              <div className="text-2xl font-bold text-green-600">
                {stats.highest || 'N/A'}%
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Lowest Grade</div>
              <div className="text-2xl font-bold text-red-600">
                {stats.lowest || 'N/A'}%
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Distribution</div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(stats.distribution).map(([grade, count]) => (
                  <div key={grade} className="flex justify-between text-sm">
                    <span className="font-medium">{grade}:</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <select
              value={filters.course}
              onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value, component: '' }))}
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course.code} value={course.code}>
                  {course.code} - {course.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Component
            </label>
            <select
              value={filters.component}
              onChange={(e) => setFilters(prev => ({ ...prev, component: e.target.value }))}
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Components</option>
              {components.map(component => (
                <option key={component} value={component}>
                  {component}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visibility
            </label>
            <select
              value={filters.visibility}
              onChange={(e) => setFilters(prev => ({ ...prev, visibility: e.target.value }))}
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Grades</option>
              <option value="visible">Visible Only</option>
              <option value="hidden">Hidden Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Component Visibility Controls (for faculty) */}
      {userRole === 'faculty' && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Component Visibility</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedComponents.map(group => (
              <div key={`${group.course.code}-${group.component}`} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-medium">{group.course.code}</span>
                    <span className="mx-2">•</span>
                    <span>{group.component}</span>
                  </div>
                  <button
                    onClick={() => handleVisibilityToggle(group.course.code, group.component)}
                    className={`p-2 rounded-full ${
                      group.isVisible 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {group.isVisible ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {group.count} student{group.count !== 1 ? 's' : ''} • Status: {group.isVisible ? 'Visible' : 'Hidden'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        ) : (
          <DataTable
            data={grades.filter(grade => 
              (!filters.course || grade.course.code === filters.course) &&
              (!filters.component || grade.component === filters.component) &&
              (filters.visibility === 'all' ||
               (filters.visibility === 'visible' && grade.component_visibility) ||
               (filters.visibility === 'hidden' && !grade.component_visibility))
            )}
            columns={columns}
            actions={actions}
            pagination={true}
            pageSize={10}
            className="min-w-full divide-y divide-gray-200"
          />
        )}
      </div>
      
      <CurveModal 
        isOpen={curveModal.isOpen}
        onClose={() => setCurveModal({ isOpen: false, type: '', value: 0 })}
      />
    </div>
  );
};

export default GradeList;