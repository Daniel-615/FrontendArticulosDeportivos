"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getPublicWishlistByShareId } from "../api-gateway/wishlist.crud.js"
import { ShoppingBag, Heart, ArrowLeft } from "lucide-react"

function formatQ(value) {
  try {
    return new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" }).format(Number(value || 0))
  } catch {
    return `Q${Number(value || 0).toFixed(2)}`
  }
}

export default function PublicWishlist() {
  const { shareId } = useParams()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        const { success, data, error, status } = await getPublicWishlistByShareId(shareId)
        if (!alive) return

        if (!success) {
          const msg = error || (status === 410 ? "Enlace vencido." : "Enlace inválido.")
          setError(msg)
          setItems([])
        } else {
          setItems(data?.data?.items || [])
          setError(null)
        }
      } catch (e) {
        if (!alive) return
        setError("No se pudo cargar la wishlist.")
        setItems([])
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [shareId])

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-4 animate-pulse">
                <div className="aspect-square bg-white/10 mb-4" />
                <div className="h-4 w-3/4 bg-white/10 mb-2" />
                <div className="h-4 w-1/3 bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white/60" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 tracking-tight">NO DISPONIBLE</h1>
          <p className="text-white/60 mb-8">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-bold hover:bg-white/90 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            VOLVER AL INICIO
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-black text-white mb-2 tracking-tight">WISHLIST COMPARTIDA</h1>
          <p className="text-white/60">Vista pública de solo lectura</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-28 h-28 mx-auto mb-6 bg-white/10 border border-white/20 flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-white/60" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">NO HAY PRODUCTOS</h3>
            <p className="text-white/60 mb-8">Esta wishlist está vacía</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 font-bold hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              VOLVER AL INICIO
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((it) => {
                const p = it.producto || {}
                return (
                  <div
                    key={it.id}
                    className="group bg-white/5 border border-white/10 overflow-hidden hover:border-white/30 transition-colors"
                  >
                    <div className="aspect-square bg-white/10 overflow-hidden">
                      {p.imagen ? (
                        <img
                          src={p.imagen || "/placeholder.svg"}
                          alt={p.nombre || "Producto"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/40">
                          <ShoppingBag className="w-12 h-12" />
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-white font-bold line-clamp-2 mb-2">{p.nombre || "Producto"}</h3>
                      {"precio" in p && p.precio !== null && (
                        <p className="text-white/80 font-black text-lg">{formatQ(p.precio)}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 font-bold hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                VOLVER AL INICIO
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
