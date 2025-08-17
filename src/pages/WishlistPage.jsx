import { useEffect, useState } from "react";
import {
  getWishlistByUser,
  removeFromWishlist,
  clearWishlist,
} from "../api-gateway/wishlist.crud.js";
import { useAuth } from "../context/AuthContent.jsx";

export default function WishlistPage() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState(null);

  const loadWishlist = async () => {
    const response = await getWishlistByUser(user.id);
    if (response.success) {
      setWishlist(response.data);
    } else {
      setError(response.error);
    }
  };

  useEffect(() => {
    if (user) loadWishlist();
  }, [user]);

  const handleRemove = async (ptcId) => {
    const response = await removeFromWishlist(user.id, ptcId);
    if (response.success) loadWishlist();
    else alert(response.error);
  };

  const handleClear = async () => {
    const response = await clearWishlist(user.id);
    if (response.success) setWishlist([]);
    else alert(response.error);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Wishlist</h1>
      {error && <p className="text-red-500">{error}</p>}
      {wishlist.length === 0 ? (
        <p>No tienes productos en tu lista de deseos.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {wishlist.map((item) => {
              const ptc = item.producto; // ProductoTallaColor
              if (!ptc) return null;

              const producto = ptc.productoColor?.producto;
              const color = ptc.productoColor?.colorInfo?.codigoHex;
              const talla = ptc.tallaInfo?.valor;

              return (
                <li
                  key={ptc.id}
                  className="bg-white p-4 shadow rounded-md flex items-center gap-4"
                >
                  {/* Imagen del producto */}
                  {ptc.productoColor?.imagenUrl && (
                    <img
                      src={ptc.productoColor.imagenUrl}
                      alt={producto?.nombre}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}

                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-black">
                      {producto?.nombre}
                    </h2>
                    <p className="text-black">Precio: Q{producto?.precio}</p>

                    {color && (
                      <p className="text-gray-600">
                        Color:
                        <span
                          className="inline-block w-4 h-4 rounded-full border ml-1 align-middle"
                          style={{ backgroundColor: color }}
                        ></span>
                      </p>
                    )}

                    {talla && (
                      <p className="text-gray-600">Talla: {talla}</p>
                    )}

                    <button
                      onClick={() => handleRemove(ptc.id)}
                      className="mt-2 text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <button
            onClick={handleClear}
            className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Vaciar Wishlist
          </button>
        </>
      )}
    </div>
  );
}
