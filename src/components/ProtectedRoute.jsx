import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContent';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="text-white text-center mt-4">Verificando sesión...</p>;
  }

  return user ? children : <Navigate to="/login" replace />;
};
