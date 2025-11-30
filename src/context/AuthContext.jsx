import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, refreshToken as refreshAuthToken, getCurrentUser } from '../api/auth';
import { isMockMode } from '../api/apiConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      const mockUserId = isMockMode ? localStorage.getItem('mock_user_id') : null;
      if (!token && !mockUserId) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getCurrentUser();
        setUser(profile);
      } catch (error) {
        try {
          await refreshAuthToken();
          const profile = await getCurrentUser();
          setUser(profile);
        } catch (refreshError) {
          console.error('Auth initialization error:', refreshError);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('mock_user_id');
        }
      }
      setLoading(false);
    };
  
    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const result = await loginService(username, password);
      setUser(result.user);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('mock_user_id');
    setUser(null);
  };

  const value = { 
    user, 
    currentUser: user,
    setUser,
    loading,
    isAuthenticated: !!user,
    // Check both role and admin status
    userRole: user?.role === 'admin' ? 'admin' : user?.role || null,
    isAdmin: user?.role === 'admin',
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
