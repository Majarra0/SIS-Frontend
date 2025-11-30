import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaBook,
  FaUniversity,
  FaChalkboardTeacher,
  FaBell,
  FaCalendarAlt,
  FaHistory,
} from 'react-icons/fa';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const enrollmentData = [
  { month: 'Jan', count: 0 },
  { month: 'Feb', count: 0 },
  { month: 'Mar', count: 0 },
  { month: 'Apr', count: 0 },
  { month: 'May', count: 10 },
  { month: 'Jun', count: 0 }
];

const departmentDistribution = [
  { name: 'Computer Science', value: 4 },
  { name: 'Biology', value: 2 },
  { name: 'Physics', value: 2 },
  { name: 'Chemistry', value: 2 }
];

// Label rendering function
const renderLabel = ({ name, value }) => `${name}: ${value}`;

const notifications = [
  { id: 1, message: '⚠️ Low enrollment in Biology department', date: '2025-05-01' },
  { id: 2, message: '⚠️ Low enrollment in Physics department', date: '2025-05-01' },
  { id: 3, message: '⚠️ Low enrollment in Chemistry department', date: '2025-05-01' }
];

const recentActivities = [
  { id: 1, action: 'Added new student: 2025CS012', time: '2 hours ago' },
  { id: 2, action: 'Added new student: 2025CS011', time: '5 hours ago' },
  { id: 3, action: 'Added new student: 2025CS010', time: '1 day ago' }
];

const upcomingEvents = [
  { id: 1, title: 'Graduation Ceremony', date: '2025-04-01' },
  { id: 2, title: 'Final Exams Begin', date: '2025-05-04' }
];

const chartColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatCard = ({ icon, iconBg, iconColor, title, value, note, noteColor }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 flex items-center">
    <div className={`p-3 ${iconBg} rounded-full`}>
      {React.cloneElement(icon, { className: `h-6 w-6 ${iconColor}` })}
    </div>
    <div className="ml-4">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
      <p className={`${noteColor} text-sm`}>{note}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <div className="h-80">{children}</div>
  </div>
);

const QuickActionLink = ({ to, title, description }) => (
  <Link to={to} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
    <h2 className="text-lg font-medium mb-4">{title}</h2>
    <p className="text-gray-600 mb-4">{description}</p>
    <span className="text-blue-600 font-medium">Go to {title} →</span>
  </Link>
);


const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Registrar Dashboard</h1>
      </header>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FaUsers />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          title="Total Students"
          value="10"
          note="+100% from last month"
          noteColor="text-green-500"
        />
        <StatCard
          icon={<FaBook />}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          title="Active Courses"
          value="5"
          note="+5 new this semester"
          noteColor="text-green-500"
        />
        <StatCard
          icon={<FaUniversity />}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
          title="Departments"
          value="4"
          note="All active"
          noteColor="text-blue-500"
        />
        <StatCard
          icon={<FaChalkboardTeacher />}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          title="Faculty Members"
          value="5"
          note="+5 this year"
          noteColor="text-green-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ChartCard title="Enrollment Trends">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department Distribution">
          <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={departmentDistribution}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label={({percent }) =>
          `${(percent * 100).toFixed(0)}%`
        }
      >
        {departmentDistribution.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
        ))}
      </Pie>
      <Legend layout="vertical" align="right" verticalAlign="middle" />
    </PieChart>
  </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* New Panels Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Notifications Panel */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <FaBell className="text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            {notifications.map(n => (
              <li key={n.id} className="border-b pb-1">
                <span className="block">{n.message}</span>
                <span className="text-xs text-gray-400">{n.date}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <FaHistory className="text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            {recentActivities.map(a => (
              <li key={a.id} className="border-b pb-1">
                <span className="block">{a.action}</span>
                <span className="text-xs text-gray-400">{a.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <FaCalendarAlt className="text-green-600 mr-2" />
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            {upcomingEvents.map(e => (
              <li key={e.id} className="border-b pb-1">
                <span className="block font-medium">{e.title}</span>
                <span className="text-xs text-gray-400">{e.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickActionLink
          to="/admin/users"
          title="User Management"
          description="Manage system users and permissions"
        />
        <QuickActionLink
          to="/admin/courses"
          title="Course Management"
          description="Manage academic courses and schedules"
        />
        <QuickActionLink
          to="/admin/reports"
          title="System Reports"
          description="View and generate system reports"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
