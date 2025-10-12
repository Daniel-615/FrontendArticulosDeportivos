import axios from "axios";
const API_GATEWAY= import.meta.env.VITE_API_GATEWAY;
const ok=(data)=>({success: true, data});
const fail=(err,fallback="Error del servidor")=>{
    if(err?.response){
        return{
            success: false,
            error:
                err.response.data?.error || err.response.data?.message || fallback
        }
    }
    return { success: false, error: "Error de red o del servidor"};
}
export const getEstadoEnvios= async()=>{
    
    try{
        const res= await axios.get(
            `${API_GATEWAY}estado_envio/`,
            {
                withCredentials: true
            }
        )
        console.log(res.data)
        return ok(res.data);
    }catch(err){
        return fail(err,"Error al obtener los estados de los envios")
    }
}
export const getEstadosOfEnvio= async(id_envio)=>{
    try{
        const res= await axios.get(
            `${API_GATEWAY}estado_envio/envio/${id_envio}`,
            {
                withCredentials: true
            }
        );
        console.log(res.data);
        return ok(res.data);
    }catch(err){
        return fail(err,"Error al obtener los estados de un envio")
    }
}
export const putEstadoEnvio= async(id_estado, payload)=>{
    try{
        const response= await axios.put(
            `${API_GATEWAY}estado_envio/${id_estado}`,
            payload,
            {
                withCredentials: true
            }
        )
        return ok(response.data)
    }catch(err){
        return fail(err,"Error al actualizar el estado de un envio")
    }
}
export const deleteEstadoEnvio=async(id_estado)=>{
    try{
        const res= await axios.delete(
            `${API_GATEWAY}estado_envio/${id_estado}`,
            {
                withCredentials: true
            }
        )
        return ok(res.data)
    }catch(err){
        return fail(err, "Error al eliminar el estado de un envio")
    }
}