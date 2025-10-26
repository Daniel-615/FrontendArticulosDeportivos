
import axios from "axios";
const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;

export const pay = async ({
  userId,
  nit,
  items,
  direccion_destino,  
  costo_envio,         
  fecha_estimada,      
}) => {
  if (!userId) throw new Error("Falta userId.");
  if (!nit) throw new Error("Falta NIT (use CF si no desea facturar).");
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("No hay items para pagar.");
  }

  const base = API_GATEWAY?.endsWith("/") ? API_GATEWAY.slice(0, -1) : API_GATEWAY;


  const { data } = await axios.post(
    `${base}/stripe/checkout`,
    {
      userId,
      nit,
      items,
      direccion_destino,
      costo_envio,
      fecha_estimada,
    },
    { withCredentials: true }
  );

  if (!data?.url) throw new Error("No se recibió la URL de pago.");
  window.location.href = data.url;
};
