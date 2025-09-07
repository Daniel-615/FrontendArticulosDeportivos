import { useEffect, useState } from "react"
import { getCartByUser, updateCartItem, removeFromCart, clearCart } from "../api-gateway/carrito.crud.js"
import { useAuth } from "../context/AuthContent.jsx"
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

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

  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number.parseFloat(item.producto?.productoColor?.producto.precio || 0)
    return total + price * item.cantidad
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              Carrito de Compras
            </h1>
          </div>
          <p className="text-slate-400 text-lg">Revisa y gestiona tus productos seleccionados</p>
        </div>

        {error && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-sm border border-red-500/30 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-full">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-red-300 font-semibold">Error</h3>
                <p className="text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 text-lg">Cargando tu carrito...</p>
          </div>
        ) : Array.isArray(cartItems) && cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-16 h-16 text-slate-500" />
              </div>
              <h2 className="text-3xl font-bold text-slate-300 mb-4">Tu carrito está vacío</h2>
              <p className="text-slate-400 text-lg mb-8">¡Descubre nuestros increíbles productos deportivos!</p>
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                Explorar Productos
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 mb-8">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="group bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-slate-600 to-slate-700 shadow-lg">
                        <img
                          src={
                            item.producto?.productoColor?.imagenUrl ||
                            "/placeholder.svg?height=96&width=96&query=sports+product"
                          }
                          alt={item.producto?.nombre || "Producto"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{item.cantidad}</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {item.producto?.productoColor?.producto.nombre || "Producto no disponible"}
                      </h2>
                      <div className="flex items-center gap-6 text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Precio:</span>
                          <span className="text-xl font-bold text-green-400">
                            Q{item.producto?.productoColor?.producto.precio ?? "0"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Talla:</span>
                          <span className="px-3 py-1 bg-slate-600 rounded-full text-sm font-medium">
                            {item.producto.tallaInfo?.valor || "No disponible"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      <div className="flex items-center gap-3 bg-slate-700/50 rounded-xl p-2">
                        <button
                          onClick={() => handleUpdate(item.producto_talla_color_id, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                          className="p-2 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) => handleUpdate(item.producto_talla_color_id, Number.parseInt(e.target.value))}
                          className="w-16 px-3 py-2 text-center rounded-lg bg-slate-600 text-white border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleUpdate(item.producto_talla_color_id, item.cantidad + 1)}
                          className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item.producto_talla_color_id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-300 group/btn"
                      >
                        <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Resumen del Pedido</h3>
                  <p className="text-slate-400">Total de productos: {cartItems.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 mb-1">Total a pagar:</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    Q{totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleClear}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="font-medium">Vaciar Carrito</span>
                </button>

                <button className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Proceder al Pago
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
