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


export const createDeseo = async (usuario_id, payload) => {
  try {
    const response = await axios.post(
      `${API_GATEWAY}deseo/usuarios/${usuario_id}/deseos`,
      payload,
      { withCredentials: true }
    );
    return ok(response.data);
  } catch (err) {
    return fail(err, "Error al crear el deseo");
  }
};


export const getDeseosUsuario = async (usuario_id, params = {}) => {
  try {
    const response = await axios.get(
      `${API_GATEWAY}deseo/usuarios/${usuario_id}/deseos`,
      { withCredentials: true, params }
    );
    return ok(response.data.data || []); 
  } catch (err) {
    return fail(err, "Error al obtener los deseos del usuario");
  }
};

export const getDeseoById = async (deseo_id) => {
  try {
    const response = await axios.get(
      `${API_GATEWAY}deseo/deseos/${deseo_id}`,
      { withCredentials: true }
    );
    return ok(response.data);
  } catch (err) {
    return fail(err, "Error al obtener el deseo");
  }
};

export const consumirDeseo = async (deseo_id, payload = {}) => {
  try {
    const response = await axios.patch(
      `${API_GATEWAY}deseo/deseos/${deseo_id}/consumir`,
      payload,
      { withCredentials: true }
    );
    console.log(response.data)
    return ok(response.data);
  } catch (err) {
    return fail(err, "Error al consumir el deseo");
  }
};


export const deleteDeseo = async (deseo_id) => {
  try {
    const response = await axios.delete(
      `${API_GATEWAY}deseo/deseos/${deseo_id}`,
      { withCredentials: true }
    );
    return ok(response.data);
  } catch (err) {
    return fail(err, "Error al eliminar el deseo");
  }
};
