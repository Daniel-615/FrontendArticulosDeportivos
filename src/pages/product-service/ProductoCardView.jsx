import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContent.jsx"
import { getProductos } from "../../api-gateway/producto.crud.js"
import { addToCart } from "../../api-gateway/carrito.crud.js"
import { addToWishlist } from "../../api-gateway/wishlist.crud.js"
import { toast } from "react-toastify"

const ITEMS_PER_PAGE = 9

export default function ProductosCardView() {
  const [productos, setProductos] = useState([])
  const [error, setError] = useState(null)
  const { user } = useAuth()

  // Paginación
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Estados UI
  const [pendingWishlist, setPendingWishlist] = useState(new Set())
  const [pendingCart, setPendingCart] = useState(new Set())
  const [inWishlist, setInWishlist] = useState(new Set())

  // Estados de selección
  const [selectedColor, setSelectedColor] = useState({})
  const [selectedTalla, setSelectedTalla] = useState({})

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    ;(async () => {
      try {
        const response = await getProductos({ page, limit: ITEMS_PER_PAGE })
        if (response.success) {
          setProductos(response.data.productos || [])
          const totalItems = response.data.total || 0
          setTotalPages(Math.ceil(totalItems / ITEMS_PER_PAGE))
          setError(null)
        } else {
          setError(response.error || "No se pudieron cargar los productos.")
        }
      } catch (err) {
        setError("Error al cargar los productos.")
      }
    })()
  }, [page])

  // Filtrar productos según el término de búsqueda
  const productosFiltrados = productos.filter((producto) => {
    const term = searchTerm.toLowerCase()
    return (
      producto.nombre.toLowerCase().includes(term) ||
      (producto.descripcion && producto.descripcion.toLowerCase().includes(term)) ||
      (producto.categoria?.nombre && producto.categoria.nombre.toLowerCase().includes(term)) ||
      (producto.marca?.nombre && producto.marca.nombre.toLowerCase().includes(term))
    )
  })

  const addPending = (setter, id) => setter((prev) => new Set(prev).add(id))

  const removePending = (setter, id) =>
    setter((prev) => {
      const n = new Set(prev)
      n.delete(id)
      return n
    })

  const markInWishlist = (id) => setInWishlist((prev) => new Set(prev).add(id))

  const getProductoTallaColorId = (producto) => {
    const color = selectedColor[producto.id]
    const talla = selectedTalla[producto.id]
    if (!color || !talla) return null

    const ptc = color.tallas.find((t) => t.id === talla.id)
    return ptc?.id || null
  }

  const handleAddToCart = async (producto) => {
    if (!user?.id) {
      toast.error("Debes iniciar sesión para agregar productos al carrito.")
      return
    }
    if (pendingCart.has(producto.id)) return

    const ptc_id = getProductoTallaColorId(producto)
    if (!ptc_id) {
      toast.warning("Selecciona un color y una talla antes de añadir al carrito.")
      return
    }

    addPending(setPendingCart, producto.id)
    try {
      const resp = await addToCart({
        user_id: user.id,
        producto_talla_color_id: ptc_id,
        cantidad: 1,
      })

      if (resp.success) {
        toast.success(resp.data?.message || "Producto añadido al carrito.")
      } else {
        toast.error(resp.error || "No se pudo agregar al carrito.")
      }
    } catch {
      toast.error("Error inesperado al agregar al carrito.")
    } finally {
      removePending(setPendingCart, producto.id)
    }
  }

  const handleAddToWishlist = async (producto) => {
    if (!user?.id) {
      toast.error("Debes iniciar sesión para agregar productos a la wishlist.")
      return
    }
    if (pendingWishlist.has(producto.id) || inWishlist.has(producto.id)) return

    const ptc_id = getProductoTallaColorId(producto)
    if (!ptc_id) {
      toast.warning("Selecciona un color y una talla antes de añadir a la wishlist.")
      return
    }

    addPending(setPendingWishlist, producto.id)
    try {
      const resp = await addToWishlist({
        user_id: user.id,
        producto_talla_color_id: ptc_id,
      })

      if (resp.success) {
        toast.success(resp.data?.message || "Producto añadido a la wishlist.")
        markInWishlist(producto.id)
      } else {
        toast.info(resp.error || "Este producto ya está en la wishlist.")
        markInWishlist(producto.id)
      }
    } catch {
      toast.error("Error inesperado al agregar a la wishlist.")
    } finally {
      removePending(setPendingWishlist, producto.id)
    }
  }

  const handleColorChange = (productoId, color) => {
    setSelectedColor((prev) => ({ ...prev, [productoId]: color }))
    setSelectedTalla((prev) => ({ ...prev, [productoId]: null })) // reset talla
  }

  const handleTallaChange = (productoId, talla) => {
    setSelectedTalla((prev) => ({ ...prev, [productoId]: talla }))
  }

  // Funciones para paginación
  const handlePrevPage = () => {
    setPage((p) => Math.max(p - 1, 1))
  }

  const handleNextPage = () => {
    setPage((p) => Math.min(p + 1, totalPages))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-6 py-16 text-center">
          <h1 className="text-5xl font-black tracking-tight mb-4 text-balance">Nuestros Productos</h1>
          <p className="text-xl font-medium opacity-90 max-w-2xl mx-auto text-balance">
            Descubre la mejor selección de equipamiento deportivo
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Buscar productos deportivos..."
              className="w-full px-6 py-4 text-lg border-2 text-black border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productosFiltrados.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <p className="text-xl text-gray-500 font-medium">
                No se encontraron productos que coincidan con la búsqueda
              </p>
            </div>
          ) : (
            productosFiltrados.map((producto) => {
              const loadingWish = pendingWishlist.has(producto.id)
              const loadingCart = pendingCart.has(producto.id)
              const alreadyInWish = inWishlist.has(producto.id)
              const imagenId = selectedColor[producto.id]?.imagenUrl || producto.colores?.[0]?.imagenUrl || null

              return (
                <div
                  key={producto.id}
                  className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100"
                >
                  <button
                    onClick={() => handleAddToWishlist(producto)}
                    disabled={loadingWish || alreadyInWish}
                    className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      alreadyInWish
                        ? "bg-pink-500 text-white shadow-lg"
                        : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-pink-500 hover:text-white shadow-md"
                    } ${loadingWish ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {alreadyInWish ? "💖" : "🤍"}
                  </button>

                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                      src={imagenId || "/placeholder.svg?height=300&width=300&query=sports product"}
                      alt={producto.nombre}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 text-balance group-hover:text-blue-600 transition-colors duration-300">
                        {producto.nombre}
                      </h2>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-black text-blue-600">Q{producto.precio}</span>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-700">{producto.marca?.nombre}</p>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">{producto.categoria?.nombre}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{producto.descripcion}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Colores disponibles:</p>
                      <div className="flex gap-2 flex-wrap">
                        {producto.colores?.map((color) => (
                          <button
                            key={color.id}
                            onClick={() => handleColorChange(producto.id, color)}
                            className={`w-10 h-10 rounded-full border-4 transition-all duration-300 hover:scale-110 ${
                              selectedColor[producto.id]?.id === color.id
                                ? "border-blue-500 shadow-lg ring-2 ring-blue-200"
                                : "border-white shadow-md hover:border-gray-300"
                            }`}
                            style={{ backgroundColor: color.codigoHex }}
                          />
                        ))}
                      </div>
                    </div>

                    {selectedColor[producto.id] && (
                      <div className="mb-6">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Tallas disponibles:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedColor[producto.id].tallas?.map((talla) => (
                            <button
                              key={talla.id}
                              onClick={() => handleTallaChange(producto.id, talla)}
                              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                                selectedTalla[producto.id]?.id === talla.id
                                  ? "bg-blue-600 text-white shadow-lg ring-2 ring-blue-200"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              } ${talla.stock <= 0 ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
                              disabled={talla.stock <= 0}
                            >
                              {talla.valor}
                              <span className="ml-1 text-xs opacity-75">
                                ({talla.stock > 0 ? talla.stock : "Agotado"})
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAddToCart(producto)}
                        disabled={loadingCart}
                        className={`flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                          loadingCart ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      >
                        {loadingCart ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Añadiendo...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">🛒 Añadir al carrito</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="flex justify-center items-center gap-6 mt-16">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 border border-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </button>

          <div className="bg-white px-6 py-3 rounded-2xl shadow-lg border border-gray-200">
            <span className="font-semibold text-gray-700">
              Página <span className="text-blue-600">{page}</span> de{" "}
              <span className="text-blue-600">{totalPages}</span>
            </span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 border border-gray-200"
          >
            Siguiente
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
