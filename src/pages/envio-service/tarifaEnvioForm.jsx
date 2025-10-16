import { useEffect, useState } from "react";
import {
  createTarifaEnvio,
  getTarifaEnvios,
  getTarifaEnvioById,
  updateTarifaEnvio,
} from "../../api-gateway/tarifa.envio.crud.js";


const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

export default function TarifaEnvioForm() {
  const [tarifas, setTarifas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    peso_minimo: "",
    peso_maximo: "",
    volumen_min: "",
    volumen_max: "",
    costo_base: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadTarifas = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getTarifaEnvios();
      if (res.success) {

        const list = Array.isArray(res.data) ? res.data : [];
        list.sort((a, b) => (a.peso_minimo - b.peso_minimo) || (a.volumen_min - b.volumen_min));
        setTarifas(list);
      } else {
        setError(res.error || "Error al obtener las tarifas.");
      }
    } catch {
      setError("Error al cargar las tarifas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTarifas();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const validate = () => {
    const pmin = toNum(form.peso_minimo);
    const pmax = toNum(form.peso_maximo);
    const vmin = toNum(form.volumen_min);
    const vmax = toNum(form.volumen_max);
    const cbase = toNum(form.costo_base);

    if ([pmin, pmax, vmin, vmax, cbase].some(Number.isNaN)) {
      return "Todos los campos deben ser numéricos válidos.";
    }
    if (form.peso_minimo === "" || form.peso_maximo === "" || form.volumen_min === "" || form.volumen_max === "" || form.costo_base === "") {
      return "Todos los campos son obligatorios.";
    }
    if (pmin > pmax) return "peso_minimo no puede ser mayor que peso_maximo.";
    if (vmin > vmax) return "volumen_min no puede ser mayor que volumen_max.";
    if (cbase < 0) return "costo_base no puede ser negativo.";
    return "";
  };

  const resetForm = () => {
    setForm({
      peso_minimo: "",
      peso_maximo: "",
      volumen_min: "",
      volumen_max: "",
      costo_base: "",
    });
    setEditingId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    const payload = {
      peso_minimo: toNum(form.peso_minimo),
      peso_maximo: toNum(form.peso_maximo),
      volumen_min: toNum(form.volumen_min),
      volumen_max: toNum(form.volumen_max),
      costo_base: toNum(form.costo_base),
    };

    setLoading(true);
    try {
      const res = editingId
        ? await updateTarifaEnvio(editingId, payload)
        : await createTarifaEnvio(payload);

      if (res.success) {
        setSuccess(editingId ? "Tarifa actualizada correctamente." : "Tarifa creada exitosamente.");
        resetForm();
        loadTarifas();
      } else {
        setError(res.error || "Operación fallida.");
      }
    } catch {
      setError("Error de red o del servidor.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = async (id) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await getTarifaEnvioById(id);
      if (res.success && res.data) {
        const t = res.data;
        setEditingId(t.id ?? t.id_tarifa ?? id);
        setForm({
          peso_minimo: t.peso_minimo ?? "",
          peso_maximo: t.peso_maximo ?? "",
          volumen_min: t.volumen_min ?? "",
          volumen_max: t.volumen_max ?? "",
          costo_base: t.costo_base ?? "",
        });
      } else {
        setError(res.error || "No se pudo cargar la tarifa seleccionada.");
      }
    } catch {
      setError("Error al obtener la tarifa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-400">Gestión de Tarifas de Envío</h1>
          <button
            onClick={loadTarifas}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-60"
          >
            {loading ? "Cargando..." : "Recargar"}
          </button>
        </header>

        {error && (
          <div className="p-3 rounded-lg border border-red-400 bg-red-500/20 text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 rounded-lg border border-emerald-400 bg-emerald-500/20 text-emerald-200">
            {success}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-slate-800 p-4 rounded-2xl">
          <div>
            <label className="block text-xs text-slate-300 mb-1">Peso mínimo (kg)</label>
            <input
              type="number"
              step="0.01"
              name="peso_minimo"
              value={form.peso_minimo}
              onChange={onChange}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. 0"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">Peso máximo (kg)</label>
            <input
              type="number"
              step="0.01"
              name="peso_maximo"
              value={form.peso_maximo}
              onChange={onChange}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. 5"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">Volumen mínimo (cm³)</label>
            <input
              type="number"
              step="1"
              name="volumen_min"
              value={form.volumen_min}
              onChange={onChange}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. 0"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">Volumen máximo (cm³)</label>
            <input
              type="number"
              step="1"
              name="volumen_max"
              value={form.volumen_max}
              onChange={onChange}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. 50000"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">Costo base (Q)</label>
            <input
              type="number"
              step="0.01"
              name="costo_base"
              value={form.costo_base}
              onChange={onChange}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. 25"
              required
            />
          </div>

          <div className="md:col-span-5 flex justify-end gap-3">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-700"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold disabled:opacity-60"
            >
              {editingId ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-700 text-blue-300">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Peso (kg)</th>
                <th className="p-3 text-left">Volumen (cm³)</th>
                <th className="p-3 text-left">Costo base (Q)</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && tarifas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-400">Cargando...</td>
                </tr>
              ) : tarifas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-400">Sin tarifas registradas</td>
                </tr>
              ) : (
                tarifas.map((t) => (
                  <tr key={t.id ?? t.id_tarifa} className="border-b border-slate-700">
                    <td className="p-3">{t.id ?? t.id_tarifa}</td>
                    <td className="p-3">
                      {t.peso_minimo} – {t.peso_maximo}
                    </td>
                    <td className="p-3">
                      {t.volumen_min} – {t.volumen_max}
                    </td>
                    <td className="p-3">Q{Number(t.costo_base).toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => startEdit(t.id ?? t.id_tarifa)}
                        className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
