import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaBook, FaCalendarAlt, FaChartLine, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useAuth from '../../hooks/useAuth';
import { getEnrollments } from '../../api/enrollment';
import { getCourses } from '../../api/academic';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

 // Mock student data
const mockStudent = {
  id: "2023CS1234",
  name: "Ali Zaman",
  department: "Computer Science",
  year: 2,
  semester: "Spring 2025",
  advisor: "Dr. Robert Wilson",
  credits: {
    completed: 45,
    total: 120
  }
};

// Mock academic performance data
const academicData = [
  { semester: 'Fall 2024', score: 85, credits: 15 },
  { semester: 'Winter 2024', score: 87, credits: 15 },
  { semester: 'Spring 2025', score: 92, credits: 15 }
];

// Mock notifications
const notifications = [
  { id: 1, message: "New grade posted for CS301", time: "2 hours ago", type: "grade" },
  { id: 2, message: "Course registration opens next week", time: "1 day ago", type: "info" },
  { id: 3, message: "Assignment deadline extended for CS315", time: "2 days ago", type: "deadline" }
];

  // Mock current courses with realistic data
  const currentCourses = [
    {
      id: 1,
      code: 'CS301',
      title: 'Data Structures and Algorithms',
      instructor: 'Dr. Smith',
      schedule: 'Mon/Wed 10:00-11:30',
      room: 'Room 301',
      grade: 88,
      attendance: 95
    },
    {
      id: 2,
      code: 'CS315',
      title: 'Database Management Systems',
      instructor: 'Prof. Johnson',
      schedule: 'Tue/Thu 13:00-14:30',
      room: 'Lab 201',
      grade: 92,
      attendance: 98
    },
    {
      id: 3,
      code: 'CS350',
      title: 'Software Engineering',
      instructor: 'Dr. Williams',
      schedule: 'Wed/Fri 15:00-16:30',
      room: 'Room 405',
      grade: 85,
      attendance: 90
    }
  ];

  // Add upcoming deadlines
  const upcomingDeadlines = [
    {
      id: 1,
      course: 'CS301',
      title: 'Algorithm Analysis Project',
      dueDate: '2025-05-10',
      type: 'Project'
    },
    {
      id: 2,
      course: 'CS315',
      title: 'Database Design Assignment',
      dueDate: '2025-05-08',
      type: 'Assignment'
    }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [enrollmentsData, coursesData] = await Promise.all([
          getEnrollments({ student: currentUser.id, active: true }),
          getCourses({ limit: 5 })
        ]);
        
        setEnrollments(enrollmentsData.results || enrollmentsData);
        setCourses(coursesData.results || coursesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [currentUser]);

  // Format date for deadlines
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateOverallScore = () => {
    const totalGrades = currentCourses.reduce((sum, course) => sum + course.grade, 0);
    return Math.round(totalGrades / currentCourses.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-50">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {mockStudent.name}</h1>
        <div className="mt-2 flex flex-wrap items-center text-gray-600">
          <span className="mr-4">{mockStudent.department} - Year {mockStudent.year}</span>
          <span className="mx-4">|</span>
          <span className="mr-4">Student ID: {mockStudent.id}</span>
          <span className="mx-4">|</span>
          <span>Advisor: {mockStudent.advisor}</span>
        </div>
      </div>
  
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaGraduationCap className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Overall Score</p>
              <p className="text-2xl font-semibold">{calculateOverallScore()}%</p>
              <p className="text-blue-500 text-sm">{mockStudent.semester}</p>
            </div>
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <FaBook className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Credits Progress</p>
              <p className="text-2xl font-semibold">{mockStudent.credits.completed}</p>
              <p className="text-green-500 text-sm">of {mockStudent.credits.total} credits</p>
            </div>
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <FaCalendarAlt className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Current Courses</p>
              <p className="text-2xl font-semibold">{currentCourses.length}</p>
              <p className="text-purple-500 text-sm">This semester</p>
            </div>
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaChartLine className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Average Attendance</p>
              <p className="text-2xl font-semibold">95%</p>
              <p className="text-yellow-500 text-sm">All courses</p>
            </div>
          </div>
        </div>
      </div>
  
      {/* Notifications Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaClock className="text-blue-500 mr-2" />
          Recent Updates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notifications.map(notification => (
            <div 
              key={notification.id}
              className={`p-4 rounded-lg border-l-4 ${
                notification.type === 'grade' ? 'border-green-500 bg-green-50' :
                notification.type === 'deadline' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}
            >
              <p className="font-medium text-gray-800">{notification.message}</p>
              <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
            </div>
          ))}
        </div>
      </div>
  
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Academic Performance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Academic Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={academicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#4F46E5" 
                  strokeWidth={2}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
  
        {/* Upcoming Deadlines - Keep existing code */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaExclamationTriangle className="text-yellow-500 mr-2" />
            Upcoming Deadlines
          </h2>
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-yellow-500">
                <h3 className="font-medium text-gray-800">{deadline.title}</h3>
                <p className="text-sm text-gray-600">{deadline.course}</p>
                <p className="text-sm text-yellow-600 mt-2">Due: {formatDate(deadline.dueDate)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
  
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/student/courses"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <h2 className="text-lg font-medium mb-4">My Courses</h2>
          <p className="text-gray-600 mb-4">View and manage your current courses</p>
          <span className="text-blue-600 font-medium">View Details →</span>
        </Link>
  
        <Link
          to="/student/transcript"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <h2 className="text-lg font-medium mb-4">Academic Record</h2>
          <p className="text-gray-600 mb-4">Access your academic transcript</p>
          <span className="text-blue-600 font-medium">View Transcript →</span>
        </Link>
  
        <Link
          to="/student/schedule"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <h2 className="text-lg font-medium mb-4">Class Schedule</h2>
          <p className="text-gray-600 mb-4">View your weekly timetable</p>
          <span className="text-blue-600 font-medium">View Schedule →</span>
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;