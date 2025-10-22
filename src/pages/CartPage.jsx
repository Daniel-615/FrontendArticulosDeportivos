"use client"

import { useEffect, useState } from "react"
import { getCartByUser, updateCartItem, removeFromCart, clearCart } from "../api-gateway/carrito.crud.js"
import { useAuth } from "../context/AuthContext.jsx"
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { calcularEnvioRequest } from "../api-gateway/tarifa.envio.crud.js"
import { pay } from "../api-gateway/stripe.js"
import MapDistancePicker from "../components/mapDistancePicker.jsx"

const WAREHOUSE_ANTIGUA = {
  name: "Bodega - Antigua Guatemala",
  lat: 14.5595,
  lng: -90.7343,
}

export default function CartPage() {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [paying, setPaying] = useState(false)
  const [quoting, setQuoting] = useState(false)
  const [quote, setQuote] = useState(null)
  const [nit, setNit] = useState("CF")
  const [nitError, setNitError] = useState("")
  const [coords, setCoords] = useState({
    origin: { lat: WAREHOUSE_ANTIGUA.lat, lng: WAREHOUSE_ANTIGUA.lng },
    destination: null,
    distanceKm: 0,
  })

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
    if (response.success) {
      setQuote(null)
      loadCart()
    } else setError(response.error || "No se pudo actualizar la cantidad.")
  }

  const handleRemove = async (ptc_id) => {
    const response = await removeFromCart(user.id, ptc_id)
    if (response.success) {
      setQuote(null)
      loadCart()
    } else setError(response.error || "No se pudo eliminar el producto.")
  }

  const handleClear = async () => {
    const response = await clearCart(user.id)
    if (response.success) {
      setQuote(null)
      loadCart()
    } else setError(response.error || "No se pudo vaciar el carrito.")
  }

  const isNitValid = (value) => {
    if (!value) return false
    const v = String(value).trim()
    if (/^cf$/i.test(v)) return true
    return /^(\d+|\d+-?\d+[kK]?)$/.test(v)
  }

  const handleNitChange = (val) => {
    setNit(val)
    if (!val) {
      setNitError("El NIT es requerido. Si no desea facturar, use CF.")
    } else if (!isNitValid(val)) {
      setNitError("NIT inválido. Ejemplos: CF, 1234567, 1234567-8, 1234567-K")
    } else {
      setNitError("")
    }
  }

  useEffect(() => {
    setQuote(null)
  }, [coords.destination])

  function mapCartToShippingItems(list) {
    return list.map((ci) => {
      const p = ci.producto?.productoColor?.producto || {}
      const alto = Number(p.alto ?? p.alto_cm ?? 0)
      const ancho = Number(p.ancho ?? p.ancho_cm ?? 0)
      const largo = Number(p.largo ?? p.largo_cm ?? 0)
      const peso = Number(p.peso ?? p.peso_kg ?? 0)
      const precio = Number(p.precio ?? 0)

      return {
        alto,
        ancho,
        largo,
        peso,
        precio,
        cantidad: Number(ci.cantidad ?? 1),
        fragil: Boolean(p.fragil ?? false),
        nombre: p.nombre || "Producto",
        sku: p.sku || undefined,
        imagenUrl: ci.producto?.productoColor?.imagenUrl,
        talla: ci.producto?.tallaInfo?.valor,
      }
    })
  }

  const handleCalcularEnvio = async () => {
    try {
      setError(null)
      setQuote(null)

      if (!user?.id) {
        setError("Debes iniciar sesión para calcular el envío.")
        return
      }
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        setError("Tu carrito está vacío.")
        return
      }
      if (!coords?.destination) {
        setError("Selecciona un destino en el mapa.")
        return
      }

      const items = mapCartToShippingItems(cartItems)

      const payload = {
        items,
        envio: {
          origen_lat: WAREHOUSE_ANTIGUA.lat,
          origen_lng: WAREHOUSE_ANTIGUA.lng,
          destino_lat: coords.destination.lat,
          destino_lng: coords.destination.lng,
        },
      }

      setQuoting(true)
      const resp = await calcularEnvioRequest(payload)
      if (!resp.success) {
        setError(resp.error || "No se pudo calcular el envío.")
        return
      }
      setQuote(resp.data)
      setNit("CF")
      setNitError("")
    } catch (e) {
      console.error(e)
      setError(e?.message || "Error al calcular el envío.")
    } finally {
      setQuoting(false)
    }
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
      if (!quote) {
        setError("Primero calcula el envío para continuar con el pago.")
        return
      }
      if (!isNitValid(nit)) {
        setError("Debes ingresar un NIT válido (o CF).")
        return
      }
      if (!coords?.destination) {
        setError("Selecciona un destino en el mapa.")
        return
      }

      setPaying(true)

      const items = cartItems.map((item) => {
        const baseProduct = item.producto?.productoColor?.producto ?? {}
        return {
          name: baseProduct?.nombre || "Producto",
          price: Number(baseProduct?.precio || 0),
          quantity: Number(item.cantidad || 1),
          producto_talla_id: Number(item.producto_talla_color_id || 0),
          producto_id: Number(
            baseProduct?.id ??
              item.producto?.id ??
              item.producto?.producto_id ??
              item.producto?.productoColor?.producto_id ??
              0,
          ),
        }
      })

      items.push({
        name: "Envío",
        price: Number(quote.total_envio || 0),
        quantity: 1,
      })

      const direccion_destino = `${coords.destination.lat.toFixed(5)}, ${coords.destination.lng.toFixed(5)}`
      const costo_envio = Number(quote.total_envio || 0)
      const fecha_estimada = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

      await pay({
        userId: user.id,
        nit: String(nit).trim().toUpperCase(),
        items,
        direccion_destino,
        costo_envio,
        fecha_estimada,
      })
    } catch (e) {
      console.error(e)
      setError(e?.message || "No se pudo iniciar el pago.")
      setPaying(false)
    }
  }

  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number.parseFloat(item.producto?.productoColor?.producto.precio || 0)
    return total + price * item.cantidad
  }, 0)

  const totalProductos = totalPrice
  const totalConEnvio = (totalProductos + Number(quote?.total_envio || 0)).toFixed(2)

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
                          "/placeholder.svg" ||
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

              <div className="mb-4 text-white/60 text-sm">
                <div>
                  <span className="font-semibold text-white/80">Origen: </span>
                  {WAREHOUSE_ANTIGUA.name} ({WAREHOUSE_ANTIGUA.lat.toFixed(5)}, {WAREHOUSE_ANTIGUA.lng.toFixed(5)})
                </div>
                <div>
                  <span className="font-semibold text-white/80">Destino: </span>
                  {coords.destination
                    ? `${coords.destination.lat.toFixed(5)}, ${coords.destination.lng.toFixed(5)}`
                    : "Selecciona un destino en el mapa"}
                </div>
              </div>

              <div className="grid gap-4 mb-4">
                <MapDistancePicker
                  defaultOrigin={{ lat: WAREHOUSE_ANTIGUA.lat, lng: WAREHOUSE_ANTIGUA.lng }}
                  value={coords}
                  onChange={(next) => {
                    setCoords({
                      origin: { lat: WAREHOUSE_ANTIGUA.lat, lng: WAREHOUSE_ANTIGUA.lng },
                      destination: next?.destination ?? null,
                      distanceKm: next?.distanceKm ?? 0,
                    })
                  }}
                  height="320px"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleClear}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/20 transition-colors font-medium uppercase tracking-wide"
                  disabled={loading || paying || quoting}
                >
                  <Trash2 className="w-5 h-5" />
                  Vaciar
                </button>

                <button
                  className="flex-1 px-8 py-3 bg-white hover:bg-white/90 text-black font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wide"
                  onClick={handlePago}
                  disabled={
                    paying ||
                    loading ||
                    quoting ||
                    !cartItems.length ||
                    !quote ||
                    !isNitValid(nit) ||
                    !coords.destination
                  }
                  title={
                    !quote
                      ? "Calcula el envío para habilitar el pago"
                      : !isNitValid(nit)
                        ? "Ingrese un NIT válido (o CF)"
                        : !coords.destination
                          ? "Seleccione un destino en el mapa"
                          : "Proceder al Pago"
                  }
                >
                  {paying ? "Redirigiendo a Stripe..." : quote ? `Pagar Q${totalConEnvio}` : "Proceder al Pago"}
                </button>

                <button
                  onClick={handleCalcularEnvio}
                  className="flex-1 px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold transition-colors uppercase tracking-wide disabled:opacity-60"
                  disabled={loading || paying || quoting}
                >
                  {quoting ? "Calculando..." : "Calcular envío"}
                </button>
              </div>

              {quote && (
                <div className="mt-6 p-5 bg-white/5 border border-white/20">
                  <div className="flex items-baseline justify-between mb-4">
                    <h4 className="text-xl font-bold text-white">Envío estimado</h4>
                    <div className="text-right">
                      <p className="text-white/60 text-sm">Distancia: {Number(quote.distancia_km).toFixed(2)} km</p>
                      <p className="text-3xl font-bold text-white">Q{Number(quote.total_envio).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3 mt-3 text-white/60 text-sm">
                    <div>
                      Recargo por distancia:{" "}
                      <span className="font-semibold text-white">
                        Q{Number(quote.recargo_distancia_total).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      Costo base único:{" "}
                      <span className="font-semibold text-white">
                        Q{Number(quote.costo_base_envio_unico).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      Descuento aplicado:{" "}
                      <span className="font-semibold text-white">
                        {quote.descuento_por_envio_pct
                          ? `${(Number(quote.descuento_por_envio_pct) * 100).toFixed(0)}%`
                          : "0%"}{" "}
                        (Q{Number(quote.descuento_por_envio_total).toFixed(2)})
                      </span>
                    </div>
                  </div>

                  <details className="mt-4">
                    <summary className="cursor-pointer text-white hover:text-white/80">
                      Ver desglose por artículo
                    </summary>
                    <div className="mt-3 space-y-2">
                      {Array.isArray(quote.detalle) &&
                        quote.detalle.map((d, i) => (
                          <div key={i} className="p-3 bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between">
                              <div className="text-white font-medium">
                                {d.item?.nombre || `Item ${i + 1}`} × {d.item?.cantidad ?? 1}
                              </div>
                              <div className="text-white font-semibold">
                                Q{Number(d?.costos?.total_item ?? 0).toFixed(2)}
                              </div>
                            </div>
                            <div className="text-white/60 text-xs mt-1">
                              Peso real: {Number(d?.pesos?.real_kg ?? 0).toFixed(2)} kg • Volumétrico:{" "}
                              {Number(d?.pesos?.volumetrico_kg ?? 0).toFixed(2)} kg • Tarifable:{" "}
                              {Number(d?.pesos?.tarifable_kg ?? 0).toFixed(2)} kg
                            </div>
                          </div>
                        ))}
                    </div>
                  </details>

                  <div className="mt-5">
                    <label className="block text-white text-sm font-medium mb-2">
                      NIT para la factura (ingrese <span className="font-semibold">CF</span> si no desea facturar)
                    </label>
                    <input
                      type="text"
                      placeholder="CF o NIT — p. ej., 1234567-8"
                      value={nit}
                      onChange={(e) => handleNitChange(e.target.value)}
                      className={`w-full md:max-w-md px-4 py-2 bg-white/5 text-white border ${
                        nitError ? "border-red-400" : "border-white/20"
                      } focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent`}
                    />
                    {nitError && <p className="mt-1 text-sm text-red-400">{nitError}</p>}
                  </div>

                  <div className="mt-4 text-right">
                    <div className="text-white/60">Total productos: Q{totalProductos.toFixed(2)}</div>
                    <div className="text-xl font-bold text-white">Total a pagar aprox.: Q{totalConEnvio}</div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
