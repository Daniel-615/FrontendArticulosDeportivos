import axios from "axios";
const API_GATEWAY = import.meta.env.VITE_API_GATEWAY; 

export const pay = async (items) => {
  const { data } = await axios.post(
    `${API_GATEWAY}stripe/checkout`,
    { items },
    { withCredentials: true }
  );
  if (!data?.url) throw new Error("No se recibió la URL de pago.");
  window.location.href = data.url;
};
