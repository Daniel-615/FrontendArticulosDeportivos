import React, { useEffect, useMemo, useState } from "react"
import { getEnvios, putEnvioGuia } from "../../api-gateway/envio.js"
import { getEstadosOfEnvio, putEstadoEnvio } from "../../api-gateway/estado.envio.js"
import {
  getEnvioProductosByEnvioId,
  updateEnvioProducto,
  deleteEnvioProducto,
} from "../../api-gateway/envio.producto.js"

function cls(...xs) {
  return xs.filter(Boolean).join(" ")
}
const fMon = (n) => {
  const v = typeof n === "number" ? n : Number(n)
  return Number.isFinite(v) ? v.toFixed(2) : (n ?? "—")
}

// ======== Helpers DATEONLY ========
const isDateOnly = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s)
const toDateOnly = (value) => {
  if (!value) return ""
  if (isDateOnly(value)) return value
  if (typeof value === "string") {
    const d = new Date(value)
    if (!isNaN(d)) {
      const yyyy = d.getUTCFullYear()
      const mm = String(d.getUTCMonth() + 1).padStart(2, "0")
      const dd = String(d.getUTCDate()).padStart(2, "0")
      return `${yyyy}-${mm}-${dd}`
    }
    const m = value.match(/\b(\d{4})-(\d{2})-(\d{2})\b/)
    if (m) return `${m[1]}-${m[2]}-${m[3]}`
    return ""
  }
  if (value instanceof Date && !isNaN(value)) {
    const yyyy = value.getFullYear()
    const mm = String(value.getMonth() + 1).padStart(2, "0")
    const dd = String(value.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
  }
  return ""
}
const fromInputDateToDateOnly = (s) => (isDateOnly(s) ? s : toDateOnly(s))

// ======== Estados de Envío ========
const SECUENCIA = ["pendiente", "recolectado", "en_bodega", "en_transito", "entregado"]
const nextState = (estado) => {
  const i = SECUENCIA.indexOf(String(estado || "").toLowerCase())
  return i >= 0 && i < SECUENCIA.length - 1 ? SECUENCIA[i + 1] : null
}

// ======== Normalizador de items de envio_producto (backend: id, id_envio, id_producto, cantidad, createdAt, updatedAt) ========
const mapEP = (ep) => ({
  id_envio_producto: ep.id ?? ep.id_envio_producto,
  id_envio: ep.id_envio ?? ep.envio_id ?? null,
  id_producto: ep.id_producto ?? ep.producto_id ?? null,
  cantidad: ep.cantidad ?? 0,
  createdAt: ep.createdAt ?? null,
  updatedAt: ep.updatedAt ?? null,
  ...ep,
  __editing: false,
})

// ✅ Extrae array de productos sin importar si viene en data, productos o items
const extractEPItems = (resp) => {
  if (!resp) return []
  const candidates = [resp.productos, resp.data, resp.items, resp?.data?.items, resp?.data?.productos]
  for (const c of candidates) if (Array.isArray(c)) return c
  // En algunos casos, la API puede devolver { data: { ... } } con el array dentro de data.* distinto
  // Si nada aplica, intenta detectar un único item suelto
  if (resp && typeof resp === "object" && resp.id_producto) return [resp]
  return []
}

const fmtDT = (s) => (s ? new Date(s).toLocaleString() : "—")

export default function EnviosManager() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  const [savingId, setSavingId] = useState(null) // guardar fecha
  const [advancingId, setAdvancingId] = useState(null) // avanzar estado

  // Para envio_producto
  const [savingEPId, setSavingEPId] = useState(null) // id_envio_producto en guardado
  const [removingEPId, setRemovingEPId] = useState(null) // id_envio_producto en borrado

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  // drafts[numero_guia] = { open, fecha_estimada, estados, estado: {id_estado, valor}, envioProductos: [...] }
  const [drafts, setDrafts] = useState({})

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getEnvios()
      if (!res?.success) throw new Error(res?.error || "No se pudo cargar")
      const data = Array.isArray(res.data) ? res.data : (res.data?.items ?? [])
      setRows(data)
    } catch (e) {
      setError(e.message || "Error al cargar los envíos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return rows
    return rows.filter(
      (r) =>
        String(r.numero_guia ?? "")
          .toLowerCase()
          .includes(term) ||
        String(r.id_usuario ?? "")
          .toLowerCase()
          .includes(term) ||
        String(r.direccion_destino ?? "")
          .toLowerCase()
          .includes(term),
    )
  }, [rows, q])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  const pickActual = (estados = []) => {
    if (!Array.isArray(estados) || estados.length === 0) return null
    const sorted = [...estados].sort((a, b) => {
      const da = new Date(a.fecha || a.createdAt || 0).getTime()
      const db = new Date(b.fecha || b.createdAt || 0).getTime()
      return da - db
    })
    return sorted[sorted.length - 1]
  }

  const refetchEnvioProductos = async (idEnvio, numero_guia) => {
    try {
      const rp = await getEnvioProductosByEnvioId(idEnvio)
      if (rp?.success) {
        const items = extractEPItems(rp)
        const norm = items.map(mapEP)
        setDrafts((prev) => {
          if (!prev[numero_guia]) return prev
          return {
            ...prev,
            [numero_guia]: {
              ...prev[numero_guia],
              envioProductos: norm,
            },
          }
        })
      } else {
        console.error("Error al recargar productos:", rp?.error)
      }
    } catch (e) {
      console.error("Fallo al recargar productos del envío:", e)
      setError("No se pudieron recargar los productos del envío")
    }
  }

  const startEdit = async (row) => {
    const key = row.numero_guia
    const fecha = toDateOnly(row.fecha_estimada) || ""
    const idEnvio = row.id_envio ?? row.id ?? row.envio_id

    let estados = []
    let actual = null

    try {
      if (idEnvio != null) {
        const resp = await getEstadosOfEnvio(idEnvio)
        if (resp?.success) {
          estados = Array.isArray(resp.data) ? resp.data : (resp.data?.items ?? [])
          actual = pickActual(estados)
        }
      }
    } catch (e) {
      console.error("Fallo al cargar estados:", e)
    }

    // Cargar productos del envío (normalizados)
    let envioProductos = []
    try {
      // Si el row ya trae productos desde getEnvios(), úsalos
      if (Array.isArray(row.productos) && row.productos.length) {
        envioProductos = row.productos.map(mapEP)
      } else if (idEnvio != null) {
        const rp = await getEnvioProductosByEnvioId(idEnvio)
        if (rp?.success) {
          const raw = extractEPItems(rp)
          envioProductos = raw.map(mapEP)
        } else {
          console.error("Error al cargar productos:", rp?.error)
        }
      }
    } catch (e) {
      console.error("Fallo al cargar productos del envío:", e)
      setError("No se pudieron cargar los productos del envío")
    }

    setDrafts((d) => ({
      ...d,
      [key]: {
        open: true,
        fecha_estimada: fecha,
        estados,
        estado: {
          id_estado: actual?.id_estado ?? null,
          valor: actual?.estado ?? null,
        },
        envioProductos,
      },
    }))
  }

  const cancelEdit = (numero_guia) => {
    setDrafts((d) => {
      const nd = { ...d }
      delete nd[numero_guia]
      return nd
    })
  }

  const onDateChange = (numero_guia, value) => {
    setDrafts((d) => ({ ...d, [numero_guia]: { ...d[numero_guia], fecha_estimada: value } }))
  }

  const hasDateChanges = (row, draft) => {
    const current = toDateOnly(row.fecha_estimada) || ""
    return current !== (draft.fecha_estimada || "")
  }

  const saveRow = async (row) => {
    const numero_guia = row.numero_guia
    const draft = drafts[numero_guia]
    if (!draft) return

    const doUpdateDate = hasDateChanges(row, draft)

    if (!doUpdateDate) {
      cancelEdit(numero_guia)
      return
    }

    setError(null)
    setSuccess(null)

    if (!draft.fecha_estimada) {
      setError("Selecciona una fecha válida.")
      return
    }
    setSavingId(numero_guia)
    try {
      const payload = { fecha_estimada: fromInputDateToDateOnly(draft.fecha_estimada) }
      const res = await putEnvioGuia(numero_guia, payload)
      if (!res?.success) throw new Error(res?.error || "No se pudo actualizar la fecha")
    } catch (e) {
      setSavingId(null)
      setError(e.message || "Error al actualizar la fecha")
      return
    } finally {
      setSavingId(null)
    }

    await load()
    setReloadKey((k) => k + 1)
    setSuccess(`Se actualizó ${numero_guia} correctamente.`)
    setTimeout(() => setSuccess(null), 2500)
    cancelEdit(numero_guia)
  }

  const advanceEstado = async (row) => {
    const numero_guia = row.numero_guia
    const d = drafts[numero_guia]
    if (!d?.estado?.id_estado) {
      setError("No se encontró un estado actual para este envío.")
      return
    }
    if (String(d.estado.valor).toLowerCase() === "entregado") return

    setError(null)
    setSuccess(null)
    setAdvancingId(numero_guia)
    try {
      const res = await putEstadoEnvio(d.estado.id_estado, { accion: "avanzar_estado" })
      if (!res?.success) throw new Error(res?.error || "No se pudo avanzar el estado")

      const idEnvio = row.id_envio ?? row.id ?? row.envio_id
      if (idEnvio != null) {
        const respH = await getEstadosOfEnvio(idEnvio)
        if (respH?.success) {
          const estados = Array.isArray(respH.data) ? respH.data : (respH.data?.items ?? [])
          const actual = pickActual(estados)
          setDrafts((prev) => ({
            ...prev,
            [numero_guia]: {
              ...prev[numero_guia],
              estados,
              estado: {
                id_estado: actual?.id_estado ?? null,
                valor: actual?.estado ?? null,
              },
            },
          }))
        }
      }
    } catch (e) {
      setAdvancingId(null)
      setError(e.message || "Error al avanzar el estado")
      return
    } finally {
      setAdvancingId(null)
    }

    await load()
    setReloadKey((k) => k + 1)
    setSuccess(`Estado de ${numero_guia} actualizado correctamente.`)
    setTimeout(() => setSuccess(null), 2500)
  }

  // ======== UI Badge ========
  const EstadoBadge = ({ value }) => {
    if (!value) return <span className="text-xs text-white/40">—</span>
    const v = String(value).toLowerCase()
    const color =
      v === "entregado"
        ? "bg-white/10 text-white border-white/20"
        : v === "pendiente"
          ? "bg-white/5 text-white/60 border-white/10"
          : "bg-white/5 text-white/80 border-white/20"
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${color}`}>
        {v.replaceAll("_", " ").toUpperCase()}
      </span>
    )
  }

  const getEstadoActualForRow = (r) => {
    const d = drafts[r.numero_guia]
    if (d?.open && d?.estado?.valor) return d.estado.valor
    return r.estado_actual ?? null
  }

  // ======== Handlers envio_producto ========
  const onEPFieldChange = (numero_guia, id_envio_producto, field, value) => {
    setDrafts((prev) => {
      const draft = { ...(prev[numero_guia] || {}) }
      draft.envioProductos = (draft.envioProductos || []).map((ep) =>
        ep.id_envio_producto === id_envio_producto ? { ...ep, [field]: value } : ep,
      )
      return { ...prev, [numero_guia]: draft }
    })
  }

  const toggleEPEdit = (numero_guia, id_envio_producto, editing) => {
    setDrafts((prev) => {
      const draft = { ...(prev[numero_guia] || {}) }
      draft.envioProductos = (draft.envioProductos || []).map((ep) =>
        ep.id_envio_producto === id_envio_producto ? { ...ep, __editing: editing } : ep,
      )
      return { ...prev, [numero_guia]: draft }
    })
  }

  const saveEPRow = async (row, ep) => {
    const numero_guia = row.numero_guia
    const idEnvio = row.id_envio ?? row.id ?? row.envio_id

    const payload = { cantidad: Number(ep.cantidad) } // sólo cantidad

    setError(null)
    setSuccess(null)
    setSavingEPId(ep.id_envio_producto)
    try {
      const res = await updateEnvioProducto(ep.id_envio_producto, payload)
      if (!res?.success) throw new Error(res?.error || "No se pudo actualizar el producto del envío")
      if (idEnvio != null) await refetchEnvioProductos(idEnvio, numero_guia)
      setSuccess("Producto del envío actualizado.")
      setTimeout(() => setSuccess(null), 2000)
    } catch (e) {
      setError(e.message || "Error al actualizar el producto del envío")
    } finally {
      setSavingEPId(null)
    }
  }

  const deleteEPRow = async (row, id_envio_producto) => {
    const numero_guia = row.numero_guia
    const idEnvio = row.id_envio ?? row.id ?? row.envio_id

    setError(null)
    setSuccess(null)
    setRemovingEPId(id_envio_producto)
    try {
      const res = await deleteEnvioProducto(id_envio_producto)
      if (!res?.success) throw new Error(res?.error || "No se pudo eliminar el producto del envío")
      if (idEnvio != null) await refetchEnvioProductos(idEnvio, numero_guia)
      setSuccess("Producto eliminado del envío.")
      setTimeout(() => setSuccess(null), 2000)
    } catch (e) {
      setError(e.message || "Error al eliminar el producto del envío")
    } finally {
      setRemovingEPId(null)
    }
  }

  // ======== Render ========
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">GESTIÓN DE ENVÍOS</h1>
            <p className="text-sm text-white/60 mt-1 tracking-wide">
              Consulta y actualiza la <span className="text-white font-bold">fecha estimada</span>, avanza el{" "}
              <span className="text-white font-bold">estado</span> y gestiona los{" "}
              <span className="text-white font-bold">productos</span> del envío.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                setPage(1)
              }}
              placeholder="BUSCAR POR GUÍA, USUARIO O DIRECCIÓN..."
              className="w-72 max-w-full px-4 py-2 border border-white/20 rounded-lg outline-none focus:ring-2 focus:ring-white/40 bg-white/5 text-white placeholder:text-white/40 placeholder:uppercase placeholder:text-xs tracking-wide"
            />
            <button
              onClick={load}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/20 hover:bg-white/10 transition-colors font-medium tracking-wide text-sm"
            >
              {loading ? "CARGANDO..." : "RECARGAR"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-200 tracking-wide">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg border border-white/50 bg-white/10 px-4 py-3 text-sm text-white tracking-wide">
            {success}
          </div>
        )}

        <div key={reloadKey} className="overflow-x-auto rounded-xl border border-white/20 bg-white/5">
          <table className="min-w-[950px] w-full text-sm">
            <thead className="bg-white/5 text-white border-b border-white/20">
              <tr>
                <th className="text-left p-3 font-black tracking-wide">N° GUÍA</th>
                <th className="text-left p-3 font-black tracking-wide">USUARIO</th>
                <th className="text-left p-3 font-black tracking-wide">DIRECCIÓN DESTINO</th>
                <th className="text-left p-3 font-black tracking-wide">COSTO ENVÍO</th>
                <th className="text-left p-3 font-black tracking-wide">FECHA ESTIMADA</th>
                <th className="text-left p-3 font-black tracking-wide">ESTADO</th>
                <th className="p-3 text-right font-black tracking-wide">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-white/60 tracking-wide">
                    CARGANDO ENVÍOS...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-xl">
                      📦
                    </div>
                    <p className="text-white font-bold tracking-wide">SIN ENVÍOS PARA MOSTRAR</p>
                    <p className="text-white/60 text-sm tracking-wide">Ajusta la búsqueda o recarga la tabla.</p>
                  </td>
                </tr>
              ) : (
                paginated.map((r) => {
                  const d = drafts[r.numero_guia]
                  const open = Boolean(d?.open)
                  const estadoActual = getEstadoActualForRow(r)

                  return (
                    <React.Fragment key={r.numero_guia}>
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-bold tracking-wide">{r.numero_guia}</td>
                        <td className="p-3 text-white/80">{r.id_usuario ?? "—"}</td>
                        <td className="p-3">
                          <span className="inline-flex px-2 py-1 rounded-md border border-white/20 text-xs bg-white/5 tracking-wide">
                            {r.direccion_destino ?? "—"}
                          </span>
                        </td>
                        <td className="p-3 text-white/80">Q{fMon(r.costo_envio)}</td>
                        <td className="p-3 text-white/80">{toDateOnly(r.fecha_estimada) || "—"}</td>
                        <td className="p-3">
                          <EstadoBadge value={estadoActual} />
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!open ? (
                              <button
                                onClick={() => startEdit(r)}
                                className="px-3 py-1.5 rounded-lg text-sm bg-white text-black hover:bg-white/90 transition-colors font-bold tracking-wide"
                              >
                                EDITAR
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => saveRow(r)}
                                  disabled={savingId === r.numero_guia}
                                  className="px-3 py-1.5 rounded-lg text-sm bg-white text-black hover:bg-white/90 transition-colors font-bold tracking-wide"
                                >
                                  {savingId === r.numero_guia ? "GUARDANDO..." : "GUARDAR"}
                                </button>
                                <button
                                  onClick={() => cancelEdit(r.numero_guia)}
                                  className="px-3 py-1.5 rounded-lg text-sm border border-white/20 bg-white/5 hover:bg-white/10 transition-colors font-medium tracking-wide"
                                >
                                  CANCELAR
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>

                      {open && (
                        <tr className="bg-white/5">
                          <td colSpan={7} className="p-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                              <div className="flex flex-col sm:col-span-1">
                                <label className="text-xs mb-1 text-white/60 tracking-wide uppercase">
                                  Nueva fecha estimada
                                </label>
                                <input
                                  type="date"
                                  value={d.fecha_estimada}
                                  onChange={(e) => onDateChange(r.numero_guia, e.target.value)}
                                  className="px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-white/40 outline-none"
                                />
                              </div>

                              <div className="flex flex-col sm:col-span-2">
                                <label className="text-xs mb-1 text-white/60 tracking-wide uppercase">
                                  Estado del envío
                                </label>
                                <div className="flex flex-wrap items-center gap-3">
                                  <EstadoBadge value={d?.estado?.valor} />
                                  <span className="text-xs text-white/60 tracking-wide">
                                    {d?.estado?.valor
                                      ? nextState(d.estado.valor)
                                        ? `SIGUIENTE: ${nextState(d.estado.valor).replaceAll("_", " ").toUpperCase()}`
                                        : "ESTADO FINAL ALCANZADO"
                                      : "SIN ESTADO"}
                                  </span>
                                  <button
                                    onClick={() => advanceEstado(r)}
                                    disabled={
                                      !d?.estado?.id_estado ||
                                      String(d?.estado?.valor).toLowerCase() === "entregado" ||
                                      advancingId === r.numero_guia
                                    }
                                    className={cls(
                                      "px-3 py-2 rounded-lg text-sm font-bold tracking-wide transition-colors",
                                      String(d?.estado?.valor).toLowerCase() === "entregado"
                                        ? "bg-white/5 text-white/40 cursor-not-allowed border border-white/10"
                                        : "bg-white text-black hover:bg-white/90",
                                    )}
                                  >
                                    {advancingId === r.numero_guia ? "AVANZANDO..." : "AVANZAR ESTADO"}
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="mt-6">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-black tracking-wide">PRODUCTOS DEL ENVÍO</h3>
                                <span className="text-xs text-white/60 tracking-wide">
                                  {Array.isArray(d.envioProductos) ? d.envioProductos.length : 0} ÍTEM(S)
                                </span>
                              </div>

                              <div className="overflow-x-auto border border-white/20 rounded-lg bg-black">
                                <table className="min-w-[800px] w-full text-sm">
                                  <thead className="bg-white/5 border-b border-white/20">
                                    <tr className="text-left">
                                      <th className="p-2 font-black tracking-wide">#</th>
                                      <th className="p-2 font-black tracking-wide">ID ENVIO_PRODUCTO</th>
                                      <th className="p-2 font-black tracking-wide">ID PRODUCTO</th>
                                      <th className="p-2 font-black tracking-wide">CANTIDAD</th>
                                      <th className="p-2 font-black tracking-wide">CREADO</th>
                                      <th className="p-2 font-black tracking-wide">ACTUALIZADO</th>
                                      <th className="p-2 text-right font-black tracking-wide">ACCIONES</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-white/10">
                                    {(d.envioProductos ?? []).length === 0 ? (
                                      <tr>
                                        <td colSpan={7} className="p-4 text-center text-white/60 tracking-wide">
                                          SIN PRODUCTOS ASOCIADOS A ESTE ENVÍO.
                                        </td>
                                      </tr>
                                    ) : (
                                      d.envioProductos.map((ep, idx) => {
                                        const isEditing = !!ep.__editing
                                        return (
                                          <tr
                                            key={ep.id_envio_producto || `${r.numero_guia}-${idx}`}
                                            className="hover:bg-white/5"
                                          >
                                            <td className="p-2 text-white/80">{idx + 1}</td>
                                            <td className="p-2">
                                              <span className="px-2 py-1 rounded border border-white/20 text-xs bg-white/5 tracking-wide">
                                                {ep.id_envio_producto ?? "—"}
                                              </span>
                                            </td>
                                            <td className="p-2">
                                              <span className="px-2 py-1 rounded border border-white/20 text-xs bg-white/5 tracking-wide">
                                                {ep.id_producto ?? "—"}
                                              </span>
                                            </td>
                                            <td className="p-2">
                                              {isEditing ? (
                                                <input
                                                  type="number"
                                                  min={1}
                                                  value={ep.cantidad ?? ""}
                                                  onChange={(e) =>
                                                    onEPFieldChange(
                                                      r.numero_guia,
                                                      ep.id_envio_producto,
                                                      "cantidad",
                                                      e.target.value,
                                                    )
                                                  }
                                                  className="w-24 px-2 py-1 border border-white/20 rounded bg-white/5 text-white focus:ring-2 focus:ring-white/40 outline-none"
                                                />
                                              ) : (
                                                <span className="text-white/80">{ep.cantidad ?? "—"}</span>
                                              )}
                                            </td>
                                            <td className="p-2 text-white/60 text-xs">{fmtDT(ep.createdAt)}</td>
                                            <td className="p-2 text-white/60 text-xs">{fmtDT(ep.updatedAt)}</td>
                                            <td className="p-2">
                                              <div className="flex items-center justify-end gap-2">
                                                {!isEditing ? (
                                                  <>
                                                    <button
                                                      onClick={() =>
                                                        toggleEPEdit(r.numero_guia, ep.id_envio_producto, true)
                                                      }
                                                      className="px-3 py-1.5 rounded-lg text-xs bg-white text-black hover:bg-white/90 font-bold tracking-wide"
                                                    >
                                                      EDITAR
                                                    </button>
                                                    <button
                                                      onClick={() => deleteEPRow(r, ep.id_envio_producto)}
                                                      disabled={removingEPId === ep.id_envio_producto}
                                                      className={cls(
                                                        "px-3 py-1.5 rounded-lg text-xs border border-white/20 bg-white/5 hover:bg-white/10 font-medium tracking-wide",
                                                        removingEPId === ep.id_envio_producto &&
                                                          "opacity-60 cursor-not-allowed",
                                                      )}
                                                    >
                                                      {removingEPId === ep.id_envio_producto
                                                        ? "ELIMINANDO..."
                                                        : "ELIMINAR"}
                                                    </button>
                                                  </>
                                                ) : (
                                                  <>
                                                    <button
                                                      onClick={() => saveEPRow(r, ep)}
                                                      disabled={savingEPId === ep.id_envio_producto}
                                                      className={cls(
                                                        "px-3 py-1.5 rounded-lg text-xs bg-white text-black hover:bg-white/90 font-bold tracking-wide",
                                                        savingEPId === ep.id_envio_producto &&
                                                          "opacity-60 cursor-not-allowed",
                                                      )}
                                                    >
                                                      {savingEPId === ep.id_envio_producto ? "GUARDANDO..." : "GUARDAR"}
                                                    </button>
                                                    <button
                                                      onClick={() =>
                                                        toggleEPEdit(r.numero_guia, ep.id_envio_producto, false)
                                                      }
                                                      className="px-3 py-1.5 rounded-lg text-xs border border-white/20 bg-white/5 hover:bg-white/10 font-medium tracking-wide"
                                                    >
                                                      CANCELAR
                                                    </button>
                                                  </>
                                                )}
                                              </div>
                                            </td>
                                          </tr>
                                        )
                                      })
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                              <button
                                onClick={() => saveRow(r)}
                                disabled={savingId === r.numero_guia}
                                className="px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors font-bold tracking-wide"
                              >
                                {savingId === r.numero_guia ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                              </button>
                              <button
                                onClick={() => cancelEdit(r.numero_guia)}
                                className="px-4 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors font-medium tracking-wide"
                              >
                                CERRAR
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-white">
          <p className="text-sm tracking-wide">
            Mostrando{" "}
            <strong>
              {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)}
            </strong>{" "}
            de <strong>{filtered.length}</strong> envíos
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 disabled:opacity-50 hover:bg-white/10 font-medium tracking-wide text-sm"
            >
              ANTERIOR
            </button>
            <span className="px-2 py-1 text-sm tracking-wide">
              PÁGINA {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 disabled:opacity-50 hover:bg-white/10 font-medium tracking-wide text-sm"
            >
              SIGUIENTE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
