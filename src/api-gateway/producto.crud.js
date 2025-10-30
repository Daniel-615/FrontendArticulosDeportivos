import axios from 'axios';

const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;

export const createProducto = async (producto) => {
  try {
    const response = await axios.post(
      `${API_GATEWAY}product`,
      producto,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        } 
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

export const getProductos = async () => {
  try {
    const response = await axios.get(
      `${API_GATEWAY}product`,
      { withCredentials: true ,
        params: { page, limit },
      },
      
    );
    return { success: true, data: response.data };
  } catch (error) {

    return handleError(error);
  }
};

export const getProductoId = async (id) => {
  try {
    const response = await axios.get(
      `${API_GATEWAY}product/${id}`,
      { withCredentials: true }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

export const updateProducto = async (id, producto) => {
  try {
    const response = await axios.put(
      `${API_GATEWAY}product/${id}`,
      producto,
      { withCredentials: true }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteProducto = async (id) => {
  try {
    const response = await axios.delete(
      `${API_GATEWAY}product/${id}`,
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
      error: error.response.data?.error || "Error del servidor",
    };
  }
  return {
    success: false,
    error: "Error de red o del servidor",
  };
}
