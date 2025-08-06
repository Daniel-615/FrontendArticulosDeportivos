import { useEffect, useState } from "react";
import { getProductos } from "../../api-gateway/producto.crud.js";
import { addToCart } from "../../api-gateway/carrito.crud.js";
import { addToWishlist } from "../../api-gateway/wishlist.crud.js";
import { useAuth } from "../../context/AuthContent.jsx";
import { toast } from "react-toastify";

export default function ProductosCardView() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    const response = await getProductos();
    if (response.success) {
      setProductos(response.data.productos);
    } else {
      setError(response.error || "No se pudieron cargar los productos.");
    }
  };

  const handleAddToCart = async (productoId) => {
    if (!user?.id) {
      toast.error("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }

    try {
      const response = await addToCart({
        user_id: user.id,
        product_id: productoId,
        cantidad: 1,
      });

      if (response.success) {
        toast.success("✅ Producto añadido al carrito.");
      } else {
        toast.error(response.error || "❌ No se pudo agregar al carrito.");
      }
    } catch (err) {
      toast.error("❌ Error inesperado al agregar al carrito.");
    }
  };

  const handleAddToWishlist = async (productoId) => {
    if (!user?.id) {
      toast.error("Debes iniciar sesión para agregar productos a la wishlist.");
      return;
    }

    try {
      const response = await addToWishlist({
        user_id: user.id,
        producto_id:productoId,
      });

      if (response.success) {
        toast.success("Producto añadido a la wishlist.");
      } else {
        toast.error(response.error || "No se pudo agregar a la wishlist.");
      }
    } catch (err) {
      toast.error("Error inesperado al agregar a la wishlist.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Nuestros Productos
      </h1>

      {error && (
        <p className="text-red-500 text-center mb-4">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105"
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {producto.nombre}
              </h2>
              <p className="text-gray-600 text-sm mb-1">
                Precio: <strong>Q{producto.precio}</strong>
              </p>
              <p className="text-gray-600 text-sm mb-1">Stock: {producto.stock}</p>
              <p className="text-gray-500 text-sm mt-2 italic">{producto.descripcion}</p>
              <p className="text-gray-600 text-sm mb-1">Marca: {producto.marca?.nombre}</p>
              <p className="text-gray-600 text-sm mb-1">Categoría: {producto.categoria?.nombre}</p>
            </div>
            <div className="bg-gray-50 px-4 py-2 flex justify-between items-center gap-2">
              <button
                onClick={() => handleAddToCart(producto.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
              >
                🛒 Añadir al carrito
              </button>
              <button
                onClick={() => handleAddToWishlist(producto.id)}
                className="bg-pink-600 hover:bg-pink-700 text-white text-sm px-3 py-1 rounded"
              >
                ❤️ Wishlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
