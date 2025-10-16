import { useEffect, useState } from "react";
import {
  getCartByUser,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../api-gateway/carrito.crud.js";
import { useAuth } from "../context/AuthContext.jsx";
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { calcularEnvioRequest } from "../api-gateway/tarifa.envio.crud.js";
import { pay } from "../api-gateway/stripe.js";

import MapDistancePicker from "../components/mapDistancePicker.jsx";

// --- Origen fijo: Bodega en Antigua Guatemala ---
const WAREHOUSE_ANTIGUA = {
  name: "Bodega - Antigua Guatemala",
  lat: 14.5595,
  lng: -90.7343,
};

export default function CartPage() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);

  // Envío
  const [quoting, setQuoting] = useState(false);
  const [quote, setQuote] = useState(null);

  // NIT (habilitado tras cotizar). Por defecto "CF"
  const [nit, setNit] = useState("CF");
  const [nitError, setNitError] = useState("");

  const [coords, setCoords] = useState({
    origin: { lat: WAREHOUSE_ANTIGUA.lat, lng: WAREHOUSE_ANTIGUA.lng },
    destination: null,
    distanceKm: 0,
  });

  const navigate = useNavigate();

  const loadCart = async () => {
    setLoading(true);
    try {
      const response = await getCartByUser(user.id);
      if (response.success) {
        setCartItems(response.data || []);
        setError(null);
      } else {
        setCartItems([]);
        setError(response.error || "No se pudo cargar el carrito.");
      }
    } catch {
      setCartItems([]);
      setError("Error inesperado al obtener el carrito.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadCart();
  }, [user]);

  // Invalida cotización si cambian cantidades o se eliminan items
  const handleUpdate = async (ptc_id, cantidad) => {
    if (cantidad < 1) return;
    const response = await updateCartItem(user.id, ptc_id, cantidad);
    if (response.success) {
      setQuote(null);
      loadCart();
    } else setError(response.error || "No se pudo actualizar la cantidad.");
  };

  const handleRemove = async (ptc_id) => {
    const response = await removeFromCart(user.id, ptc_id);
    if (response.success) {
      setQuote(null);
      loadCart();
    } else setError(response.error || "No se pudo eliminar el producto.");
  };

  const handleClear = async () => {
    const response = await clearCart(user.id);
    if (response.success) {
      setQuote(null);
      loadCart();
    } else setError(response.error || "No se pudo vaciar el carrito.");
  };

  const isNitValid = (value) => {
    if (!value) return false;
    const v = String(value).trim();
    if (/^cf$/i.test(v)) return true;
    return /^(\d+|\d+-?\d+[kK]?)$/.test(v);
  };

  const handleNitChange = (val) => {
    setNit(val);
    if (!val) {
      setNitError("El NIT es requerido. Si no desea facturar, use CF.");
    } else if (!isNitValid(val)) {
      setNitError("NIT inválido. Ejemplos: CF, 1234567, 1234567-8, 1234567-K");
    } else {
      setNitError("");
    }
  };

  useEffect(() => {
    setQuote(null);
  }, [coords.destination]);

  function mapCartToShippingItems(list) {
    return list.map((ci) => {
      const p = ci.producto?.productoColor?.producto || {};
      const alto = Number(p.alto ?? p.alto_cm ?? 0);
      const ancho = Number(p.ancho ?? p.ancho_cm ?? 0);
      const largo = Number(p.largo ?? p.largo_cm ?? 0);
      const peso = Number(p.peso ?? p.peso_kg ?? 0);
      const precio = Number(p.precio ?? 0);

      return {
        alto,
        ancho,
        largo,
        peso,
        precio,
        cantidad: Number(ci.cantidad ?? 1),
        fragil: Boolean(p.fragil ?? false),

        // metadatos para UI
        nombre: p.nombre || "Producto",
        sku: p.sku || undefined,
        imagenUrl: ci.producto?.productoColor?.imagenUrl,
        talla: ci.producto?.tallaInfo?.valor,
      };
    });
  }

  // Calcular envío (backend hace Haversine)
  const handleCalcularEnvio = async () => {
    try {
      setError(null);
      setQuote(null);

      if (!user?.id) {
        setError("Debes iniciar sesión para calcular el envío.");
        return;
      }
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        setError("Tu carrito está vacío.");
        return;
      }
      if (!coords?.destination) {
        setError("Selecciona un destino en el mapa.");
        return;
      }

      const items = mapCartToShippingItems(cartItems);

      const payload = {
        items,
        envio: {
          origen_lat: WAREHOUSE_ANTIGUA.lat,
          origen_lng: WAREHOUSE_ANTIGUA.lng,
          destino_lat: coords.destination.lat,
          destino_lng: coords.destination.lng,
        },
      };

      setQuoting(true);
      const resp = await calcularEnvioRequest(payload);
      if (!resp.success) {
        setError(resp.error || "No se pudo calcular el envío.");
        return;
      }
      setQuote(resp.data);
      // Resetea el NIT al calcular (opcional): mantener CF por defecto
      setNit("CF");
      setNitError("");
    } catch (e) {
      console.error(e);
      setError(e?.message || "Error al calcular el envío.");
    } finally {
      setQuoting(false);
    }
  };

  // === Pagar: armar y enviar metadata real a backend/Stripe ===
  const handlePago = async () => {
    try {
      setError(null);

      if (!user?.id) {
        setError("Debes iniciar sesión para continuar con el pago.");
        return;
      }
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        setError("Tu carrito está vacío.");
        return;
      }
      if (!quote) {
        setError("Primero calcula el envío para continuar con el pago.");
        return;
      }
      if (!isNitValid(nit)) {
        setError("Debes ingresar un NIT válido (o CF).");
        return;
      }
      if (!coords?.destination) {
        setError("Selecciona un destino en el mapa.");
        return;
      }

      setPaying(true);

      // Items de productos (¡con producto_id!)
      const items = cartItems.map((item) => {
        const baseProduct = item.producto?.productoColor?.producto ?? {};
        return {
          name: baseProduct?.nombre || "Producto",
          price: Number(baseProduct?.precio || 0),
          quantity: Number(item.cantidad || 1),
          producto_talla_id: Number(item.producto_talla_color_id || 0),

          // ✅ Determina el id del producto base con varios fallbacks
          producto_id: Number(
            baseProduct?.id ??
              item.producto?.id ??
              item.producto?.producto_id ??
              item.producto?.productoColor?.producto_id ??
              0
          ),
        };
      });

      // Item visual de envío para Stripe
      items.push({
        name: "Envío",
        price: Number(quote.total_envio || 0),
        quantity: 1,
      });

      // Dirección destino como "lat, lng"
      const direccion_destino = `${coords.destination.lat.toFixed(5)}, ${coords.destination.lng.toFixed(5)}`;
      // Costo de envío real (para metadata)
      const costo_envio = Number(quote.total_envio || 0);
      // Fecha estimada por defecto (hoy + 3 días)
      const fecha_estimada =
        new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

      await pay({
        userId: user.id,
        nit: String(nit).trim().toUpperCase(),
        items,
        direccion_destino,
        costo_envio,
        fecha_estimada,
      });
    } catch (e) {
      console.error(e);
      setError(e?.message || "No se pudo iniciar el pago.");
      setPaying(false);
    }
  };

  const totalProductos = cartItems.reduce((total, item) => {
    const price = Number(item.producto?.productoColor?.producto?.precio || 0);
    return total + price * item.cantidad;
  }, 0);

  const totalConEnvio = (totalProductos + Number(quote?.total_envio || 0)).toFixed(2);

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
              <button
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => navigate("/producto/")}
              >
                Explorar Productos
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 mb-8">
              {cartItems.map((item, index) => (
                <div
                  key={item.producto_talla_color_id ?? index}
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
                          alt={item.producto?.productoColor?.producto?.nombre || "Producto"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{item.cantidad}</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {item.producto?.productoColor?.producto?.nombre || "Producto no disponible"}
                      </h2>
                      <div className="flex items-center gap-6 text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Precio:</span>
                          <span className="text-xl font-bold text-green-400">
                            Q{item.producto?.productoColor?.producto?.precio ?? "0"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Talla:</span>
                          <span className="px-3 py-1 bg-slate-600 rounded-full text-sm font-medium">
                            {item.producto?.tallaInfo?.valor || "No disponible"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      <div className="flex items-center gap-3 bg-slate-700/50 rounded-xl p-2">
                        <button
                          onClick={() =>
                            handleUpdate(item.producto_talla_color_id, item.cantidad - 1)
                          }
                          disabled={item.cantidad <= 1}
                          className="p-2 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) =>
                            handleUpdate(
                              item.producto_talla_color_id,
                              Number.parseInt(e.target.value)
                            )
                          }
                          className="w-16 px-3 py-2 text-center rounded-lg bg-slate-600 text-white border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                        <button
                          onClick={() =>
                            handleUpdate(item.producto_talla_color_id, item.cantidad + 1)
                          }
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
                  <p className="text-slate-400 mb-1">Total productos:</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                    Q{totalProductos.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* --- Origen/Destino --- */}
              <div className="mb-4 text-slate-300 text-sm">
                <div>
                  <span className="font-semibold text-slate-200">Origen: </span>
                  {WAREHOUSE_ANTIGUA.name} ({WAREHOUSE_ANTIGUA.lat.toFixed(5)}, {WAREHOUSE_ANTIGUA.lng.toFixed(5)})
                </div>
                <div>
                  <span className="font-semibold text-slate-200">Destino: </span>
                  {coords.destination
                    ? `${coords.destination.lat.toFixed(5)}, ${coords.destination.lng.toFixed(5)}`
                    : "Selecciona un destino en el mapa"}
                </div>
              </div>

              {/* --- Mapa (solo destino; origen fijo) --- */}
              <div className="grid gap-4 mb-4">
                <MapDistancePicker
                  defaultOrigin={{ lat: WAREHOUSE_ANTIGUA.lat, lng: WAREHOUSE_ANTIGUA.lng }}
                  value={coords}
                  onChange={(next) => {
                    setCoords({
                      origin: { lat: WAREHOUSE_ANTIGUA.lat, lng: WAREHOUSE_ANTIGUA.lng },
                      destination: next?.destination ?? null,
                      distanceKm: next?.distanceKm ?? 0,
                    });
                  }}
                  height="320px"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleClear}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
                  disabled={loading || paying || quoting}
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="font-medium">Vaciar Carrito</span>
                </button>

                {/* Pagar DESHABILITADO hasta que exista quote y NIT válido */}
                <button
                  className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
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
                  {paying
                    ? "Redirigiendo a Stripe..."
                    : quote
                    ? `Pagar Q${totalConEnvio}`
                    : "Proceder al Pago"}
                </button>

                <button
                  onClick={handleCalcularEnvio}
                  className="flex-1 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={loading || paying || quoting}
                >
                  {quoting ? "Calculando..." : "Calcular envío"}
                </button>
              </div>

              {/* --- Resultado + NIT --- */}
              {quote && (
                <div className="mt-6 p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-xl font-semibold text-emerald-300">Envío estimado</h4>
                    <div className="text-right">
                      <p className="text-slate-400 text-sm">
                        Distancia: {Number(quote.distancia_km).toFixed(2)} km
                      </p>
                      <p className="text-3xl font-bold text-emerald-300">
                        Q{Number(quote.total_envio).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3 mt-3 text-slate-300 text-sm">
                    <div>
                      Recargo por distancia:{" "}
                      <span className="font-semibold">Q{Number(quote.recargo_distancia_total).toFixed(2)}</span>
                    </div>
                    <div>
                      Costo base único:{" "}
                      <span className="font-semibold">Q{Number(quote.costo_base_envio_unico).toFixed(2)}</span>
                    </div>
                    <div>
                      Descuento aplicado:{" "}
                      <span className="font-semibold">
                        {quote.descuento_por_envio_pct
                          ? `${(Number(quote.descuento_por_envio_pct) * 100).toFixed(0)}%`
                          : "0%"}{" "}
                        (Q{Number(quote.descuento_por_envio_total).toFixed(2)})
                      </span>
                    </div>
                  </div>

                  {/* Desglose por ítem */}
                  <details className="mt-4">
                    <summary className="cursor-pointer text-slate-200">Ver desglose por artículo</summary>
                    <div className="mt-3 space-y-2">
                      {Array.isArray(quote.detalle) &&
                        quote.detalle.map((d, i) => (
                          <div key={i} className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
                            <div className="flex items-center justify-between">
                              <div className="text-slate-200 font-medium">
                                {d.item?.nombre || `Item ${i + 1}`} × {d.item?.cantidad ?? 1}
                              </div>
                              <div className="text-slate-100 font-semibold">
                                Q{Number(d?.costos?.total_item ?? 0).toFixed(2)}
                              </div>
                            </div>
                            <div className="text-slate-400 text-xs mt-1">
                              Peso real: {Number(d?.pesos?.real_kg ?? 0).toFixed(2)} kg • Volumétrico:{" "}
                              {Number(d?.pesos?.volumetrico_kg ?? 0).toFixed(2)} kg • Tarifable:{" "}
                              {Number(d?.pesos?.tarifable_kg ?? 0).toFixed(2)} kg
                            </div>
                          </div>
                        ))}
                    </div>
                  </details>

                  {/* NIT (aparece tras cotizar) */}
                  <div className="mt-5">
                    <label className="block text-slate-200 text-sm font-medium mb-2">
                      NIT para la factura (ingrese <span className="font-semibold">CF</span> si no desea facturar)
                    </label>
                    <input
                      type="text"
                      placeholder="CF o NIT — p. ej., 1234567-8"
                      value={nit}
                      onChange={(e) => handleNitChange(e.target.value)}
                      className={`w-full md:max-w-md px-4 py-2 rounded-lg bg-slate-800 text-white border ${
                        nitError ? "border-red-400" : "border-slate-600"
                      } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
                    />
                    {nitError && <p className="mt-1 text-sm text-red-400">{nitError}</p>}
                  </div>

                  {/* Total general */}
                  <div className="mt-4 text-right">
                    <div className="text-slate-300">Total productos: Q{totalProductos.toFixed(2)}</div>
                    <div className="text-xl font-bold text-slate-100">
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
  );
}
