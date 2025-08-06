import { useEffect, useState } from "react";
import { getWishlistByUser, removeFromWishlist, clearWishlist } from "../api-gateway/wishlist.crud.js";
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

  const handleRemove = async (productId) => {
    const response = await removeFromWishlist(user.id, productId);
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
            {wishlist.map((item) => (
              <li key={item.producto.id} className="bg-white p-4 shadow rounded-md">
                <h2 className="text-xl font-semibold">{item.producto.nombre}</h2>
                <p>Precio: Q{item.producto.precio}</p>
                <button
                  onClick={() => handleRemove(item.producto.id)}
                  className="mt-2 text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </li>
            ))}
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
