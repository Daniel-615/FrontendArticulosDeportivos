import axios from "axios";

const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;
const base = API_GATEWAY?.endsWith("/") ? API_GATEWAY : `${API_GATEWAY}/`;

// Helper para extraer mensaje y status
const parseError = (err) => ({
  status: err?.response?.status,
  message:
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Ocurrió un error",
});

// Agregar producto al carrito
export const addToCart = async (data) => {
  try {
    const { data: resData, status } = await axios.post(`${base}cart/`, data, {
      withCredentials: true,
    });
    console.log(data)
    return { success: true, data: resData?.data ?? resData, status };
  } catch (err) {
    const { status, message } = parseError(err);
    return { success: false, error: message, status };
  }
};

// Obtener carrito de un usuario
export const getCartByUser = async (userId) => {
  try {
    const { data, status } = await axios.get(`${base}cart/${userId}`, {
      withCredentials: true,
    });
    console.log(data)
    return { success: true, data: data?.data ?? data, status };
  } catch (err) {
    const { status, message } = parseError(err);
    return { success: false, error: message, status };
  }
};

// Actualizar cantidad de un producto en el carrito
export const updateCartItem = async (userId, productId, cantidad) => {
  try {
    const { data, status } = await axios.put(
      `${base}cart/${userId}/${productId}`,
      { cantidad },
      { withCredentials: true }
    );
    return { success: true, data, status };
  } catch (err) {
    const { status, message } = parseError(err);
    return { success: false, error: message, status };
  }
};

// Eliminar un producto del carrito
export const removeFromCart = async (userId, productId) => {
  try {
    const { data, status } = await axios.delete(`${base}cart/${userId}/${productId}`, {
      withCredentials: true,
    });
    return { success: true, data, status };
  } catch (err) {
    const { status, message } = parseError(err);
    return { success: false, error: message, status };
  }
};

// Vaciar carrito completo
export const clearCart = async (userId) => {
  try {
    const { data, status } = await axios.delete(`${base}cart/clear/${userId}`, {
      withCredentials: true,
    });
    return { success: true, data, status };
  } catch (err) {
    const { status, message } = parseError(err);
    return { success: false, error: message, status };
  }
};
