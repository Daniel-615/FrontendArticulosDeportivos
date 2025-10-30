import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { LoadingScreen } from "./LoadingScreen"

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen message="VERIFICANDO SESIÓN" />
  }

  return user ? children : <Navigate to="/login" replace />
}
