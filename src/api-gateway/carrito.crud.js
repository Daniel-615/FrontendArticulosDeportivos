import axios from 'axios';

const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;

// Agregar producto al carrito
export const addToCart = async (data) => {
  try {
    const response = await axios.post(`${API_GATEWAY}cart/`, data, {
      withCredentials: true,
    });
    return { success: true, data: response.data.data };
    
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || 'Error al agregar al carrito',
    };
  }
};

// Obtener carrito de un usuario
export const getCartByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_GATEWAY}cart/${userId}`, {
      withCredentials: true,
    });
    return { success: true, data: response.data.data };

  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Error al obtener el carrito',
    };
  }
};

// Actualizar cantidad de un producto en el carrito
export const updateCartItem = async (userId, productId, cantidad) => {
  try {
    const response = await axios.put(
      `${API_GATEWAY}cart/${userId}/${productId}`,
      { cantidad },
      { withCredentials: true }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Error al actualizar el carrito',
    };
  }
};

// Eliminar un producto del carrito
export const removeFromCart = async (userId, productId) => {
  try {
    const response = await axios.delete(`${API_GATEWAY}cart/${userId}/${productId}`, {
      withCredentials: true,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Error al eliminar del carrito',
    };
  }
};

// Vaciar carrito completo
export const clearCart = async (userId) => {
  try {
    const response = await axios.delete(`${API_GATEWAY}cart/clear/${userId}`, {
      withCredentials: true,
    });
    console.log(response)
    return { success: true, data: response.data };
  } catch (error) {
    console.log(error)
    return {
      success: false,
      error: error.response?.data?.error || 'Error al vaciar el carrito',
    };
  }
};
