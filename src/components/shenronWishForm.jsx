
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Truck, Percent, Dice5 } from "lucide-react";
import { createDeseo } from "../api-gateway/deseo.crud.js";


export default function ShenronWishForm({ usuarioId, open, onGranted, onCancel }) {
  const [selected, setSelected] = useState("");
  const [porcentaje, setPorcentaje] = useState(10);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const options = useMemo(
    () => [
      { id: "ENVIO_GRATIS", icon: <Truck className="w-4 h-4" />, label: "Envío gratis", desc: "Gratis en el envío de tu pedido." },
      { id: "DESC_FIJO", icon: <Percent className="w-4 h-4" />, label: "Descuento fijo (%)", desc: "Elige un porcentaje y aplícalo." },
      { id: "DESC_RANDOM", icon: <Dice5 className="w-4 h-4" />, label: "Descuento aleatorio", desc: "Shenron decide el % 👀" },
    ],
    []
  );

  const buildPayload = () => {
    if (selected === "ENVIO_GRATIS") return { tipo: "ENVIO_GRATIS" };
    if (selected === "DESC_RANDOM") return { tipo: "DESC_RANDOM" };
    if (selected === "DESC_FIJO") return { tipo: "DESC_FIJO", porcentaje: Number(porcentaje) || 0 };
    return {}; 
  };

  const handleGrant = async () => {
    if (!usuarioId) {
      setErr("Falta usuarioId.");
      return;
    }
    if (!selected) {
      setErr("Selecciona un deseo.");
      return;
    }
    if (selected === "DESC_FIJO" && (porcentaje === "" || porcentaje == null)) {
      setErr("Indica un porcentaje para el descuento fijo.");
      return;
    }
    if (selected === "DESC_FIJO" && (Number(porcentaje) < 0 || Number(porcentaje) > 100)) {
      setErr("El porcentaje debe estar entre 0 y 100.");
      return;
    }

    setLoading(true);
    setErr("");
    try {
      const payload = buildPayload();
      const resp = await createDeseo(usuarioId, payload);
      if (!resp.success) {
        setErr(resp.error || "No se pudo conceder el deseo.");
        setLoading(false);
        return;
      }

      const data = resp.data || {};
      const result = {
        deseo: data.deseo,
        promocion: data.promocion || data.promo,
      };

      onGranted?.(result);
    } catch (e) {
      setErr("Error de red o del servidor.");
      setLoading(false);
    }
  };

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

              {/* Opciones */}
              <div className="grid grid-cols-1 gap-3 mb-6">
                {options.map((opt, idx) => (
                  <motion.button
                    key={opt.id}
                    onClick={() => setSelected(opt.id)}
                    className={`w-full p-4 border-4 transition-all text-left font-bold uppercase text-sm ${
                      selected === opt.id
                        ? "border-orange-400 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/50"
                        : "border-orange-700 bg-black/50 text-orange-300 hover:bg-orange-950/50 hover:border-orange-500"
                    }`}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <div className="flex items-center gap-3">
                      {opt.icon}
                      <span className="text-base">{opt.label}</span>
                    </div>
                    <div className="text-xs opacity-80 mt-1 normal-case">{opt.desc}</div>
                  </motion.button>
                ))}
              </div>

              {/* Campo porcentaje si corresponde */}
              {selected === "DESC_FIJO" && (
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-2 uppercase text-orange-200">Porcentaje</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={porcentaje}
                      onChange={(e) => setPorcentaje(e.target.value)}
                      placeholder="Ej: 10"
                      className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none uppercase placeholder:text-gray-400"
                    />
                    <Percent className="w-5 h-5 text-orange-300" />
                  </div>
                  <p className="text-xs text-orange-300 mt-1">Rango permitido: 0 a 100.</p>
                </div>
              )}

              {/* Error */}
              {err && (
                <div className="mb-4 text-red-400 font-bold">
                  {err}
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-4">
                <motion.button
                  onClick={handleGrant}
                  disabled={loading || !selected}
                  className="flex-1 py-3 bg-gradient-to-b from-orange-500 to-orange-600 text-white font-black uppercase tracking-wider border-4 border-orange-400 disabled:opacity-60"
                  whileHover={!loading && selected ? { scale: 1.02 } : {}}
                  whileTap={!loading && selected ? { scale: 0.98 } : {}}
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
