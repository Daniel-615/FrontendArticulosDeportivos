import { createContext, useState, useContext } from "react";
import { LoginRequest, registerRequest } from "../api-gateway/auth";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const signup = async (user) => {
    const res = await registerRequest(user); // Siempre devuelve { success, data/error }

    if (res.success) {
      setUser(res.data);
      setIsAuthenticated(true);
      return { success: true, data: res.data };
    } else {
      return { success: false, message: res.error };
    }
  };
  const signin = async (credentials) => {
    try {
      const res = await LoginRequest(credentials);

      if (res.success) {
        setUser(res.data.user);
        setIsAuthenticated(true);

        return { success: true, data: { user: res.data.user } }; 
      } else {
        return { success: false, message: res.error || res.message || "Error al iniciar sesión." };
      }
    } catch (error) {
      return { success: false, message: error.message || "Error desconocido" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        user,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};