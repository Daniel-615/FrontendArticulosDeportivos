import { useEffect, useState } from "react"
import {
  createTarifaEnvio,
  getTarifaEnvios,
  getTarifaEnvioById,
  updateTarifaEnvio,
} from "../../api-gateway/tarifa.envio.crud.js"

const toNum = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : Number.NaN
}

export default function TarifaEnvioForm() {
  const [tarifas, setTarifas] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    peso_minimo: "",
    peso_maximo: "",
    volumen_min: "",
    volumen_max: "",
    costo_base: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const loadTarifas = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await getTarifaEnvios()
      if (res.success) {
        const list = Array.isArray(res.data) ? res.data : []
        list.sort((a, b) => a.peso_minimo - b.peso_minimo || a.volumen_min - b.volumen_min)
        setTarifas(list)
      } else {
        setError(res.error || "Error al obtener las tarifas.")
      }
    } catch {
      setError("Error al cargar las tarifas.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTarifas()
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const pmin = toNum(form.peso_minimo)
    const pmax = toNum(form.peso_maximo)
    const vmin = toNum(form.volumen_min)
    const vmax = toNum(form.volumen_max)
    const cbase = toNum(form.costo_base)

    if ([pmin, pmax, vmin, vmax, cbase].some(Number.isNaN)) {
      return "Todos los campos deben ser numéricos válidos."
    }
    if (
      form.peso_minimo === "" ||
      form.peso_maximo === "" ||
      form.volumen_min === "" ||
      form.volumen_max === "" ||
      form.costo_base === ""
    ) {
      return "Todos los campos son obligatorios."
    }
    if (pmin > pmax) return "peso_minimo no puede ser mayor que peso_maximo."
    if (vmin > vmax) return "volumen_min no puede ser mayor que volumen_max."
    if (cbase < 0) return "costo_base no puede ser negativo."
    return ""
  }

  const resetForm = () => {
    setForm({
      peso_minimo: "",
      peso_maximo: "",
      volumen_min: "",
      volumen_max: "",
      costo_base: "",
    })
    setEditingId(null)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const msg = validate()
    if (msg) {
      setError(msg)
      return
    }

    const payload = {
      peso_minimo: toNum(form.peso_minimo),
      peso_maximo: toNum(form.peso_maximo),
      volumen_min: toNum(form.volumen_min),
      volumen_max: toNum(form.volumen_max),
      costo_base: toNum(form.costo_base),
    }

    setLoading(true)
    try {
      const res = editingId ? await updateTarifaEnvio(editingId, payload) : await createTarifaEnvio(payload)

      if (res.success) {
        setSuccess(editingId ? "Tarifa actualizada correctamente." : "Tarifa creada exitosamente.")
        resetForm()
        loadTarifas()
      } else {
        setError(res.error || "Operación fallida.")
      }
    } catch {
      setError("Error de red o del servidor.")
    } finally {
      setLoading(false)
    }
  }

  const startEdit = async (id) => {
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      const res = await getTarifaEnvioById(id)
      if (res.success && res.data) {
        const t = res.data
        setEditingId(t.id ?? t.id_tarifa ?? id)
        setForm({
          peso_minimo: t.peso_minimo ?? "",
          peso_maximo: t.peso_maximo ?? "",
          volumen_min: t.volumen_min ?? "",
          volumen_max: t.volumen_max ?? "",
          costo_base: t.costo_base ?? "",
        })
      } else {
        setError(res.error || "No se pudo cargar la tarifa seleccionada.")
      }
    } catch {
      setError("Error al obtener la tarifa.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">GESTIÓN DE TARIFAS DE ENVÍO</h1>
            <p className="text-sm text-white/60 mt-1 tracking-wide">Configura las tarifas basadas en peso y volumen</p>
          </div>
          <button
            onClick={loadTarifas}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 disabled:opacity-60 font-medium tracking-wide text-sm"
          >
            {loading ? "CARGANDO..." : "RECARGAR"}
          </button>
        </header>

        {error && (
          <div className="p-3 rounded-lg border border-red-500/50 bg-red-500/10 text-red-200 tracking-wide">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 rounded-lg border border-white/50 bg-white/10 text-white tracking-wide">{success}</div>
        )}

        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white/5 border border-white/20 p-6 rounded-xl"
        >
          <div>
            <label className="block text-xs text-white/60 mb-1 tracking-wide uppercase">Peso mínimo (kg)</label>
            <input
              type="number"
              step="0.01"
              name="peso_minimo"
              value={form.peso_minimo}
              onChange={onChange}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 text-white placeholder:text-white/40"
              placeholder="Ej. 0"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1 tracking-wide uppercase">Peso máximo (kg)</label>
            <input
              type="number"
              step="0.01"
              name="peso_maximo"
              value={form.peso_maximo}
              onChange={onChange}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 text-white placeholder:text-white/40"
              placeholder="Ej. 5"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1 tracking-wide uppercase">Volumen mínimo (cm³)</label>
            <input
              type="number"
              step="1"
              name="volumen_min"
              value={form.volumen_min}
              onChange={onChange}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 text-white placeholder:text-white/40"
              placeholder="Ej. 0"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1 tracking-wide uppercase">Volumen máximo (cm³)</label>
            <input
              type="number"
              step="1"
              name="volumen_max"
              value={form.volumen_max}
              onChange={onChange}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 text-white placeholder:text-white/40"
              placeholder="Ej. 50000"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1 tracking-wide uppercase">Costo base (Q)</label>
            <input
              type="number"
              step="0.01"
              name="costo_base"
              value={form.costo_base}
              onChange={onChange}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 text-white placeholder:text-white/40"
              placeholder="Ej. 25"
              required
            />
          </div>

          <div className="md:col-span-5 flex justify-end gap-3">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 font-medium tracking-wide"
              >
                CANCELAR
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-white text-black hover:bg-white/90 font-black tracking-wide disabled:opacity-60"
            >
              {editingId ? "ACTUALIZAR" : "CREAR"}
            </button>
          </div>
        </form>

        <div className="overflow-x-auto border border-white/20 rounded-xl bg-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 border-b border-white/20">
                <th className="p-3 text-left font-black tracking-wide">ID</th>
                <th className="p-3 text-left font-black tracking-wide">PESO (KG)</th>
                <th className="p-3 text-left font-black tracking-wide">VOLUMEN (CM³)</th>
                <th className="p-3 text-left font-black tracking-wide">COSTO BASE (Q)</th>
                <th className="p-3 text-center font-black tracking-wide">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading && tarifas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-white/60 tracking-wide">
                    CARGANDO...
                  </td>
                </tr>
              ) : tarifas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-white/60 tracking-wide">
                    SIN TARIFAS REGISTRADAS
                  </td>
                </tr>
              ) : (
                tarifas.map((t) => (
                  <tr key={t.id ?? t.id_tarifa} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 text-white/80">{t.id ?? t.id_tarifa}</td>
                    <td className="p-3 text-white/80">
                      {t.peso_minimo} – {t.peso_maximo}
                    </td>
                    <td className="p-3 text-white/80">
                      {t.volumen_min} – {t.volumen_max}
                    </td>
                    <td className="p-3 text-white/80">Q{Number(t.costo_base).toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => startEdit(t.id ?? t.id_tarifa)}
                        className="px-3 py-1 rounded-md bg-white text-black hover:bg-white/90 font-bold tracking-wide text-sm"
                      >
                        EDITAR
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
  )
}
