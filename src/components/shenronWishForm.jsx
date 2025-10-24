import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Percent, Gift, Truck, Dice5 } from "lucide-react";
import { createDeseo } from "../api-gateway/deseo.crud.js";
import { getPromociones } from "../api-gateway/promocion.crud.js";

export default function ShenronWishForm({ usuarioId, open, onGranted, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [loadingPromos, setLoadingPromos] = useState(false);
  const [err, setErr] = useState("");
  const [promos, setPromos] = useState([]);          
  const [selectedPromoId, setSelectedPromoId] = useState(""); 


  useEffect(() => {
    if (!open) return;
    setErr("");
    setSelectedPromoId("");
    setLoadingPromos(true);

    getPromociones({ vigentes: true, activo: true })
      .then((resp) => {
        if (!resp?.success) {
          setErr(resp?.error || "No se pudieron obtener las promociones.");
          setPromos([]);
          return;
        }
        const list = Array.isArray(resp.data) ? resp.data : (resp.data?.items || []);
        setPromos(list || []);
      })
      .catch(() => setErr("Error al obtener las promociones."))
      .finally(() => setLoadingPromos(false));
  }, [open]);

  const groups = useMemo(() => {
    const map = { ENVIO_GRATIS: [], DESC_FIJO: [], DESC_RANDOM: [], OTROS: [] };
    for (const p of promos) {
      const key = ["ENVIO_GRATIS", "DESC_FIJO", "DESC_RANDOM"].includes(p?.tipo) ? p.tipo : "OTROS";
      map[key].push(p);
    }
    return map;
  }, [promos]);

  const iconForTipo = (tipo) => {
    if (tipo === "ENVIO_GRATIS") return <Truck className="w-4 h-4" />;
    if (tipo === "DESC_FIJO") return <Percent className="w-4 h-4" />;
    if (tipo === "DESC_RANDOM") return <Dice5 className="w-4 h-4" />;
    return <Gift className="w-4 h-4" />;
  };

  const labelForPromo = (p) => {

    if (p.tipo === "ENVIO_GRATIS") return "Envío gratis";
    if (p.tipo === "DESC_FIJO") {

      const pct = p.porcentaje ?? p.metadata?.porcentaje;
      return `Descuento fijo ${pct != null ? `(${pct}%)` : ""}`.trim();
    }
    if (p.tipo === "DESC_RANDOM") return "Descuento aleatorio";

    return p.nombre || p.titulo || `Promo #${p.id}`;
  };

  const descForPromo = (p) => {
    const vence = p.expiraEl ? `Vence: ${new Date(p.expiraEl).toLocaleString()}` : "";
    const usos = p.usosMaximos != null ? `Usos máx: ${p.usosMaximos}` : "";
    const parts = [p.descripcion, vence, usos].filter(Boolean);
    return parts.join(" · ");
  };

  const handleGrant = async () => {
    if (!usuarioId) return setErr("Falta usuarioId.");
    if (!selectedPromoId) return setErr("Selecciona una promoción.");

    setLoading(true);
    setErr("");
    try {
      const resp = await createDeseo(usuarioId, { promocionId: selectedPromoId });
      if (!resp?.success) {
        setErr(resp?.error || "No se pudo conceder el deseo.");
        setLoading(false);
        return;
      }

      const data = resp.data || {};
      onGranted?.({
        deseo: data.deseo,
        promocion: data.promocion || data.promo,
      });
    } catch {
      setErr("Error de red o del servidor.");
      setLoading(false);
    }
  };


  const LoadingSkeleton = ({ rows = 3 }) => (
    <div className="grid grid-cols-1 gap-3 mb-6">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 border-4 border-orange-800 bg-black/40 animate-pulse" />
      ))}
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-b from-orange-950 to-black border-8 border-orange-500 max-w-2xl w-full relative overflow-hidden"
            style={{ boxShadow: "0 0 50px rgba(251,146,60,.5), inset 0 0 30px rgba(251,146,60,.1)" }}
            initial={{ scale: 0.5, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: -80 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />

            <div className="relative z-10 p-8">
              <h2
                className="text-4xl md:text-5xl font-black text-orange-400 text-center mb-8 uppercase tracking-widest"
                style={{ textShadow: "4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000" }}
              >
                <div className="flex items-center gap-3 justify-center">
                  <Sparkles className="w-6 h-6" />
                  Elige tu deseo
                </div>
              </h2>

              {/* Lista de promociones */}
              {loadingPromos ? (
                <LoadingSkeleton rows={4} />
              ) : promos.length === 0 ? (
                <div className="mb-6 text-orange-200">
                  No hay promociones vigentes/activas disponibles.
                </div>
              ) : (
                <>
                  {/* ENVIO_GRATIS */}
                  {groups.ENVIO_GRATIS.length > 0 && (
                    <>
                      <h3 className="text-sm text-orange-300 uppercase font-bold mb-2">Envío gratis</h3>
                      <div className="grid grid-cols-1 gap-3 mb-6">
                        {groups.ENVIO_GRATIS.map((p, idx) => (
                          <motion.button
                            key={p.id}
                            onClick={() => setSelectedPromoId(p.id)}
                            className={`w-full p-4 border-4 transition-all text-left font-bold uppercase text-sm ${
                              selectedPromoId === p.id
                                ? "border-orange-400 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50"
                                : "border-orange-700 bg-black/50 text-orange-300 hover:bg-orange-950/50 hover:border-orange-500"
                            }`}
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <div className="flex items-center gap-3">
                              {iconForTipo(p.tipo)}
                              <span className="text-base">{labelForPromo(p)}</span>
                            </div>
                            <div className="text-xs opacity-80 mt-1 normal-case">{descForPromo(p)}</div>
                            <div className="text-[10px] mt-1 opacity-60">ID: {p.id}</div>
                          </motion.button>
                        ))}
                      </div>
                    </>
                  )}

                  {/* DESC_FIJO */}
                  {groups.DESC_FIJO.length > 0 && (
                    <>
                      <h3 className="text-sm text-orange-300 uppercase font-bold mb-2">Descuentos fijos</h3>
                      <div className="grid grid-cols-1 gap-3 mb-6">
                        {groups.DESC_FIJO.map((p, idx) => (
                          <motion.button
                            key={p.id}
                            onClick={() => setSelectedPromoId(p.id)}
                            className={`w-full p-4 border-4 transition-all text-left font-bold uppercase text-sm ${
                              selectedPromoId === p.id
                                ? "border-orange-400 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50"
                                : "border-orange-700 bg-black/50 text-orange-300 hover:bg-orange-950/50 hover:border-orange-500"
                            }`}
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <div className="flex items-center gap-3">
                              {iconForTipo(p.tipo)}
                              <span className="text-base">{labelForPromo(p)}</span>
                            </div>
                            <div className="text-xs opacity-80 mt-1 normal-case">{descForPromo(p)}</div>
                            <div className="text-[10px] mt-1 opacity-60">ID: {p.id}</div>
                          </motion.button>
                        ))}
                      </div>
                    </>
                  )}

                  {/* DESC_RANDOM */}
                  {groups.DESC_RANDOM.length > 0 && (
                    <>
                      <h3 className="text-sm text-orange-300 uppercase font-bold mb-2">Descuento aleatorio</h3>
                      <div className="grid grid-cols-1 gap-3 mb-6">
                        {groups.DESC_RANDOM.map((p, idx) => (
                          <motion.button
                            key={p.id}
                            onClick={() => setSelectedPromoId(p.id)}
                            className={`w-full p-4 border-4 transition-all text-left font-bold uppercase text-sm ${
                              selectedPromoId === p.id
                                ? "border-orange-400 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50"
                                : "border-orange-700 bg-black/50 text-orange-300 hover:bg-orange-950/50 hover:border-orange-500"
                            }`}
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <div className="flex items-center gap-3">
                              {iconForTipo(p.tipo)}
                              <span className="text-base">{labelForPromo(p)}</span>
                            </div>
                            <div className="text-xs opacity-80 mt-1 normal-case">{descForPromo(p)}</div>
                            <div className="text-[10px] mt-1 opacity-60">ID: {p.id}</div>
                          </motion.button>
                        ))}
                      </div>
                    </>
                  )}

                  {groups.OTROS.length > 0 && (
                    <>
                      <h3 className="text-sm text-orange-300 uppercase font-bold mb-2">Otras promociones</h3>
                      <div className="grid grid-cols-1 gap-3 mb-6">
                        {groups.OTROS.map((p, idx) => (
                          <motion.button
                            key={p.id}
                            onClick={() => setSelectedPromoId(p.id)}
                            className={`w-full p-4 border-4 transition-all text-left font-bold uppercase text-sm ${
                              selectedPromoId === p.id
                                ? "border-orange-400 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50"
                                : "border-orange-700 bg-black/50 text-orange-300 hover:bg-orange-950/50 hover:border-orange-500"
                            }`}
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <div className="flex items-center gap-3">
                              {iconForTipo(p.tipo)}
                              <span className="text-base">{labelForPromo(p)}</span>
                            </div>
                            <div className="text-xs opacity-80 mt-1 normal-case">{descForPromo(p)}</div>
                            <div className="text-[10px] mt-1 opacity-60">ID: {p.id}</div>
                          </motion.button>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Error */}
              {err && <div className="mb-4 text-red-400 font-bold">{err}</div>}

              {/* Botones */}
              <div className="flex gap-4">
                <motion.button
                  onClick={handleGrant}
                  disabled={loading || !selectedPromoId}
                  className="flex-1 py-3 bg-gradient-to-b from-orange-500 to-orange-600 text-white font-black uppercase tracking-wider border-4 border-orange-400 disabled:opacity-60"
                  whileHover={!loading && selectedPromoId ? { scale: 1.02 } : {}}
                  whileTap={!loading && selectedPromoId ? { scale: 0.98 } : {}}
                >
                  {loading ? "Concediendo..." : "Conceder deseo"}
                </motion.button>
                <motion.button
                  onClick={onCancel}
                  className="flex-1 py-3 bg-black text-orange-400 border-4 border-orange-700 font-black uppercase tracking-wider hover:bg-orange-950 hover:border-orange-500 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancelar
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
