import axios from "axios";

const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;

export const createMarca = async (marca) => {
  try {
    const response = await axios.post(
      `${API_GATEWAY}marca`,
      marca,
      { withCredentials: true }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

export const getMarcas = async () => {
  try {
    const response = await axios.get(
      `${API_GATEWAY}marca`,
      { withCredentials: true }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

export const getMarcaById = async (id) => {
  try {
    const response = await axios.get(
      `${API_GATEWAY}marca/${id}`,
      { withCredentials: true }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

export const updateMarca = async (id, marca) => {
  try {
    const response = await axios.put(
      `${API_GATEWAY}marca/${id}`,
      marca,
      { withCredentials: true }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteMarca = async (id) => {
  try {
    const response = await axios.delete(
      `${API_GATEWAY}marca/${id}`,
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
