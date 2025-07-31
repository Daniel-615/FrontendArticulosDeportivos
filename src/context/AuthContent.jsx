import { createContext, useState, useContext, useEffect } from "react";
import { LoginRequest, refreshTokenRequest, registerRequest,Logout } from "../api-gateway/auth";

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
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    //esto sirve para refrescar la sesión al refrescar el navegador
    const checkSession= async()=>{
      const res= await refreshTokenRequest();
      if(res.success){
        setUser({
          id: res.data.userId,
          nombre: res.data.nombre,
          apellido: res.data.apellido,
          email: res.data.email,
          rol: res.data.rol
        });;
        const userData={
          id: res.data.userId,
          nombre: res.data.nombre,
          apellido: res.data.apellido,
          email: res.data.email,
        }
        localStorage.setItem("user",JSON.stringify(userData))
        setIsAuthenticated(true);
      }else{
        setUser(null);
        setIsAuthenticated(false);
      }
       setLoading(false); 
    };
    checkSession();
  },[]);

  const logout = async () => {
    const res = await Logout();
    if (res.success) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
    } else {
      console.error("Error al cerrar sesión:", res.error);
    }
  };

  const signup = async (user) => {
    const res = await registerRequest(user);

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
        logout,
        user,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};