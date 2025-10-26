import axios from "axios";
const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;

const ok = (data) => ({ success: true, data });
const fail = (err, fallback = "Error del servidor") => {
  if (err?.response) {
    return {
      success: false,
      error:
        err.response.data?.error ||
        err.response.data?.message ||
        fallback,
    };
  }
  return { success: false, error: "Error de red o del servidor" };
};
export const getEstadoInvocacion=async(payload)=>{
    try{
        const response=await axios.get(
            `${API_GATEWAY}invocar/${payload.usuarioId}`,
            {
                withCredentials:true,
            }
        );
        return ok(response.data);
    }catch(err){
        return fail(err,"Error al obtener el estado de invocación");
    }
}
export const modificarEstadoInvocacion=async(payload)=>{
    try{
        const response=await axios.patch(
            `${API_GATEWAY}invocar/${payload.usuarioId}`,
            payload.data,
            {
                withCredentials:true,
            }
        );
        return ok(response.data);
    }catch(err){
        return fail(err,"Error al modificar el estado de invocación");
    }
}