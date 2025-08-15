import axios from "axios";

const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;
export const postColor = async (color) => {
  try {
    const response = await axios.post(
      `${API_GATEWAY}color/`,
      color,
      { withCredentials: true }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error:
          error.response.data.error ||
          error.response.data.message ||
          "Error del servidor",
      };
    }
    return { success: false, error: "Error de red o del servidor" };
  }
};
export const getColores = async () => {
  try {
    const response = await axios.get(`${API_GATEWAY}color/`, {
      withCredentials: true,
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error:
          error.response.data.error ||
          error.response.data.message ||
          "Error del servidor",
      };
    }
    return { success: false, error: "Error de red o del servidor" };
  }
};
export const getColorId = async (id) => {
  try {
    const response = await axios.get(`${API_GATEWAY}color/${id}`, {
      withCredentials: true,
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error:
          error.response.data.error ||
          error.response.data.message ||
          "Error del servidor",
      };
    }
    return { success: false, error: "Error de red o del servidor" };
  }
};
export const putColor = async (id, color) => {
  try {
    const response = await axios.put(
      `${API_GATEWAY}color/${id}`,
      color,
      { withCredentials: true }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error:
          error.response.data.error ||
          error.response.data.message ||
          "Error del servidor",
      };
    }
    return { success: false, error: "Error de red o del servidor" };
  }
};
