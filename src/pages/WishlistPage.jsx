import { useEffect, useState } from "react"
import {
  getWishlistByUser,
  removeFromWishlist,
  clearWishlist,
  createOrRefreshWishlistShare,   
  revokeWishlistShare             
} from "../api-gateway/wishlist.crud.js"
import { useAuth } from "../context/AuthContent.jsx"
import { Heart, Trash2, ShoppingBag, Star, ArrowRight, Share2, Copy, RefreshCw, ShieldX } from "lucide-react" // 👈 NUEVOS ICONOS
import { useNavigate } from "react-router-dom";
import { addToCart } from "../api-gateway/carrito.crud.js";
import { toast } from "react-toastify";

export default function WishlistPage() {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const [shareLink, setShareLink] = useState("")
  const [sharing, setSharing] = useState(false)
  const [revoking, setRevoking] = useState(false)

  const navigate = useNavigate();

  const loadWishlist = async () => {
    setLoading(true)
    const response = await getWishlistByUser(user.id)
    if (response.success) {
      setWishlist(response.data)
      setError(null)
    } else {
      setError(response.error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (user) loadWishlist()
  }, [user])

  const handleRemove = async (ptcId) => {
    const response = await removeFromWishlist(user.id, ptcId)
    if (response.success) loadWishlist()
    else toast.error(response.error || "No se pudo eliminar de la wishlist.")
  }

  const handleClear = async () => {
    const response = await clearWishlist(user.id)
    if (response.success) setWishlist([])
    else toast.error(response.error || "No se pudo vaciar la wishlist.")
  }

  const handleMoveToCart = async (ptc) => {
    if (!user?.id) {
      toast.error("Debes iniciar sesión para mover el producto al carrito.");
      return;
    }
    try {
      const response = await addToCart({
        user_id: user.id,
        producto_talla_color_id: ptc.id,
        cantidad: 1,
      });
      if (response.success) {
        toast.success("Producto movido al carrito.");
        await handleRemove(ptc.id);
      } else {
        toast.error(response.error || "No se pudo mover al carrito.");
      }
    } catch (err) {
      toast.error("Error inesperado al mover al carrito.");
    }
  };

  // =================== COMPARTIR WISHLIST ===================

  const handleCreateOrRefreshShare = async (opts = { expiresInHours: 72, forceRefresh: false }) => {
    if (!user?.id) {
      toast.error("Debes iniciar sesión.");
      return;
    }
    try {
      setSharing(true)
      const { success, data, error } = await createOrRefreshWishlistShare(user.id, opts)
      if (!success) throw new Error(error || "No se pudo generar el enlace.")
      const url = data?.url
      setShareLink(url || "")
      if (url && navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        toast.success("Enlace generado y copiado al portapapeles.")
      } else {
        toast.success("Enlace generado.")
      }
    } catch (e) {
      toast.error(e?.message || "No se pudo generar el enlace.")
    } finally {
      setSharing(false)
    }
  }

  const handleCopyShareLink = async () => {
    if (!shareLink) {
      toast.info("Primero genera el enlace de la wishlist.")
      return
    }
    try {
      await navigator.clipboard.writeText(shareLink)
      toast.success("Enlace copiado ")
    } catch {
      toast.error("No se pudo copiar el enlace.")
    }
  }

  const handleRevokeShare = async () => {
    if (!user?.id) {
      toast.error("Debes iniciar sesión.")
      return;
    }
    try {
      setRevoking(true)
      const { success, error } = await revokeWishlistShare(user.id)
      if (!success) throw new Error(error || "No se pudo revocar el enlace.")
      setShareLink("")
      toast.success("Enlace revocado.")
    } catch (e) {
      toast.error(e?.message || "No se pudo revocar el enlace.")
    } finally {
      setRevoking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-400/30 border-t-blue-400"></div>
              <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 bg-transparent border-4 border-transparent border-t-white/20"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* FONDO */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-2xl shadow-2xl">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-yellow-800 fill-current" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent mb-2">
                Mi Lista de Deseos
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mx-auto"></div>
            </div>
          </div>
          <p className="text-blue-100/80 text-xl max-w-3xl mx-auto leading-relaxed">
            Tus productos deportivos favoritos en un solo lugar. Mantén el control de lo que más deseas.
          </p>
        </div>

        {/* ====== BLOQUE COMPARTIR ====== */}
        {user && (
          <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl p-5 mb-10 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <button
                onClick={() => handleCreateOrRefreshShare({ expiresInHours: 72, forceRefresh: false })}
                disabled={sharing}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all disabled:opacity-60"
              >
                <Share2 className="w-5 h-5" />
                {sharing ? "Generando…" : "Compartir wishlist"}
              </button>

              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  placeholder="Genera el enlace para compartir…"
                  className="flex-1 px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-blue-100/50"
                />
                <button
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <Copy className="w-5 h-5" /> Copiar
                </button>
                <button
                  onClick={() => handleCreateOrRefreshShare({ expiresInHours: 72, forceRefresh: true })}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors"
                  title="Rotar enlace"
                >
                  <RefreshCw className="w-5 h-5" /> Refrescar
                </button>
                <button
                  onClick={handleRevokeShare}
                  disabled={revoking}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold bg-rose-600/80 text-white hover:bg-rose-600 transition-colors disabled:opacity-60"
                >
                  <ShieldX className="w-5 h-5" />
                  {revoking ? "Revocando…" : "Revocar"}
                </button>
              </div>
            </div>
            <p className="text-blue-100/70 text-sm mt-3">
              El enlace es <span className="font-semibold">público y de solo lectura</span>. Puedes revocarlo en cualquier momento.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-6 mb-8 backdrop-blur-sm">
            <p className="text-red-200 font-semibold text-center">{error}</p>
          </div>
        )}

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl flex items-center justify-center shadow-2xl">
                <Heart className="w-16 h-16 text-gray-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-white text-xs font-bold">0</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Tu lista de deseos está vacía</h3>
            <p className="text-blue-100/70 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
              Descubre nuestra increíble colección deportiva y guarda tus productos favoritos para no perderlos de vista
            </p>
            <button 
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
              onClick={() => navigate("/producto/")}
            >
              <ShoppingBag className="w-6 h-6" />
              Explorar Productos
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-8">
              {wishlist.map((item, index) => {
                const ptc = item.producto
                if (!ptc) return null

                const producto = ptc.productoColor?.producto
                const color = ptc.productoColor?.colorInfo?.codigoHex
                const talla = ptc.tallaInfo?.valor

                return (
                  <div
                    key={ptc.id}
                    className="group bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-700 overflow-hidden border border-white/10 hover:border-blue-400/30 transform hover:-translate-y-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col lg:flex-row">
                      <div className="lg:w-80 h-80 lg:h-64 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        {ptc.productoColor?.imagenUrl ? (
                          <img
                            src={ptc.productoColor.imagenUrl || "/placeholder.svg"}
                            alt={producto?.nombre}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                            <ShoppingBag className="w-20 h-20 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <Heart className="w-5 h-5 text-white fill-current" />
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 p-8 lg:p-10">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex-1">
                            <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                              {producto?.nombre}
                            </h2>
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                Q{producto?.precio}
                              </span>
                              <div className="px-3 py-1 bg-green-500/20 rounded-full">
                                <span className="text-green-300 text-sm font-semibold">En Stock</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-6 mb-8">
                          {color && (
                            <div className="flex items-center gap-3">
                              <span className="text-blue-200 font-semibold">Color:</span>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-8 h-8 rounded-full border-3 border-white shadow-lg ring-2 ring-blue-400/30"
                                  style={{ backgroundColor: color }}
                                />
                              </div>
                            </div>
                          )}

                          {talla && (
                            <div className="flex items-center gap-3">
                              <span className="text-blue-200 font-semibold">Talla:</span>
                              <span className="px-4 py-2 bg-blue-500/20 rounded-xl text-white font-bold border border-blue-400/30">
                                {talla}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4">
                          <button
                            onClick={() => handleRemove(ptc.id)}
                            className="group/btn inline-flex items-center gap-3 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-red-600 hover:via-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/25"
                          >
                            <Trash2 className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                            Eliminar
                          </button>

                          <button
                            onClick={() => handleMoveToCart(ptc)}
                            className="group/btn inline-flex items-center gap-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25"
                          >
                            🛒 Mover al carrito
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="text-center mt-16">
              <button
                onClick={handleClear}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-gray-800 hover:via-gray-900 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-gray-500/25 border border-gray-600/30"
              >
                <Trash2 className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                Vaciar Lista Completa
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
