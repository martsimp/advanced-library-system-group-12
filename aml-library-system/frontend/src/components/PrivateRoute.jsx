import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // You might want to create a proper loading component
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
} 