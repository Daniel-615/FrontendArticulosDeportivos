import { createContext,useState,useContext} from "react";
import { registerRequest } from "../api-gateway/auth";
export const useAuth= ()=>{
    const context=useContext(AuthContext)
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context;
}
const AuthContext= createContext()
export const AuthProvider= ({children})=>{
    const [user,setUser]=useState()
    const [isAuthenticated,setIsAuthenticated]= useState(false);
    const [errors,setErrors]= useState([]);
    const signup= async (user)=>{
        try{
            const res=await registerRequest(user);
            setUser(res.data);
            setIsAuthenticated(true);
            return {success: true,data:res.data}
        }catch(error){
            const backendResponse = error.response?.data;
            
            if (Array.isArray(backendResponse.errors)) {
                setErrors(backendResponse.errors);
            } else if (backendResponse.message) {
                setErrors([backendResponse.message]);
            } else if (typeof backendResponse === 'string') {
                setErrors([backendResponse]);
            } else {
                setErrors(["Error desconocido"]);
            }

            return { success: false, error: backendResponse?.message || "Error desconocido" };
        }

    }
    return(
        <AuthContext.Provider value={{
            signup,
            user,
            isAuthenticated,
            errors,
            setErrors
        }}>
            {children}
        </AuthContext.Provider>
    )
}
