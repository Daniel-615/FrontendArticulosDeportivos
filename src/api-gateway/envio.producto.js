import axios from "axios";
const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;

const ok = (data) => ({ success: true, data });
const fail = (err, fallback = "Error del servidor") => {
  if (err?.response) {
    return {
      success: false,
      error: err.response.data?.error || err.response.data?.message || fallback,
    };
  }
  return { success: false, error: "Error de red o del servidor" };
};

export const createEnvioProducto = async (payload) => {
  try {
    const res = await axios.post(`${API_GATEWAY}envio_producto`, payload, {
      withCredentials: true,
    });
    return ok(res.data);
  } catch (err) {
    return fail(err, "Error al crear la tarifa de envío");
  }
};

// Traer TODOS los productos de UN envío (✅ ESTA ES LA QUE NECESITAS)
export const getEnvioProductosByEnvioId = async (id_envio) => {
  try {
    console.log(id_envio)
    const res = await axios.get(
      `${API_GATEWAY}envio_producto/envio/${encodeURIComponent(id_envio)}`,
      { withCredentials: true }
    );
    console.log(res.data)
    return ok(res.data);
  } catch (err) {
    return fail(err, "Error al obtener los productos del envío");
  }
};

// (Opcional) Obtener un envio_producto por su ID propio
export const getEnvioProductoById = async (id_envio_producto) => {
  try {
    const res = await axios.get(
      `${API_GATEWAY}envio_producto/${encodeURIComponent(id_envio_producto)}`,
      { withCredentials: true }
    );
    console.log(res.data);
    return ok(res.data);
  } catch (err) {
    return fail(err, "Error al obtener el envio_producto");
  }
};

export const updateEnvioProducto = async (id, payload) => {
  try {
    const res = await axios.put(
      `${API_GATEWAY}envio_producto/${encodeURIComponent(id)}`,
      payload,
      { withCredentials: true }
    );
    return ok(res.data);
  } catch (err) {
    return fail(err, "Error al actualizar el envio de producto");
  }
};

export const deleteEnvioProducto = async (id) => {
  try {
    const res = await axios.delete(
      `${API_GATEWAY}envio_producto/${encodeURIComponent(id)}`,
      { withCredentials: true }
    );
    return ok(res.data);
  } catch (err) {
    return fail(err, "Error al eliminar el envio de producto");
  }
};
