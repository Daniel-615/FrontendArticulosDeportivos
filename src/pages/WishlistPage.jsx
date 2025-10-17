"use client"

import { useEffect, useState } from "react"
import {
  getWishlistByUser,
  removeFromWishlist,
  clearWishlist,
  createOrRefreshWishlistShare,
  revokeWishlistShare,
} from "../api-gateway/wishlist.crud.js"
import { useAuth } from "../context/AuthContext.jsx"
import { Heart, Trash2, ShoppingBag, Share2, Copy, RefreshCw, ShieldX } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { addToCart } from "../api-gateway/carrito.crud.js"
import { toast } from "react-toastify"

export default function WishlistPage() {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const [shareLink, setShareLink] = useState("")
  const [sharing, setSharing] = useState(false)
  const [revoking, setRevoking] = useState(false)

  const navigate = useNavigate()

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
      toast.error("Debes iniciar sesión para mover el producto al carrito.")
      return
    }
    try {
      const response = await addToCart({
        user_id: user.id,
        producto_talla_color_id: ptc.id,
        cantidad: 1,
      })
      if (response.success) {
        toast.success("Producto movido al carrito.")
        await handleRemove(ptc.id)
      } else {
        toast.error(response.error || "No se pudo mover al carrito.")
      }
    } catch (err) {
      toast.error("Error inesperado al mover al carrito.")
    }
  }

  const handleCreateOrRefreshShare = async (opts = { expiresInHours: 72, forceRefresh: false }) => {
    if (!user?.id) {
      toast.error("Debes iniciar sesión.")
      return
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
      return
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
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10 pt-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Heart className="w-10 h-10 text-white" />
            <h1 className="text-5xl font-black text-white tracking-tight">WISHLIST</h1>
          </div>
          <p className="text-white/60 text-sm tracking-wider uppercase">Tus productos favoritos</p>
        </div>

        {user && (
          <div className="bg-white/10 border border-white/20 p-5 mb-10">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <button
                onClick={() => handleCreateOrRefreshShare({ expiresInHours: 72, forceRefresh: false })}
                disabled={sharing}
                className="inline-flex items-center gap-2 px-4 py-3 font-bold bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-60 uppercase tracking-wide"
              >
                <Share2 className="w-5 h-5" />
                {sharing ? "Generando..." : "Compartir"}
              </button>

              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  placeholder="Genera el enlace para compartir..."
                  className="flex-1 px-3 py-3 bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
                />
                <button
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/20 font-medium uppercase"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleCreateOrRefreshShare({ expiresInHours: 72, forceRefresh: true })}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/20 font-medium uppercase"
                  title="Rotar enlace"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={handleRevokeShare}
                  disabled={revoking}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-red-500/20 text-white hover:bg-red-500/30 transition-colors border border-red-500/50 disabled:opacity-60 font-medium uppercase"
                >
                  <ShieldX className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-white/60 text-xs mt-3 uppercase tracking-wide">Enlace público de solo lectura</p>
          </div>
        )}

        {error && <div className="bg-red-500/20 border border-red-500/50 p-4 mb-8 text-white text-center">{error}</div>}

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="mx-auto w-32 h-32 bg-white/10 border border-white/20 flex items-center justify-center mb-6">
                <Heart className="w-16 h-16 text-white/40" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 tracking-tight">WISHLIST VACÍA</h3>
              <p className="text-white/60 mb-8 uppercase text-sm tracking-wide">Guarda tus productos favoritos</p>
              <button
                className="px-8 py-4 bg-white text-black font-bold hover:bg-white/90 transition-colors tracking-wide uppercase"
                onClick={() => navigate("/producto/")}
              >
                Explorar Productos
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {wishlist.map((item) => {
                const ptc = item.producto
                if (!ptc) return null

                const producto = ptc.productoColor?.producto
                const color = ptc.productoColor?.colorInfo?.codigoHex
                const talla = ptc.tallaInfo?.valor

                return (
                  <div
                    key={ptc.id}
                    className="bg-white/10 border border-white/20 hover:bg-white/[0.15] transition-colors overflow-hidden"
                  >
                    <div className="flex flex-col lg:flex-row">
                      <div className="lg:w-80 h-80 lg:h-64 relative overflow-hidden bg-white/5">
                        {ptc.productoColor?.imagenUrl ? (
                          <img
                            src={ptc.productoColor.imagenUrl || "/placeholder.svg"}
                            alt={producto?.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-20 h-20 text-white/20" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 p-8">
                        <div className="mb-6">
                          <h2 className="text-3xl font-black text-white mb-3 tracking-tight">{producto?.nombre}</h2>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl font-black text-white">Q{producto?.precio}</span>
                            <span className="px-3 py-1 bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wide">
                              En Stock
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-6 mb-8 text-sm">
                          {color && (
                            <div className="flex items-center gap-3">
                              <span className="text-white/60 font-medium uppercase tracking-wide">Color:</span>
                              <div className="w-8 h-8 border-2 border-white/40" style={{ backgroundColor: color }} />
                            </div>
                          )}

                          {talla && (
                            <div className="flex items-center gap-3">
                              <span className="text-white/60 font-medium uppercase tracking-wide">Talla:</span>
                              <span className="px-4 py-2 bg-white/10 border border-white/20 text-white font-bold uppercase">
                                {talla}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4">
                          <button
                            onClick={() => handleRemove(ptc.id)}
                            className="inline-flex items-center gap-2 bg-red-500/20 text-white px-6 py-3 font-bold hover:bg-red-500/30 transition-colors border border-red-500/50 uppercase tracking-wide"
                          >
                            <Trash2 className="w-5 h-5" />
                            Eliminar
                          </button>

                          <button
                            onClick={() => handleMoveToCart(ptc)}
                            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-bold hover:bg-white/90 transition-colors uppercase tracking-wide"
                          >
                            <ShoppingBag className="w-5 h-5" />
                            Mover al Carrito
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="text-center mt-12">
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-3 bg-white/5 text-white px-8 py-4 font-bold hover:bg-white/10 transition-colors border border-white/20 uppercase tracking-wide"
              >
                <Trash2 className="w-6 h-6" />
                Vaciar Lista Completa
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
