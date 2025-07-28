import axios from 'axios';
const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;
export const updateUser=async(user,id)=>{
    try{
        const response = await axios.post(`${API_GATEWAY}usuario/${id}`, user, {
            withCredentials: true
        });
        return {sucess: true, data: response.data};
    }catch(error){
        if(error.response){
            return{
                sucess: false,
                error: error.response.data.error ||'Error del servidor'
            }
        }
        return {sucess: false, error: 'Error de red o del servidor.'}
    }
}