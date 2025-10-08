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
export const createEnvio= async(payload)=>{
    try{
        const response=await axios.post(
            `${API_GATEWAY}envio`,
            payload
        )
        return ok(response.data);
    }catch(err){
        return fail(err, "Error al crear el envio")
    }
}
export const getEnvios= async()=>{
    try{
        const response= await axios.get(
            `${API_GATEWAY}/envio`
        )
        return ok(response.data)
    }catch(err){
        return fail(err, "Error al obtener los envios")
    }
}
export const getEnvioGuia= async(numero_guia)=>{
    try{
        const response=await axios.get(
            `${API_GATEWAY}envio/${numero_guia}`
        )
        return ok(response.data)
    }catch(err){
        return fail(err, "Error al obtener el envio por guia")
    }
}
export const putEnvioGuia= async(numero_guia, payload)=>{
    try{
        const response= await axios.put(
            `${API_GATEWAY}envio/${numero_guia}`,
            payload
        )
        return ok(response.data)
    }catch(err){
        return fail(err, "Error al actualizar el envio por guia")
    }
}
