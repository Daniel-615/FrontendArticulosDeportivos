import axios from "axios";

const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;
const BASE = `${API_GATEWAY}talla`;
export const postTalla = async (payload) => {
  try {
    const { data } = await axios.post(`${BASE}/`, payload, {
      withCredentials: true,
    });
    return { success: true, data };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error:
          error.response.data?.error ||
          error.response.data?.message ||
          "Error del servidor",
      };
    }
    return { success: false, error: "Error de red o del servidor" };
  }
};

export const getTallas = async () => {
  try {
    const { data } = await axios.get(`${BASE}/`, {
      withCredentials: true,
    });
    return { success: true, data };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error:
          error.response.data?.error ||
          error.response.data?.message ||
          "Error del servidor",
      };
    }
    return { success: false, error: "Error de red o del servidor" };
  }
};

export const getTallaById = async (talla_id) => {
  try {
    const { data } = await axios.get(`${BASE}/${talla_id}`, {
      withCredentials: true,
    });
    return { success: true, data };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error:
          error.response.data?.error ||
          error.response.data?.message ||
          "Error del servidor",
      };
    }
    return { success: false, error: "Error de red o del servidor" };
  }
};

export const putTalla = async (talla_id, payload) => {
  try {
    const { data } = await axios.put(`${BASE}/${talla_id}`, payload, {
      withCredentials: true,
    });
    return { success: true, data };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error:
          error.response.data?.error ||
          error.response.data?.message ||
          "Error del servidor",
      };
    }
    return { success: false, error: "Error de red o del servidor" };
  }
};
export const deleteTalla = async (talla_id) => {
  try {
    const { data } = await axios.delete(`${BASE}/${talla_id}`, {
      withCredentials: true,
    });
    return { success: true, data };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error:
          error.response.data?.error ||
          error.response.data?.message ||
          "Error del servidor",
      };
    }
    return { success: false, error: "Error de red o del servidor" };
  }
};
