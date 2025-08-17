import axios from "axios";

const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;
const BASE = `${API_GATEWAY}producto-color`;

const toFormData = (payload = {}) => {
  if (payload instanceof FormData) return payload; 
  const form = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, v);
  });
  return form;
};


export const createProductoColor = async (payload) => {
  try {
    const form = toFormData(payload);
    const { data } = await axios.post(`${BASE}/`, form, {
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

export const getProductoColores = async () => {
  try {
    const { data } = await axios.get(`${BASE}/`, {
      withCredentials: true,
    });
    console.log(data)
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

// Obtener color de producto por ID
export const getProductoColorById = async (id) => {
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
export const updateProductoColor = async (id, payload) => {
  try {
    const form = toFormData(payload); 
    const { data } = await axios.put(`${BASE}/${id}`, form, {
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
export const deleteProductoColor = async (id) => {
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
