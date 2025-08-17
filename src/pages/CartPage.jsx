import { useEffect, useState } from "react";
import {
  getCartByUser,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../api-gateway/carrito.crud.js";
import { useAuth } from "../context/AuthContent.jsx";

export default function CartPage() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);

  const loadCart = async () => {
    try {
      const response = await getCartByUser(user.id);
      if (response.success) {
        setCartItems(response.data || []);
        setError(null);
      } else {
        setCartItems([]);
        setError(response.error || "No se pudo cargar el carrito.");
      }
    } catch {
      setCartItems([]);
      setError("Error inesperado al obtener el carrito.");
    }
  };

  useEffect(() => {
    if (user) loadCart();
  }, [user]);

  const handleUpdate = async (ptc_id, cantidad) => {
    if (cantidad < 1) return;
    const response = await updateCartItem(user.id, ptc_id, cantidad);
    if (response.success) loadCart();
    else setError(response.error || "No se pudo actualizar la cantidad.");
  };

  const handleRemove = async (ptc_id) => {
    const response = await removeFromCart(user.id, ptc_id);
    if (response.success) loadCart();
    else setError(response.error || "No se pudo eliminar el producto.");
  };

  const handleClear = async () => {
    const response = await clearCart(user.id);
    if (response.success) loadCart();
    else setError(response.error || "No se pudo vaciar el carrito.");
  };

  return (
    <div className="p-6 text-white min-h-screen bg-zinc-900">
      <h1 className="text-3xl font-bold mb-6">Carrito de Compras</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-900 text-red-300 border border-red-500 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {Array.isArray(cartItems) && cartItems.length === 0 ? (
        <p className="text-lg text-zinc-300">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="bg-zinc-800 p-4 rounded-md shadow-md border border-zinc-700"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.producto?.productoColor?.imagenUrl || 'https://via.placeholder.com/80'}
                    alt={item.producto?.nombre || 'Producto'}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-blue-400">
                      {item.producto?.productoColor?.producto.nombre || "Producto no disponible"}
                    </h2>
                    <p className="text-zinc-300">
                      Precio:{" "}
                      <span className="font-medium">
                        Q{item.producto?.productoColor?.producto.precio ?? "0"}
                      </span>
                    </p>
                    <p className="text-zinc-300">
                      Talla:{" "}
                      <span className="font-medium">
                        {item.producto.tallaInfo?.valor || "No disponible"}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) =>
                        handleUpdate(item.producto_talla_color_id, parseInt(e.target.value))
                      }
                      className="w-20 px-2 py-1 rounded bg-zinc-700 text-white border border-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      onClick={() => handleRemove(item.producto_talla_color_id)}
                      className="text-red-500 hover:text-red-400 hover:underline transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={handleClear}
            className="mt-8 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md shadow-md transition"
          >
            Vaciar Carrito
          </button>
        </>
      )}
    </div>
  );
}
