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

  // Estados de selección
  const [selectedColor, setSelectedColor] = useState({});
  const [selectedTalla, setSelectedTalla] = useState({});

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
    setter((prev) => new Set(prev).add(id));

  const removePending = (setter, id) =>
    setter((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });

  const markInWishlist = (id) =>
    setInWishlist((prev) => new Set(prev).add(id));

  const getProductoTallaColorId = (producto) => {
    const color = selectedColor[producto.id];
    const talla = selectedTalla[producto.id];
    if (!color || !talla) return null;

    // Busca el objeto talla dentro del color seleccionado
    const ptc = color.tallas.find((t) => t.id === talla.id);
    return ptc?.id || null;
  };

  const handleAddToCart = async (producto) => {
    if (!user?.id) {
      toast.error("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }
    if (pendingCart.has(producto.id)) return;

    const ptc_id = getProductoTallaColorId(producto);
    if (!ptc_id) {
      toast.warning("Selecciona un color y una talla antes de añadir al carrito.");
      return;
    }

    addPending(setPendingCart, producto.id);
    try {
      const resp = await addToCart({
        user_id: user.id,
        producto_talla_color_id: ptc_id,
        cantidad: 1,
      });

      if (resp.success) {
        toast.success(resp.data?.message || "Producto añadido al carrito.");
      } else {
        toast.error(resp.error || "No se pudo agregar al carrito.");
      }
    } catch {
      toast.error("Error inesperado al agregar al carrito.");
    } finally {
      removePending(setPendingCart, producto.id);
    }
  };

  const handleAddToWishlist = async (producto) => {
    if (!user?.id) {
      toast.error("Debes iniciar sesión para agregar productos a la wishlist.");
      return;
    }
    if (pendingWishlist.has(producto.id) || inWishlist.has(producto.id)) return;

    const ptc_id = getProductoTallaColorId(producto);
    if (!ptc_id) {
      toast.warning("Selecciona un color y una talla antes de añadir a la wishlist.");
      return;
    }
    
    addPending(setPendingWishlist, producto.id);
    try {
      const resp = await addToWishlist({
        user_id: user.id,
        producto_talla_color_id: ptc_id,
      });

      if (resp.success) {
        toast.success(resp.data?.message || "Producto añadido a la wishlist.");
        markInWishlist(producto.id);
      } else {
        toast.info(resp.error || "Este producto ya está en la wishlist.");
        markInWishlist(producto.id);
      }
    } catch {
      toast.error("Error inesperado al agregar a la wishlist.");
    } finally {
      removePending(setPendingWishlist, producto.id);
    }
  };

  const handleColorChange = (productoId, color) => {
    setSelectedColor((prev) => ({ ...prev, [productoId]: color }));
    setSelectedTalla((prev) => ({ ...prev, [productoId]: null })); // reset talla
  };

  const handleTallaChange = (productoId, talla) => {
    setSelectedTalla((prev) => ({ ...prev, [productoId]: talla }));
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
          const imagenId =
            selectedColor[producto.id]?.imagenUrl ||
            producto.colores?.[0]?.imagenUrl ||
            null;

          return (
            <div key={producto.id} className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105">
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
                <p className="text-gray-500 text-sm mt-2 italic">{producto.descripcion}</p>
                <p className="text-gray-600 text-sm mb-1">Marca: {producto.marca?.nombre}</p>
                <p className="text-gray-600 text-sm mb-1">Categoría: {producto.categoria?.nombre}</p>
              </div>

              {/* Colores */}
              <div className="px-4 py-2 flex gap-2">
                {producto.colores?.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorChange(producto.id, color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor[producto.id]?.id === color.id
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.codigoHex }}
                  />
                ))}
              </div>

              {/* Tallas */}
              {selectedColor[producto.id] && (
                <div className="px-4 py-2 flex flex-wrap gap-2">
                  {selectedColor[producto.id].tallas?.map((talla) => (
                    <button
                      key={talla.id}
                      onClick={() => handleTallaChange(producto.id, talla)}
                      className={`px-3 py-1 rounded border text-sm ${
                        selectedTalla[producto.id]?.id === talla.id
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-800 border-gray-300"
                      }`}
                      disabled={talla.stock <= 0}
                    >
                      {talla.valor}{" "}
                      <span className="text-xs text-gray-500">
                        ({talla.stock > 0 ? `Stock: ${talla.stock}` : "Agotado"})
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className="bg-gray-50 px-4 py-2 flex justify-between items-center gap-2">
                <button
                  onClick={() => handleAddToCart(producto)}
                  disabled={loadingCart}
                  className={`bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded ${
                    loadingCart ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {loadingCart ? "Añadiendo..." : "🛒 Añadir al carrito"}
                </button>

                <button
                  onClick={() => handleAddToWishlist(producto)}
                  disabled={loadingWish || alreadyInWish}
                  className={`text-white text-sm px-3 py-1 rounded ${
                    alreadyInWish
                      ? "bg-pink-400 cursor-not-allowed"
                      : "bg-pink-600 hover:bg-pink-700"
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
