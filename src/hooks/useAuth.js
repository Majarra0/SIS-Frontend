import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  if (!context.user && !context.loading) {
    console.warn('No authenticated user found');
  }
  return context;
};

export default useAuth;