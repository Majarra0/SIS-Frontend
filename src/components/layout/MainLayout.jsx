import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaBook, FaUserGraduate, FaChalkboardTeacher, 
         FaCalendarAlt, FaUsers, FaBuilding, FaCog, FaSignOutAlt } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const MainLayout = ({ children }) => {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const getNavItems = () => {
    const commonItems = [
      { name: 'Dashboard', path: `/${userRole}/dashboard`, icon: <FaHome /> },
      { name: 'Courses', path: `/${userRole}/courses`, icon: <FaBook /> },
    ];
    
    switch(userRole) {
      case 'student':
        return [
          ...commonItems,
          { name: 'My Enrollments', path: '/student/enrollments', icon: <FaUserGraduate /> },
          { name: 'My Grades', path: '/student/grades', icon: <FaChalkboardTeacher /> },
          { name: 'Attendance', path: '/student/attendance', icon: <FaCalendarAlt /> }
        ];
      case 'faculty':
        return [
          ...commonItems,
          { name: 'Enrollments', path: '/faculty/enrollments', icon: <FaUserGraduate /> },
          { name: 'Grade Management', path: '/faculty/grades', icon: <FaChalkboardTeacher /> },
          { name: 'Attendance', path: '/faculty/attendance', icon: <FaCalendarAlt /> }
        ];
      case 'admin':
        return [
          ...commonItems,
          { name: 'Users', path: '/admin/users', icon: <FaUsers /> },
          { name: 'Departments', path: '/admin/departments', icon: <FaBuilding /> },
          { name: 'System Settings', path: '/admin/settings', icon: <FaCog /> }
        ];
      default:
        return commonItems;
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    }
  };
  
  const navItems = getNavItems();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <FaUserGraduate className="text-blue-600 text-2xl" />
              <h1 className="text-xl font-bold text-gray-900">
                Student Information System
              </h1>
            </div>
            {user && (
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900">
                    {user.personal_info?.first_name || user.username}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {userRole}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium
                           text-gray-700 bg-gray-100 border border-transparent
                           rounded-md hover:bg-gray-200 focus:outline-none 
                           focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                           transition-colors duration-200"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md flex-shrink-0 overflow-y-auto">
          <nav className="p-4">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
                className={`flex items-center px-4 py-2.5 mb-1 rounded-lg
                           transition-all duration-200 group
                           ${location.pathname === item.path 
                             ? 'bg-blue-50 text-blue-700 font-medium' 
                             : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <span className={`mr-3 ${
                  location.pathname === item.path
                    ? 'text-blue-600'
                    : 'text-gray-400 group-hover:text-gray-500'
                }`}>
                  {item.icon}
                </span>
                {item.name}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Student Information System
            </p>
            <div className="text-sm text-gray-500">
              Version 1.0.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;