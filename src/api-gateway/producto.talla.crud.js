import axios from "axios";

const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;
const BASE = `${API_GATEWAY}producto-talla`;

export const createProductoTalla = async (payload) => {
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
export const getProductoTallas = async () => {
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
export const getProductoTallaById = async (id) => {
  try {
    const { data } = await axios.get(`${BASE}/${id}`, {
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

export const updateProductoTalla = async (id, payload) => {
  try {
    const { data } = await axios.put(`${BASE}/${id}`, payload, {
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
export const deleteProductoTalla = async (id) => {
  try {
    const { data } = await axios.delete(`${BASE}/${id}`, {
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
