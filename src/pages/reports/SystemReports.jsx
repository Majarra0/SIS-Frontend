import React, { useState } from 'react';
import { 
  FaChartBar, FaDownload, FaFilter, FaCalendarAlt,
  FaUserGraduate, FaChalkboardTeacher, FaBook
} from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell
} from 'recharts';

// Mock data for reports
const mockReports = {
  enrollmentTrends: [
    { month: 'Jan', undergraduate: 850, graduate: 320, total: 1170 },
    { month: 'Feb', undergraduate: 940, graduate: 350, total: 1290 },
    { month: 'Mar', undergraduate: 980, graduate: 390, total: 1370 },
    { month: 'Apr', undergraduate: 1020, graduate: 420, total: 1440 },
    { month: 'May', undergraduate: 1050, graduate: 450, total: 1500 },
    { month: 'Jun', undergraduate: 1100, graduate: 480, total: 1580 }
  ],
  departmentPerformance: [
    { name: 'Computer Science', gpa: 3.45, retention: 92, satisfaction: 88 },
    { name: 'Engineering', gpa: 3.32, retention: 89, satisfaction: 85 },
    { name: 'Business', gpa: 3.28, retention: 87, satisfaction: 82 },
    { name: 'Arts', gpa: 3.52, retention: 90, satisfaction: 89 },
    { name: 'Sciences', gpa: 3.38, retention: 88, satisfaction: 86 }
  ],
  resourceUtilization: [
    { name: 'Classrooms', utilized: 85, available: 15 },
    { name: 'Labs', utilized: 78, available: 22 },
    { name: 'Library', utilized: 92, available: 8 },
    { name: 'Study Rooms', utilized: 65, available: 35 }
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const SystemReports = () => {
  const [dateRange, setDateRange] = useState('last6months');
  const [department, setDepartment] = useState('all');
  const [reportType, setReportType] = useState('all');

  const handleExportData = (format) => {
    // Mock export functionality
    console.log(`Exporting data in ${format} format...`);
    // In real implementation, this would trigger the data export
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <FaChartBar className="text-blue-600 text-3xl mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Reports</h1>
              <p className="text-sm text-gray-500">
                Comprehensive analysis and statistics
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleExportData('pdf')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg
                       hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaDownload className="mr-2" />
              Export PDF
            </button>
            <button
              onClick={() => handleExportData('excel')}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg
                       hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FaDownload className="mr-2" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                         focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="last6months">Last 6 Months</option>
                <option value="last12months">Last 12 Months</option>
                <option value="lastyear">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                         focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Departments</option>
                <option value="cs">Computer Science</option>
                <option value="eng">Engineering</option>
                <option value="bus">Business</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <div className="relative">
              <FaChartBar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                         focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Reports</option>
                <option value="enrollment">Enrollment</option>
                <option value="academic">Academic Performance</option>
                <option value="resource">Resource Utilization</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Enrollment Trends */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaUserGraduate className="text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold">Enrollment Trends</h2>
            </div>
            <span className="text-sm text-gray-500">Last 6 months</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockReports.enrollmentTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="undergraduate" stroke="#0088FE" />
                <Line type="monotone" dataKey="graduate" stroke="#00C49F" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaChalkboardTeacher className="text-green-600 mr-2" />
              <h2 className="text-lg font-semibold">Department Performance</h2>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockReports.departmentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="gpa" fill="#0088FE" name="GPA" />
                <Bar dataKey="satisfaction" fill="#00C49F" name="Satisfaction %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource Utilization */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaBook className="text-purple-600 mr-2" />
              <h2 className="text-lg font-semibold">Resource Utilization</h2>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockReports.resourceUtilization}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="utilized"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {mockReports.resourceUtilization.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemReports;