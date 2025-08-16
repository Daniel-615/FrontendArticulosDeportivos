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

  // Estados UI
  const [pendingWishlist, setPendingWishlist] = useState(new Set());
  const [pendingCart, setPendingCart] = useState(new Set());
  const [inWishlist, setInWishlist] = useState(new Set()); 

  useEffect(() => {
    (async () => {
      const response = await getProductos();
      if (response.success) {
        setProductos(response.data.productos || []);
      } else {
        setError(response.error || "No se pudieron cargar los productos.");
      }
    })();
  }, []);

  const addPending = (setter, id) =>
    setter((prev) => {
      const n = new Set(prev);
      n.add(id);
      return n;
    });

  const removePending = (setter, id) =>
    setter((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });

  const markInWishlist = (id) =>
    setInWishlist((prev) => {
      const n = new Set(prev);
      n.add(id);
      return n;
    });

  const handleAddToCart = async (productoId) => {
    if (!user?.id) {
      toast.error("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }
    if (pendingCart.has(productoId)) return;

    addPending(setPendingCart, productoId);
    try {
      const resp = await addToCart({
        user_id: user.id,
        product_id: productoId,
        cantidad: 1,
      });

      if (resp.success) {
        toast.success(resp.data?.message || "Producto añadido al carrito.");
      } else if (resp.status === 400 || resp.status === 409) {
        // por si el backend avisa que ya estaba en el carrito
        toast.info(resp.error || "Este producto ya está en el carrito.");
      } else if (resp.status === 401 || resp.status === 403) {
        toast.error("No autorizado. Inicia sesión nuevamente.");
      } else {
        toast.error(resp.error || "No se pudo agregar al carrito.");
      }
    } catch {
      toast.error("Error inesperado al agregar al carrito.");
    } finally {
      removePending(setPendingCart, productoId);
    }
  };

  const handleAddToWishlist = async (productoId) => {
    if (!user?.id) {
      toast.error("Debes iniciar sesión para agregar productos a la wishlist.");
      return;
    }
    if (pendingWishlist.has(productoId) || inWishlist.has(productoId)) return;

    addPending(setPendingWishlist, productoId);

    try {
      const resp = await addToWishlist({ user_id: user.id, producto_id: productoId });

      if (resp.success) {
        toast.success(resp.data?.message || "Producto añadido a la wishlist.");
        markInWishlist(productoId);
      } else if (resp.status === 400 || resp.status === 409) {
        // duplicado: muestra mensaje y marca como ya agregado
        toast.info(resp.error || "Este producto ya está en la wishlist.");
        markInWishlist(productoId);
      } else if (resp.status === 401 || resp.status === 403) {
        toast.error("No autorizado. Inicia sesión nuevamente.");
      } else {
        toast.error(resp.error || "No se pudo agregar a la wishlist.");
      }
    } catch {
      toast.error("Error inesperado al agregar a la wishlist.");
    } finally {
      removePending(setPendingWishlist, productoId);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Nuestros Productos</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map((producto) => {
          const loadingWish = pendingWishlist.has(producto.id);
          const loadingCart = pendingCart.has(producto.id);
          const alreadyInWish = inWishlist.has(producto.id);
          const imagenId = producto.colores?.[0]?.imagenUrl || null;

          return (
            <div
              key={producto.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105"
            >
              <div className="p-4">
                <img
                  src={imagenId}
                  alt={producto.nombre}
                  className="w-full h-48 object-cover text-black"
                />

                <h2 className="text-xl font-semibold text-gray-800 mb-2">{producto.nombre}</h2>
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
                  disabled={loadingCart}
                  className={`bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded ${
                    loadingCart ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {loadingCart ? "Añadiendo..." : "🛒 Añadir al carrito"}
                </button>

                <button
                  onClick={() => handleAddToWishlist(producto.id)}
                  disabled={loadingWish || alreadyInWish}
                  className={`text-white text-sm px-3 py-1 rounded ${
                    alreadyInWish ? "bg-pink-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700"
                  } ${loadingWish ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {alreadyInWish ? "💟 En wishlist" : loadingWish ? "Enviando..." : "❤️ Wishlist"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}