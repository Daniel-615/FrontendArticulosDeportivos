"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext.jsx"
import { getProductos } from "../../api-gateway/producto.crud.js"
import { addToCart } from "../../api-gateway/carrito.crud.js"
import { addToWishlist } from "../../api-gateway/wishlist.crud.js"
import { toast } from "react-toastify"
import { getImageUrl } from "../../utils/imageHelper.js"

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
    <div className="min-h-screen bg-black">
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">PRODUCTOS</h1>
          <p className="text-white/60 text-xs sm:text-sm tracking-wider uppercase">Equipamiento deportivo de calidad</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="BUSCAR PRODUCTOS..."
              className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/40 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 p-3 text-white mb-8 text-center text-sm">{error}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {productosFiltrados.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-white/60 text-sm uppercase tracking-wide">No se encontraron productos</p>
            </div>
          ) : (
            productosFiltrados.map((producto) => {
              const loadingWish = pendingWishlist.has(producto.id)
              const loadingCart = pendingCart.has(producto.id)
              const alreadyInWish = inWishlist.has(producto.id)
              const imagenPath = selectedColor[producto.id]?.imagenUrl || producto.colores?.[0]?.imagenUrl || null
              const imagenUrl = getImageUrl(
                imagenPath,
                `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(producto.nombre || "sports product")}`,
              )

              return (
                <div
                  key={producto.id}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden hover:border-white/40 transition-colors"
                >
                  <div className="relative">
                    <img
                      src={imagenUrl || "/placeholder.svg"}
                      alt={producto.nombre}
                      className="w-full h-48 sm:h-64 object-cover"
                      onError={(e) => {
                        e.target.src = `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(producto.nombre || "sports product")}`
                      }}
                    />
                    <button
                      onClick={() => handleAddToWishlist(producto)}
                      disabled={loadingWish || alreadyInWish}
                      className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center transition-all border ${
                        alreadyInWish
                          ? "bg-black text-white border-black"
                          : "bg-black/80 backdrop-blur-sm text-white hover:bg-black border-black/80 hover:border-black"
                      } ${loadingWish ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      {alreadyInWish ? "♥" : "♡"}
                    </button>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="mb-4">
                      <h2 className="text-lg sm:text-xl font-bold text-white mb-2 uppercase tracking-tight break-words">
                        {producto.nombre}
                      </h2>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                        <span className="text-xl sm:text-2xl font-black text-white">Q{producto.precio}</span>
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-semibold text-white/80">{producto.marca?.nombre}</p>
                          <p className="text-xs text-white/60 uppercase tracking-wide">{producto.categoria?.nombre}</p>
                        </div>
                      </div>
                      <p className="text-white/60 text-sm leading-relaxed line-clamp-2">{producto.descripcion}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-white/60 mb-2 uppercase tracking-wide">Colores</p>
                      <div className="flex gap-2 flex-wrap">
                        {producto.colores?.map((color) => (
                          <button
                            key={color.id}
                            onClick={() => handleColorChange(producto.id, color)}
                            className={`w-8 h-8 border-2 transition-colors ${
                              selectedColor[producto.id]?.id === color.id
                                ? "border-white"
                                : "border-white/20 hover:border-white/40"
                            }`}
                            style={{ backgroundColor: color.codigoHex }}
                            aria-label={`Color ${color.nombre || color.codigoHex}`}
                          />
                        ))}
                      </div>
                    </div>

                    {selectedColor[producto.id] && (
                      <div className="mb-6">
                        <p className="text-xs text-white/60 mb-2 uppercase tracking-wide">Tallas</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedColor[producto.id].tallas?.map((talla) => (
                            <button
                              key={talla.id}
                              onClick={() => handleTallaChange(producto.id, talla)}
                              className={`px-3 py-1 text-sm font-semibold transition-colors ${
                                selectedTalla[producto.id]?.id === talla.id
                                  ? "bg-white text-black"
                                  : "bg-white/5 border border-white/20 text-white hover:bg-white/10"
                              } ${talla.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                              disabled={talla.stock <= 0}
                            >
                              {talla.valor}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleAddToCart(producto)}
                      disabled={loadingCart}
                      className={`w-full bg-white text-black px-4 py-3 font-bold hover:bg-white/90 transition-colors tracking-wide text-sm sm:text-base ${
                        loadingCart ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    >
                      {loadingCart ? "AÑADIENDO..." : "AÑADIR AL CARRITO"}
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-8 sm:mt-12">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
          >
            ANTERIOR
          </button>

          <div className="text-white/60 text-sm uppercase tracking-wide">
            Página {page} de {totalPages}
          </div>

          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/20 text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
          >
            SIGUIENTE
          </button>
        </div>
      </div>
    </div>
  )
}
