import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaUserGraduate, FaClipboardCheck, FaBookReader } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useAuth from '../../hooks/useAuth';

const FacultyDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  // Mock data for charts
  const attendanceData = [
    { course: 'CS101', attendance: 92 },
    { course: 'CS202', attendance: 88 },
    { course: 'CS303', attendance: 95 }
  ];

  const upcomingClasses = [
    { id: 1, course: 'CS101', time: '10:00 AM', room: 'Room 301', students: 35 },
    { id: 2, course: 'CS202', time: '2:00 PM', room: 'Room 205', students: 28 },
    { id: 3, course: 'CS303', time: '4:00 PM', room: 'Lab 102', students: 30 }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with Welcome Message */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, Prof. {currentUser?.name}</h1>
        <p className="text-gray-600 mt-2">Department of Computer Science</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaChalkboardTeacher className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Active Courses</p>
              <p className="text-2xl font-semibold">3</p>
              <p className="text-blue-500 text-sm">Current Semester</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <FaUserGraduate className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Students</p>
              <p className="text-2xl font-semibold">93</p>
              <p className="text-green-500 text-sm">Across all courses</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaClipboardCheck className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Pending Grades</p>
              <p className="text-2xl font-semibold">28</p>
              <p className="text-yellow-500 text-sm">Need attention</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <FaBookReader className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Average Attendance</p>
              <p className="text-2xl font-semibold">91%</p>
              <p className="text-purple-500 text-sm">This week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Attendance Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Course Attendance Rates</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendance" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
          <div className="space-y-4">
            {upcomingClasses.map(cls => (
              <div key={cls.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800">{cls.course}</h3>
                  <p className="text-sm text-gray-600">{cls.time} - {cls.room}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{cls.students} students</p>
                  <Link to={`/faculty/attendance/${cls.id}`} className="text-blue-600 text-sm hover:underline">
                    Take Attendance →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/faculty/courses"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <h2 className="text-lg font-medium mb-4">Course Management</h2>
          <p className="text-gray-600 mb-4">View and manage your courses</p>
          <span className="text-blue-600 font-medium">View Courses →</span>
        </Link>

        <Link
          to="/faculty/attendance"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <h2 className="text-lg font-medium mb-4">Attendance Records</h2>
          <p className="text-gray-600 mb-4">Take and view attendance</p>
          <span className="text-blue-600 font-medium">Manage Attendance →</span>
        </Link>

        <Link
          to="/faculty/grades"
          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <h2 className="text-lg font-medium mb-4">Grading Center</h2>
          <p className="text-gray-600 mb-4">Manage student grades</p>
          <span className="text-blue-600 font-medium">Enter Grades →</span>
        </Link>
      </div>
    </div>
  );
};

export default FacultyDashboard;