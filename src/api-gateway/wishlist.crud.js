import axios from "axios";
const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;
const base = API_GATEWAY?.endsWith("/") ? API_GATEWAY : `${API_GATEWAY}/`;

const pickMsg = (e) =>
  e?.response?.data?.message ||
  e?.response?.data?.error ||
  e?.message ||
  "Ocurrió un error";

export const addToWishlist = async ({ user_id, producto_talla_color_id}) => {
  const payload = { user_id, producto_talla_color_id: producto_talla_color_id };
  try {
    const { data, status } = await axios.post(`${base}wishlist/`, payload, {
      withCredentials: true,
    });
    return { success: true, data, status };
  } catch (e) {
    const status = e?.response?.status;
    const msg = pickMsg(e);
    console.warn("addToWishlist:", status, msg);
    return { success: false, error: msg, status };
  }
};

export const getWishlistByUser = async (userId) => {
  try {
    const { data, status } = await axios.get(`${base}wishlist/${userId}`, {
      withCredentials: true,
    });
    console.log(data)
    return { success: true, data, status };
  } catch (e) {
    return { success: false, error: pickMsg(e), status: e?.response?.status };
  }
};

export const removeFromWishlist = async (userId, productId) => {
  try {
    const { data, status } = await axios.delete(`${base}wishlist/${userId}/${productId}`, {
      withCredentials: true,
    });
    return { success: true, data, status };
  } catch (e) {
    return { success: false, error: pickMsg(e), status: e?.response?.status };
  }
};

export const clearWishlist = async (userId) => {
  try {
    const { data, status } = await axios.delete(`${base}wishlist/clear/${userId}`, {
      withCredentials: true,
    });
    return { success: true, data, status };
  } catch (e) {
    return { success: false, error: pickMsg(e), status: e?.response?.status };
  }
};
