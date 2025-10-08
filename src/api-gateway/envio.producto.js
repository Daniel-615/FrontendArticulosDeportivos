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
export const createEnvioProducto=async(payload)=>{
    try{
        const res= await axios.post(
            `${API_GATEWAY}/envio_producto`,
            payload,
            { 
                withCredentials:true
            }  
        );
        return ok(res.data);
    }catch(err){
        return fail(err, "Error al crear la tarifa de envío");
    }
}
export const getEnvioProductos= async()=>{
    try{
        const res= await axios.get(
            `${API_GATEWAY}envio_producto/`
        )
        return ok(res.data);
    }catch(err){
        return fail(err, "Error al obtener los envio de producto")
    }
}
export const getEnvioAssociatedProductById= async(id_envio)=>{
    try{
        const res= await axios.get(
            `${API_GATEWAY}envio_producto/${encodeURIComponent(id_envio)}`
        )
        return ok(res.data);
    }catch(err){
        return fail(err, "Error al obtener el envio")
    }
}
export const getEnvioProductId= async(id)=>{
    try{
        const res= await axios.get(
            `${API_GATEWAY}envio_producto/envio/${encodeURIComponent(id)}`
        )
        return ok(res.data);
    }catch(err){
        return fail(err, "Error al obtener el envio de producto")
    }
}
export const updateEnvioProducto=async(id,payload)=>{
    try{
        const res= await axios.put(
            `${API_GATEWAY}envio_producto/${encodeURIComponent(id)}`,
            payload,
            { withCredentials:true }
        )
        return ok(res.data)
    }catch(err){
        return fail(err,"Error al actualizar el envio de producto")
    }
}
export const deleteEnvioProducto=async(id)=>{
    try{
        const res= await axios.delete(
            `${API_GATEWAY}envio_producto/${encodeURIComponent(id)}`,
        )
        return ok(res.data);
    }catch(err){
        return fail(err,"Error al eliminar el envio de producto")
    }
}