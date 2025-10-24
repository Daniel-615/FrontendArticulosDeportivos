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


export const createPromocion = async (payload) => {
  try {
    const response = await axios.post(
      `${API_GATEWAY}promocion`,
      payload,
      { withCredentials: true }
    );
    return ok(response.data);
  } catch (err) {
    return fail(err, "Error al crear la promoción");
  }
};


export const getPromociones = async (params = {}) => {
  try {
    const response = await axios.get(
      `${API_GATEWAY}promocion`,
      {
        withCredentials: true,
        params, 
      }
    );
    return ok(response.data);
  } catch (err) {
    return fail(err, "Error al obtener las promociones");
  }
};

export const getPromocionById = async (promocion_id) => {
  try {
    const response = await axios.get(
      `${API_GATEWAY}promocion/${promocion_id}`,
      { withCredentials: true }
    );
    return ok(response.data);
  } catch (err) {
    return fail(err, "Error al obtener la promoción");
  }
};


export const patchPromocion = async (promocion_id, payload) => {
  try {
    const response = await axios.patch(
      `${API_GATEWAY}promocion/${promocion_id}`,
      payload,
      { withCredentials: true }
    );
    return ok(response.data);
  } catch (err) {
    return fail(err, "Error al actualizar la promoción");
  }
};

export const deletePromocion = async (promocion_id) => {
  try {
    const response = await axios.delete(
      `${API_GATEWAY}promocion/${promocion_id}`,
      { withCredentials: true }
    );
    return ok(response.data);
  } catch (err) {
    return fail(err, "Error al desactivar la promoción");
  }
};


export const getPromosVigentes = async () => {
  return getPromociones({ vigentes: true, activo: true });
};

export const createPromo10 = async () => {
  return createPromocion({
    tipo: "DESC_FIJO",
    porcentaje: 10,
    usosMaximos: 1,
    metadata: { stackable: false },
  });
};
