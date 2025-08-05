import axios from 'axios';

const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;

// Agregar producto a la wishlist
export const addToWishlist = async (data) => {
  try {
    const response = await axios.post(`${API_GATEWAY}wishlist/`, data, {
      withCredentials: true,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Error al agregar a la wishlist',
    };
  }
};

// Obtener wishlist de un usuario
export const getWishlistByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_GATEWAY}wishlist/${userId}`, {
      withCredentials: true,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Error al obtener la wishlist',
    };
  }
};

// Eliminar un producto de la wishlist
export const removeFromWishlist = async (userId, productId) => {
  try {
    const response = await axios.delete(`${API_GATEWAY}wishlist/${userId}/${productId}`, {
      withCredentials: true,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Error al eliminar de la wishlist',
    };
  }
};

// Vaciar wishlist completa
export const clearWishlist = async (userId) => {
  try {
    const response = await axios.delete(`${API_GATEWAY}wishlist/clear/${userId}`, {
      withCredentials: true,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Error al vaciar la wishlist',
    };
  }
};
