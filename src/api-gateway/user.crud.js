import axios from 'axios';
const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;
export const updateUser=async(user,id)=>{
    try{
        const response = await axios.put(`${API_GATEWAY}usuario/${id}`, user, {
            withCredentials: true
        });
        return {success: true, data: response.data};
    }catch(error){
        if(error.response){
            return{
                success: false,
                error: error.response.data.error ||'Error del servidor'
            }
        }
        return {success: false, error: 'Error de red o del servidor.'}
    }
}
export const findAllActivos= async()=>{
    try{
        const response= await axios.get(`${API_GATEWAY}usuario/findAllActivos`,{
            withCredentials:true
        })
        return {
            success: true, data: response.data
        }
    }catch(err){
        if (err.response) {
        return {
            success: false,
            error: err.response.data?.error || 'Error del servidor',
        };
        }
        return { success: false, error: 'Error de red o del servidor' };
    }
}
export const findAll= async()=>{
    try{
        const response=await axios.get(`${API_GATEWAY}usuario/findAll/`,{
            withCredentials:true,
        })
        return {
            success: true, data: response.data
        }
    }catch(err){
        if (err.response) {
        return {
            success: false,
            error: err.response.data?.error || 'Error del servidor',
        };
        }
        return { success: false, error: 'Error de red o del servidor' };
    }
}
export const findOne=async(id)=>{
    try{
        const response= await axios.get(`${API_GATEWAY}usuario/findOne/${id}`,{
            withCredentials: true,
        })
        return {
            success: true, data: response.data
        }
    }catch(err){
        if (err.response) {
        return {
            success: false,
            error: err.response.data?.error || 'Error del servidor',
        };
        }
        return { success: false, error: 'Error de red o del servidor' };
    }
}
//SOFT DELETE
export const deactivateAccount = async (id) => {
    try {
        const response = await axios.post(
        `${API_GATEWAY}usuario/deactivateAccount/${id}`,
        {}, // cuerpo vacío del data 
        {
            withCredentials: true,
        }
        );
        return { success: true, data: response.data };
    } catch (err) {
        if (err.response) {
        return {
            success: false,
            error: err.response.data?.error || 'Error del servidor',
        };
        }
        return { success: false, error: 'Error de red o del servidor' };
    }
};
//HARD DELETE
export const Delete= async(id)=>{
    try{
        const response= await axios.delete(`${API_GATEWAY}usuario/${id}`,{
            withCredentials: true
        })
        return {
            success: true, data: response.data
        }
    }catch(err){
        if(err.response){
            const errorMessage= err.response.data?.message || "Error desconocido."
            return res
            .status(err.response.status)
            .send({
                success: false, error: errorMessage
            })
        }
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
    }
}