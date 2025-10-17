"use client"

import { useEffect, useState } from "react"
import { getCartByUser, updateCartItem, removeFromCart, clearCart } from "../api-gateway/carrito.crud.js"
import { useAuth } from "../context/AuthContext.jsx"
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { pay } from "../api-gateway/stripe.js"

export default function CartPage() {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [paying, setPaying] = useState(false)
  const navigate = useNavigate()

  const loadCart = async () => {
    setLoading(true)
    try {
      const response = await getCartByUser(user.id)
      if (response.success) {
        setCartItems(response.data || [])
        setError(null)
      } else {
        setCartItems([])
        setError(response.error || "No se pudo cargar el carrito.")
      }
    } catch {
      setCartItems([])
      setError("Error inesperado al obtener el carrito.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) loadCart()
  }, [user])

  const handleUpdate = async (ptc_id, cantidad) => {
    if (cantidad < 1) return
    const response = await updateCartItem(user.id, ptc_id, cantidad)
    if (response.success) loadCart()
    else setError(response.error || "No se pudo actualizar la cantidad.")
  }

  const handleRemove = async (ptc_id) => {
    const response = await removeFromCart(user.id, ptc_id)
    if (response.success) loadCart()
    else setError(response.error || "No se pudo eliminar el producto.")
  }

  const handleClear = async () => {
    const response = await clearCart(user.id)
    if (response.success) loadCart()
    else setError(response.error || "No se pudo vaciar el carrito.")
  }

  const handlePago = async () => {
    try {
      setError(null)

      if (!user?.id) {
        setError("Debes iniciar sesión para continuar con el pago.")
        return
      }
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        setError("Tu carrito está vacío.")
        return
      }

      setPaying(true)

      const items = cartItems.map((ci) => ({
        id: ci.producto_talla_color_id,
        name: ci.producto?.productoColor?.producto?.nombre || "Producto",
        price: Number(ci.producto?.productoColor?.producto?.precio || 0),
        quantity: Number(ci.cantidad || 1),
      }))

      await pay(items)
    } catch (e) {
      console.error(e)
      setError(e?.message || "No se pudo iniciar el pago.")
      setPaying(false)
    }
  }

  const handleCalcularEnvio = async () => {
    // TODO: integra tu flujo real
    // const response = await calcularEnvioRequest(...)
    // if (!response.success) setError(response.error || "No se pudo calcular el envío")
  }

  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number.parseFloat(item.producto?.productoColor?.producto.precio || 0)
    return total + price * item.cantidad
  }, 0)

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-12 pt-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <ShoppingCart className="w-10 h-10 text-white" />
            <h1 className="text-5xl font-black text-white tracking-tight">CARRITO</h1>
          </div>
          <p className="text-white/60 text-sm tracking-wider uppercase">Revisa tus productos</p>
        </div>

        {error && <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 text-white text-center">{error}</div>}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-white/60 text-sm uppercase tracking-wide">Cargando...</p>
          </div>
        ) : Array.isArray(cartItems) && cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="mx-auto w-32 h-32 bg-white/10 border border-white/20 flex items-center justify-center mb-6">
                <ShoppingBag className="w-16 h-16 text-white/40" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4 tracking-tight">CARRITO VACÍO</h2>
              <p className="text-white/60 mb-8 uppercase text-sm tracking-wide">Descubre nuestros productos</p>
              <button
                className="px-8 py-4 bg-white text-black font-bold hover:bg-white/90 transition-colors tracking-wide"
                onClick={() => navigate("/producto/")}
              >
                EXPLORAR PRODUCTOS
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/10 border border-white/20 p-6 hover:bg-white/[0.15] transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-white/5 border border-white/20 overflow-hidden">
                      <img
                        src={
                          item.producto?.productoColor?.imagenUrl ||
                          "/placeholder.svg?height=96&width=96&query=sports+product" ||
                          "/placeholder.svg"
                        }
                        alt={item.producto?.nombre || "Producto"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
                        {item.producto?.productoColor?.producto.nombre || "Producto no disponible"}
                      </h2>
                      <div className="flex items-center gap-6 text-white/60 text-sm">
                        <span>
                          PRECIO:{" "}
                          <span className="text-white font-bold">
                            Q{item.producto?.productoColor?.producto.precio ?? "0"}
                          </span>
                        </span>
                        <span>
                          TALLA: <span className="text-white font-bold">{item.producto.tallaInfo?.valor || "N/A"}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      <div className="flex items-center gap-2 bg-white/5 border border-white/20 p-2">
                        <button
                          onClick={() => handleUpdate(item.producto_talla_color_id, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                          className="p-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/30 text-white transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) => handleUpdate(item.producto_talla_color_id, Number.parseInt(e.target.value))}
                          className="w-16 px-3 py-2 text-center bg-white/5 text-white border border-white/20 focus:outline-none focus:border-white/40"
                        />
                        <button
                          onClick={() => handleUpdate(item.producto_talla_color_id, item.cantidad + 1)}
                          className="p-2 bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item.producto_talla_color_id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium uppercase">Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/10 border border-white/20 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tight">RESUMEN</h3>
                  <p className="text-white/60 text-sm uppercase tracking-wide">Productos: {cartItems.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 mb-1 text-sm uppercase tracking-wide">Total:</p>
                  <p className="text-4xl font-black text-white tracking-tight">Q{totalPrice.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleClear}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/20 transition-colors font-medium uppercase tracking-wide"
                  disabled={loading || paying}
                >
                  <Trash2 className="w-5 h-5" />
                  Vaciar
                </button>

                <button
                  className="flex-1 px-8 py-3 bg-white hover:bg-white/90 text-black font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wide"
                  onClick={handlePago}
                  disabled={paying || loading || !cartItems.length}
                >
                  {paying ? "Procesando..." : "Proceder al Pago"}
                </button>

                <button
                  onClick={handleCalcularEnvio}
                  className="flex-1 px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold transition-colors uppercase tracking-wide"
                  disabled={loading || paying}
                >
                  Calcular Envío
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
