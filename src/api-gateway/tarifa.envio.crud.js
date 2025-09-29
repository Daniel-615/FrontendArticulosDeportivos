
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


export const createTarifaEnvio = async (payload) => {

  try {
    const res = await axios.post(
      `${API_GATEWAY}tarifa_envio`,
      payload,
      { withCredentials: true }
    );
    return ok(res.data);
  } catch (err) {
    return fail(err, "Error al crear la tarifa de envío");
  }
};


export const getTarifaEnvios = async (params) => {

  try {
    const res = await axios.get(
      `${API_GATEWAY}tarifa_envio`,
      { withCredentials: true, params }
    );
    return ok(res.data);
  } catch (err) {
    return fail(err, "Error al obtener las tarifas de envío");
  }
};


export const getTarifaEnvioById = async (id_tarifa) => {
  try {
    const res = await axios.get(
      `${API_GATEWAY}tarifa_envio/${encodeURIComponent(id_tarifa)}`,
      { withCredentials: true }
    );
    return ok(res.data);
  } catch (err) {
    return fail(err, "Error al obtener la tarifa de envío");
  }
};


export const updateTarifaEnvio = async (id_tarifa, payload) => {

  try {
    const res = await axios.put(
      `${API_GATEWAY}tarifa_envio/${encodeURIComponent(id_tarifa)}`,
      payload,
      { withCredentials: true }
    );
    return ok(res.data);
  } catch (err) {
    return fail(err, "Error al actualizar la tarifa de envío");
  }
};


export const calcularEnvioRequest = async (carrito) => {

  try {
    const res = await axios.post(
      `${API_GATEWAY}tarifa_envio/calcular`,
      carrito,
      { withCredentials: true }
    );
    return ok(res.data);
  } catch (err) {
    return fail(err, "Error al calcular el envío");
  }
};
