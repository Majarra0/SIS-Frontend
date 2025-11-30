import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout components
import MainLayout from './components/layout/MainLayout';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';

// Dashboard pages
import StudentDashboard from './pages/dashboard/StudentDashboard';
import FacultyDashboard from './pages/dashboard/FacultyDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

// Feature pages
import CourseList from './pages/academic/CourseList';
import CourseDetail from './pages/academic/CourseDetail';
import CourseForm from './pages/academic/CourseForm';
import CourseEditForm from './pages/academic/CourseEditForm';
import EnrollmentList from './pages/enrollment/EnrollmentList';
import EnrollmentForm from './pages/enrollment/EnrollmentForm';
import AttendanceList from './pages/attendance/AttendanceList';
import AttendanceForm from './pages/attendance/AttendanceForm';
import GradeList from './pages/grading/GradeList';
import GradeForm from './pages/grading/GradeForm';
import UserList from './pages/users/UserList';
import UserDetail from './pages/users/UserDetail';
import UserForm from './pages/users/UserForm';
import EditUserForm from './pages/users/EditUserForm';
import DepartmentList from './pages/departments/DepartmentList';
import DepartmentDetails from './pages/departments/DepartmentDetails';
import UserProfile from './pages/profile/UserProfile';
import CourseSchedule from './pages/academic/CourseSchedule';
import SystemReports from './pages/reports/SystemReports';
import PermissionManagement from './pages/permissions/PermissionManagement';
import StudentGrades from './pages/grading/StudentGrades';
import FacultySchedule from './pages/academic/FacultySchedule';

const App = () => {
  console.log('App is rendering');
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Protected routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Student routes */}
          <Route 
            path="/student/*" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="courses" element={<CourseList />} />
                    <Route path="courses/:id" element={<CourseDetail />} />
                    <Route path="enrollments" element={<EnrollmentList />} />
                    <Route path="attendance" element={<AttendanceList />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="grades" element={<StudentGrades />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Faculty routes */}
          <Route 
            path="/faculty/*" 
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<FacultyDashboard />} />
                    <Route path="courses" element={<CourseList />} />
                    <Route path="courses/:id" element={<CourseDetail />} />
                    <Route path="enrollments" element={<EnrollmentList />} />
                    <Route path="attendance" element={<AttendanceList />} />
                    <Route path="attendance/new" element={<AttendanceForm />} />
                    <Route path="grades" element={<GradeList />} />
                    <Route path="grades/new" element={<GradeForm />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="schedule" element={<FacultySchedule />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<UserList />} />
                    <Route path="users/:id" element={<UserDetail />} />
                    <Route path="users/new" element={<UserForm />} />
                    <Route path="users/:id/edit" element={<EditUserForm />} />
                    <Route path="courses" element={<CourseList />} />
                    <Route path="courses/:id" element={<CourseDetail />} />
                    <Route path="courses/new" element={<CourseForm />} />
                    <Route path="courses/:id/edit" element={<CourseEditForm/>}/>
                    <Route path="departments" element={<DepartmentList />} />
                    <Route path='departments/:id' element={<DepartmentDetails/>}/>
                    <Route path="enrollments" element={<EnrollmentList />} />
                    <Route path="enrollments/new" element={<EnrollmentForm />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="settings" element={<UserProfile />} />
                    <Route path="schedule" element={<CourseSchedule/>}/>
                    <Route path="reports" element={<SystemReports/>}/>
                    <Route path="permissions" element={<PermissionManagement />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
};

export default App;