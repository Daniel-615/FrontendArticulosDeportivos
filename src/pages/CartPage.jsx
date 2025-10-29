"use client"

import { useEffect, useMemo, useState } from "react"
import { getCartByUser, updateCartItem, removeFromCart, clearCart } from "../api-gateway/carrito.crud.js"
import { useAuth } from "../context/AuthContext.jsx"
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag, TicketPercent, Truck } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { calcularEnvioRequest } from "../api-gateway/tarifa.envio.crud.js"
import { pay } from "../api-gateway/stripe.js"
import MapDistancePicker from "../components/mapDistancePicker.jsx"
import { getDeseosUsuario, consumirDeseo } from "../api-gateway/deseo.crud.js"

const WAREHOUSE_ANTIGUA = {
  name: "Bodega - Antigua Guatemala",
  lat: 14.5595,
  lng: -90.7343,
}

export default function CartPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Estado UI
  const [cartItems, setCartItems] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [paying, setPaying] = useState(false)
  const [quoting, setQuoting] = useState(false)

  // Cotización de envío
  const [quote, setQuote] = useState(null)

  // Facturación
  const [nit, setNit] = useState("CF")
  const [nitError, setNitError] = useState("")

  // Mapa / destino
  const [coords, setCoords] = useState({
    origin: { lat: WAREHOUSE_ANTIGUA.lat, lng: WAREHOUSE_ANTIGUA.lng },
    destination: null,
    distanceKm: 0,
  })

  // Promociones (deseo)
  const [deseo, setDeseo] = useState(null)
  const [cargandoDeseo, setCargandoDeseo] = useState(false)

  // ===== Helpers =====
  const isNitValid = (value) => {
    if (!value) return false
    const v = String(value).trim()
    if (/^cf$/i.test(v)) return true
    return /^(\d+|\d+-?\d+[kK]?)$/.test(v)
  }

  const handleNitChange = (val) => {
    setNit(val)
    if (!val) setNitError("El NIT es requerido. Si no desea facturar, use CF.")
    else if (!isNitValid(val)) setNitError("NIT inválido. Ejemplos: CF, 1234567, 1234567-8, 1234567-K")
    else setNitError("")
  }

  useEffect(() => {
    setQuote(null) // cambiar destino invalida la cotización
  }, [coords.destination])

  // ===== Carga de datos =====
  const loadCart = async () => {
    if (!user?.id) return
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

  const loadDeseoActivo = async (userId) => {
    if (!userId) return
    setCargandoDeseo(true)
    try {
      const resp = await getDeseosUsuario(userId) // devuelve array []
      if (!resp.success) {
        setDeseo(null)
        return
      }
      const lista = Array.isArray(resp.data) ? resp.data : []
      const activo =
        lista
          .filter((d) => String(d.estado).toUpperCase() === "CREADO")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null
      setDeseo(activo)
    } catch {
      setDeseo(null)
    } finally {
      setCargandoDeseo(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadCart()
      loadDeseoActivo(user.id)
    }
  }, [user])

  // ===== Mapeo para envío =====
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

  // ===== Cotizar envío =====
  const handleCalcularEnvio = async () => {
    try {
      setError(null)
      setQuote(null)

      if (!user?.id) return setError("Debes iniciar sesión para calcular el envío.")
      if (!Array.isArray(cartItems) || cartItems.length === 0) return setError("Tu carrito está vacío.")
      if (!coords?.destination) return setError("Selecciona un destino en el mapa.")

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
      if (!resp.success) return setError(resp.error || "No se pudo calcular el envío.")
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

  // ===== Totales y promos =====
  const totalProductos = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.producto?.productoColor?.producto?.precio || 0)
      return total + price * Number(item.cantidad || 1)
    }, 0)
  }, [cartItems])

  const cumpleReglasPromo = useMemo(() => {
    const p = deseo?.promocion
    if (!deseo || !p) return false
    if (!p.activo) return false
    if (String(deseo.estado).toUpperCase() !== "CREADO") return false

    const expira = p.expiraEl ? new Date(p.expiraEl) : null
    if (expira && Date.now() > expira.getTime()) return false

    const max = Number(p.usosMaximos ?? 1)
    const usados = Number(deseo.usosRealizados ?? 0)
    if (Number.isFinite(max) && Number.isFinite(usados) && usados >= max) return false

    const minCompra = Number(p.metadata?.minCompra ?? 0)
    if (Number.isFinite(minCompra) && totalProductos < minCompra) return false

    return true
  }, [deseo, totalProductos])

  const promoTipo = useMemo(
    () => (cumpleReglasPromo ? String(deseo?.promocion?.tipo || "").toUpperCase() : ""),
    [cumpleReglasPromo, deseo],
  )

  const promoPct = useMemo(() => {
    if (!cumpleReglasPromo) return 0
    const p = deseo?.promocion
    const pct = Number(p?.porcentaje ?? p?.metadata?.porcentaje ?? 0)
    return Number.isFinite(pct) ? pct : 0
  }, [cumpleReglasPromo, deseo])

  // Nota: En tu negocio "DESC_FIJO" representa % (si luego agregas monto fijo, cambia aquí)
  const isEnvioGratis = promoTipo === "ENVIO_GRATIS"
  const isDescPorc = promoTipo === "DESC_FIJO" && promoPct > 0

  const totalProductosConDescuento = useMemo(() => {
    if (!isDescPorc) return totalProductos
    const descuento = (totalProductos * promoPct) / 100
    return Number(Math.max(totalProductos - descuento, 0).toFixed(2))
  }, [totalProductos, isDescPorc, promoPct])

  const costoEnvioUI = useMemo(() => {
    const base = Number(quote?.total_envio || 0)
    return isEnvioGratis ? 0 : base
  }, [quote, isEnvioGratis])

  const totalConEnvio = useMemo(() => {
    return (totalProductosConDescuento + costoEnvioUI).toFixed(2)
  }, [totalProductosConDescuento, costoEnvioUI])

  // ===== Acciones carrito =====
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

  // ===== Pago =====
  const handlePago = async () => {
    try {
      setError(null)

      if (!user?.id) return setError("Debes iniciar sesión para continuar con el pago.")
      if (!Array.isArray(cartItems) || cartItems.length === 0) return setError("Tu carrito está vacío.")
      if (!quote) return setError("Primero calcula el envío para continuar con el pago.")
      if (!isNitValid(nit)) return setError("Debes ingresar un NIT válido (o CF).")
      if (!coords?.destination) return setError("Selecciona un destino en el mapa.")

      setPaying(true)

      // Repartir descuento proporcional en líneas
      const subtotalSinDescuento = totalProductos
      let factor = 1
      if (isDescPorc && subtotalSinDescuento > 0) {
        factor = totalProductosConDescuento / subtotalSinDescuento
      }

      const items = cartItems.map((item) => {
        const baseProduct = item.producto?.productoColor?.producto ?? {}
        const unitPrice = Number(baseProduct?.precio || 0)
        const unitPriceConDesc = Number((unitPrice * factor).toFixed(2))
        return {
          name: baseProduct?.nombre || "Producto",
          price: unitPriceConDesc,
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

      const costoEnvioFinal = isEnvioGratis ? 0 : Number(quote.total_envio || 0)
      if (costoEnvioFinal > 0) {
        items.push({ name: "Envío", price: costoEnvioFinal, quantity: 1 })
      }

      const direccion_destino = `${coords.destination.lat.toFixed(5)}, ${coords.destination.lng.toFixed(5)}`
      const fecha_estimada = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

      const respPay = await pay({
        userId: user.id,
        nit: String(nit).trim().toUpperCase(),
        items,
        direccion_destino,
        costo_envio: costoEnvioFinal,
        fecha_estimada,
        metadata: { deseo_id: cumpleReglasPromo ? deseo?.id || null : null }, // para conciliar en webhook
      })

      // Ideal: consumir en el webhook al confirmar pago.
      // Si decides hacerlo aquí (soft-consume):
      if (cumpleReglasPromo && deseo?.id) {
        try {
          await consumirDeseo(deseo.id, { motivo: "COMPRA_INICIADA" })
          loadDeseoActivo(user.id)
        } catch (e) {
          console.warn("No se pudo consumir el deseo luego del pago:", e)
        }
      }

      return respPay
    } catch (e) {
      console.error(e)
      setError(e?.message || "No se pudo iniciar el pago.")
      setPaying(false)
    }
  }

  // ===== Render =====
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="text-center mb-8 sm:mb-12 pt-6 sm:pt-8">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
            <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">CARRITO</h1>
          </div>
          <p className="text-white/60 text-xs sm:text-sm tracking-wider uppercase">Revisa tus productos</p>
        </div>

        {error && (
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-red-500/20 border border-red-500/50 text-white text-center text-sm">
            {error}
          </div>
        )}

        {/* Banner de promoción */}
        {deseo && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-emerald-500/15 border border-emerald-400/40 text-white">
            <div className="flex items-center gap-3">
              {isEnvioGratis ? <Truck className="w-5 h-5" /> : <TicketPercent className="w-5 h-5" />}
              <div className="font-bold uppercase">
                {cumpleReglasPromo
                  ? isEnvioGratis
                    ? "Promoción activa: Envío gratis"
                    : `Promoción activa: Descuento ${promoPct}%`
                  : "Tienes una promoción disponible"}
              </div>
            </div>

            {deseo.promocion?.expiraEl && (
              <div className="text-white/70 text-sm mt-1">
                Vence: {new Date(deseo.promocion.expiraEl).toLocaleString()}
              </div>
            )}

            {!cumpleReglasPromo && (
              <div className="text-amber-200/80 mt-2 text-sm">
                {(() => {
                  const p = deseo.promocion
                  if (!p?.activo) return "La promoción está inactiva."
                  if (p.expiraEl && Date.now() > new Date(p.expiraEl).getTime()) return "La promoción ha expirado."
                  const min = Number(p?.metadata?.minCompra ?? 0)
                  if (min > 0 && totalProductos < min) {
                    const faltan = (min - totalProductos).toFixed(2)
                    return `Agrega Q${faltan} más en productos para activar la promoción.`
                  }
                  const max = Number(p.usosMaximos ?? 1)
                  const usados = Number(deseo.usosRealizados ?? 0)
                  if (usados >= max) return "La promoción alcanzó su límite de uso."
                  return "La promoción no cumple las condiciones aún."
                })()}
              </div>
            )}
          </div>
        )}

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
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/10 border border-white/20 p-4 sm:p-6 hover:bg-white/[0.15] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/5 border border-white/20 overflow-hidden flex-shrink-0">
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

                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight break-words">
                        {item.producto?.productoColor?.producto.nombre || "Producto no disponible"}
                      </h2>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-white/60 text-sm">
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

                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-4 w-full sm:w-auto">
                      <div className="flex items-center gap-2 bg-white/5 border border-white/20 p-2 flex-1 sm:flex-initial">
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
                          className="w-12 sm:w-16 px-2 sm:px-3 py-2 text-center bg-white/5 text-white border border-white/20 focus:outline-none focus:border-white/40"
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
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/50 transition-colors flex-1 sm:flex-initial justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium uppercase">Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/10 border border-white/20 p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">RESUMEN</h3>
                  <p className="text-white/60 text-sm uppercase tracking-wide">Productos: {cartItems.length}</p>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <p className="text-white/60 mb-1 text-sm uppercase tracking-wide">Total sin promos:</p>
                  <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    Q{totalProductos.toFixed(2)}
                  </p>
                </div>
              </div>

              {isDescPorc && (
                <div className="mb-4 text-emerald-300">
                  Descuento aplicado a productos: <strong>{promoPct}%</strong> — Nuevo subtotal:{" "}
                  <strong>Q{totalProductosConDescuento.toFixed(2)}</strong>
                </div>
              )}

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
                <div className="h-64 sm:h-80 md:h-96">
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
                    height="100%"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleClear}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/20 transition-colors font-medium uppercase tracking-wide order-3 sm:order-1"
                  disabled={loading || paying || quoting}
                >
                  <Trash2 className="w-5 h-5" />
                  Vaciar
                </button>

                <button
                  className="flex-1 px-6 sm:px-8 py-3 bg-white hover:bg-white/90 text-black font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wide order-1 sm:order-2"
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
                  className="flex-1 px-6 sm:px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold transition-colors uppercase tracking-wide disabled:opacity-60 order-2 sm:order-3"
                  disabled={loading || paying || quoting}
                >
                  {quoting ? "Calculando..." : "Calcular envío"}
                </button>
              </div>

              {quote && (
                <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-white/5 border border-white/20">
                  <div className="flex items-baseline justify-between mb-4">
                    <h4 className="text-xl font-bold text-white">Envío estimado</h4>
                    <div className="text-right">
                      <p className="text-white/60 text-sm">Distancia: {Number(quote.distancia_km).toFixed(2)} km</p>
                      {isEnvioGratis ? (
                        <p className="text-emerald-300 font-bold text-lg">Envío GRATIS por promoción</p>
                      ) : (
                        <p className="text-3xl font-bold text-white">Q{Number(quote.total_envio).toFixed(2)}</p>
                      )}
                    </div>
                  </div>

                  {!isEnvioGratis && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3 text-white/60 text-sm">
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
                  )}

                  <details className="mt-4">
                    <summary className="cursor-pointer text-white hover:text-white/80 text-sm sm:text-base">
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
                      className={`w-full px-4 py-2 bg-white/5 text-white border ${
                        nitError ? "border-red-400" : "border-white/20"
                      } focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent`}
                    />
                    {nitError && <p className="mt-1 text-sm text-red-400">{nitError}</p>}
                  </div>

                  <div className="mt-4 text-right">
                    <div className="text-white/60 text-sm sm:text-base">
                      Total productos {isDescPorc ? "(con descuento)" : ""}: Q{totalProductosConDescuento.toFixed(2)}
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-white">
                      Total a pagar aprox.: Q{totalConEnvio}
                    </div>
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
