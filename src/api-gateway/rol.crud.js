import axios from 'axios';
const API_GATEWAY= import.meta.env.VITE_API_GATEWAY;
export const createRol=async(rol)=>{
    try{
        const response=await axios.post(
            `${API_GATEWAY}rol`,
            rol,
            {
                withCredentials: true,
            }
        );
        return {success: true, data: response.data};
    }catch(error){
        if(error.response){
            return{
                success:false, error: error.response.data.error ||"Error del servidor"
            };
        }
        return {
            success: false, error: "Error de red o del servidor"
        }
    }
}
export const getRoles= async()=>{
    try{
        const response=await axios.get(
            `${API_GATEWAY}rol`,
            {
                withCredentials: true,
            }
        );
        return {
            success: true,
            data: response.data
        }
    }catch(error){
        if(error.response){
            return{
                success: false,
                error: error.response.data.error ||"Error del servidor"
            }
        }
        return {
            success: false,
            error: "Error de red o del servidor"
        }
    }
}
export const getRolId= async(id)=>{
    try{
        const response=await axios.get(`${API_GATEWAY}rol/${id}`,
            {
                withCredentials: true
            }
        )
        return {
            success: true,
            data: response.data
        }
    }catch(error){
        if(error.response){
            return{
                success: false,
                error: error.response?.data?.error ||"Error del servidor"
            }
        }
        return{
            success: false,
            error: "Error de red o del servidor"
        }
    }
}
export const updateRol= async (id,rol)=>{
    try{
        const response= await axios.put(
            `${API_GATEWAY}rol/${id}`,
            rol,
            {
                withCredentials: true,
            }
        );
        return {
            success: true, data: response.data};
    }catch(error){
        if(error.response){
            return {
                success: false,
                error: error.response?.data?.error|| "Error del servidor"
            }
        }
        return {
            success: false,
            error: "Error de red o del servidor"
        }
    }
}
export const deleteRol= async(id)=>{
    try{
        const response= await axios.delete(`${API_GATEWAY}rol/${id}`,{
            withCredentials: true,
        });
        return {success: true, data: response.data}
    }catch(error){
        if(error.response){
            return {
                success: false,
                error: error.response?.data?.error ||"Error del servidor"
            }
        }
        return {
            success: false,
            error: "Error de red o del servidor"
        }
    }
}