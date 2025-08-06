import axios from "axios";

const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;

export const createCategoria = async (categoria) => {
  try {
    const response = await axios.post(
      `${API_GATEWAY}categoria`,
      categoria,
      { withCredentials: true }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

export const getCategorias = async () => {
  try {
    const response = await axios.get(
      `${API_GATEWAY}categoria`,
      { withCredentials: true }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

export const getCategoriaById = async (id) => {
  try {
    const response = await axios.get(
      `${API_GATEWAY}categoria/${id}`,
      { withCredentials: true }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

export const updateCategoria = async (id, categoria) => {
  try {
    const response = await axios.put(
      `${API_GATEWAY}categoria/${id}`,
      categoria,
      { withCredentials: true }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteCategoria = async (id) => {
  try {
    const response = await axios.delete(
      `${API_GATEWAY}categoria/${id}`,
      { withCredentials: true }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

function handleError(error) {
  if (error.response) {
    return {
      success: false,
      error: error.response.data?.message || "Error del servidor",
    };
  }
  return {
    success: false,
    error: "Error de red o del servidor",
  };
}
