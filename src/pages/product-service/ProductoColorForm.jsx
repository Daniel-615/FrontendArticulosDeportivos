"use client"
import { useState, useEffect, useMemo } from "react"
import {
  createProductoColor,
  updateProductoColor,
  getProductoColorById,
  deleteProductoColor,
  getProductoColores,
} from "../../api-gateway/producto.color.crud.js"
import { getColores } from "../../api-gateway/color.crud.js"
import { getProductos } from "../../api-gateway/producto.crud.js"
import { ImageIcon, Edit2, Trash2 } from "lucide-react"
import SidebarEmpleado from "../../components/sideBar.jsx"
import SearchableSelect from "../../components/searchableSelect.jsx"

export default function ProductoColorForm({ id: initialId, onSuccess }) {
  const [id, setId] = useState(initialId || null)
  const [colorId, setColorId] = useState("")
  const [productoId, setProductoId] = useState("")
  const [colores, setColores] = useState([])
  const [productos, setProductos] = useState([])
  const [imagenFile, setImagenFile] = useState(null)
  const [imagenPreview, setImagenPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})
  const [productoColores, setProductoColores] = useState([])
  const [nombreProductoActual, setNombreProductoActual] = useState("")

  // Paginación interna
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(9)
  const total = productoColores.length
  const totalPages = Math.max(1, Math.ceil(total / limit))

  const pageItems = useMemo(() => {
    const start = (page - 1) * limit
    return productoColores.slice(start, start + limit)
  }, [productoColores, page, limit])

  useEffect(() => {
    async function init() {
      try {
        const [coloresRes, productosRes, pcRes] = await Promise.all([
          getColores(),
          getProductos(),           
          getProductoColores(),      
        ])

        if (coloresRes.success) setColores(coloresRes.data || [])
        if (productosRes.success) setProductos(productosRes.data?.productos || [])
        if (pcRes.success) setProductoColores(pcRes.data?.data || [])

        if (initialId) cargarRegistro(initialId)
      } catch {
        setErrorMsg("Error al inicializar el formulario.")
      }
    }
    init()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [limit, productoColores])

  const cargarRegistro = async (pcId) => {
    try {
      const res = await getProductoColorById(pcId)
      if (res.success) {
        const item = res.data || {}
        setId(pcId)
        setColorId(item.colorId ?? "")
        setProductoId(item.productoId ?? "")
        setImagenPreview(item.imagenUrl || null)
        setImagenFile(null)

        const p = productos.find((x) => String(x.id) === String(item.productoId))
        setNombreProductoActual(p?.nombre || "")

        document.getElementById("productoColorForm")?.scrollIntoView({ behavior: "smooth" })
      } else {
        setErrorMsg(res.error || "No se pudo cargar el color del producto.")
      }
    } catch {
      setErrorMsg("Error al cargar el registro.")
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setImagenFile(file || null)
    setImagenPreview(file ? URL.createObjectURL(file) : null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFieldErrors({})
    setErrorMsg("")

    const isEdit = Boolean(id)
    const errors = {}
    // 🔸 En creación exijo producto y color; en edición solo si el usuario los cambió
    if (!isEdit) {
      if (!productoId) errors.productoId = "Debes seleccionar un producto."
      if (!colorId) errors.colorId = "Debes seleccionar un color."
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)
    try {
      const payload = new FormData()
      // Si los tienes en estado, envíalos (algunos backends los requieren también en PUT)
      if (productoId) payload.append("productoId", productoId)
      if (colorId) payload.append("colorId", colorId)
      if (imagenFile) payload.append("imagen", imagenFile)

      const res = isEdit
        ? await updateProductoColor(id, payload)
        : await createProductoColor(payload)

      if (res.success) {
        onSuccess?.()
        resetForm()
        const pcRes = await getProductoColores()
        if (pcRes.success) setProductoColores(pcRes.data?.data || [])
      } else {
        setErrorMsg(res.error || "Error al guardar el color del producto.")
      }
    } catch {
      setErrorMsg("Error en la petición.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (pcId) => {
    if (!confirm("¿Estás seguro de eliminar este color de producto?")) return
    setLoading(true)
    try {
      const res = await deleteProductoColor(pcId)
      if (res.success) {
        onSuccess?.()
        if (pcId === id) resetForm()
        setProductoColores((prev) => prev.filter((pc) => pc.id !== pcId))
      } else {
        setErrorMsg(res.error || "Error al eliminar el color del producto.")
      }
    } catch {
      setErrorMsg("Error en la petición.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setId(null)
    setColorId("")
    setProductoId("")
    setImagenFile(null)
    setImagenPreview(null)
    setNombreProductoActual("")
    setErrorMsg("")
    setFieldErrors({})
  }

  const Pagination = () => {
    const baseBtn =
      "inline-flex items-center justify-center h-9 w-9 rounded-md border border-black text-sm leading-none transition-colors"
    const inactive = "bg-white text-black hover:bg-gray-100"
    const active = "bg-black text-white"
    const disabled = "opacity-50 cursor-not-allowed"

    const pages = []
    const show = (p) => p >= 1 && p <= totalPages
    pages.push(1)
    if (page - 2 > 2) pages.push("left-ellipsis")
    for (let p = page - 1; p <= page + 1; p++) if (show(p)) pages.push(p)
    if (page + 2 < totalPages - 1) pages.push("right-ellipsis")
    if (totalPages > 1) pages.push(totalPages)
    const cleaned = pages.filter((p, i) => pages.indexOf(p) === i)

    return (
      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-sm text-gray-700">
          Mostrando <span className="font-semibold">{pageItems.length}</span> de{" "}
          <span className="font-semibold">{total}</span> registros · Página{" "}
          <span className="font-semibold">{page}</span>/<span className="font-semibold">{totalPages}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            aria-label="Página anterior"
            className={`${baseBtn} ${page === 1 || loading ? disabled : inactive}`}
          >
            «
          </button>

          {cleaned.map((p, i) =>
            typeof p === "number" ? (
              <button
                key={`p-${p}-${i}`}
                onClick={() => setPage(p)}
                disabled={loading}
                aria-label={`Página ${p}`}
                className={`${baseBtn} ${p === page ? active : inactive}`}
              >
                {p}
              </button>
            ) : (
              <span key={p} className="inline-flex items-center justify-center h-9 w-9 text-gray-500 select-none">
                …
              </span>
            )
          )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            aria-label="Página siguiente"
            className={`${baseBtn} ${page === totalPages || loading ? disabled : inactive}`}
          >
            »
          </button>

          <select
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            disabled={loading}
            className="ml-2 h-9 px-2 rounded-md border border-black bg-white text-sm"
            aria-label="Elementos por página"
          >
            {[6, 9, 12, 18, 24].map((n) => (
              <option key={n} value={n}>
                {n} / pág.
              </option>
            ))}
          </select>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      <div className="hidden md:block">
        <SidebarEmpleado />
      </div>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black uppercase tracking-tight mb-2">COLOR PRODUCTO</h2>
            <div className="h-1 w-20 bg-black"></div>
          </div>

          <form id="productoColorForm" onSubmit={handleSubmit} className="bg-black text-white p-6 mb-10">
            <h3 className="text-xl font-bold uppercase mb-6">
              {id ? `Editar: ${nombreProductoActual}` : "Nuevo Color de Producto"}
            </h3>

            {errorMsg && <div className="p-4 mb-4 bg-red-600 text-white font-medium">{errorMsg}</div>}

            {/* En edición también muestro los combos (puedes deshabilitarlos si no quieres cambios) */}
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <SearchableSelect
                label="Seleccionar producto"
                required={!id}
                placeholder="SELECCIONA UN PRODUCTO"
                value={productoId}
                onChange={(v) => setProductoId(v)}
                options={productos.map((p) => ({ value: p.id, label: p.nombre }))}
                error={fieldErrors.productoId}
              />

              <SearchableSelect
                label="Seleccionar color"
                required={!id}
                placeholder="SELECCIONA UN COLOR"
                value={colorId}
                onChange={(v) => setColorId(v)}
                options={colores.map((c) => ({ value: c.id, label: c.nombre }))}
                error={fieldErrors.colorId}
              />
            </div>

            {/* Imagen */}
            <div className="mb-6">
              <label className="block mb-2 font-bold uppercase text-sm">Imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-white file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-white file:text-black file:font-bold file:uppercase file:cursor-pointer hover:file:bg-gray-200"
              />
              {imagenPreview && (
                <img
                  src={imagenPreview || "/placeholder.svg"}
                  alt="Vista previa"
                  className="mt-4 h-32 border-2 border-white object-cover"
                />
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-4 py-3 bg-gray-700 text-white font-bold uppercase hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              {id && (
                <button
                  type="button"
                  onClick={() => handleDelete(id)}
                  disabled={loading}
                  className="flex-1 px-4 py-3 text-white bg-red-600 font-bold uppercase hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  Eliminar
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 text-black bg-white font-bold uppercase hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                {loading ? "Guardando..." : id ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>

          {/* Listado con paginación interna */}
          <div>
            <h3 className="font-bold mb-4 text-black text-2xl uppercase">Lista de Colores de Productos</h3>

            {total === 0 ? (
              <p className="text-gray-600 text-center py-8 border-2 border-black">No hay registros aún.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pageItems.map((pc) => (
                    <div
                      key={pc.id}
                      className="bg-white border-2 border-black p-0 hover:border-gray-600 transition-colors overflow-hidden"
                    >
                      <div className="w-full h-48 bg-gray-100 border-b-2 border-black flex items-center justify-center overflow-hidden">
                        {pc.imagenUrl ? (
                          <img
                            src={pc.imagenUrl || "/placeholder.svg"}
                            alt={pc.nombreProducto}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-16 h-16 text-gray-400" />
                        )}
                      </div>

                      <div className="p-4">
                        <h4 className="font-bold uppercase text-sm mb-1 text-black">{pc.nombreProducto}</h4>
                        <p className="text-gray-600 text-sm mb-4">{pc.nombreColor}</p>

                        <div className="flex gap-2">
                          <button
                            onClick={() => cargarRegistro(pc.id)}
                            className="flex-1 bg-black text-white py-2 font-bold uppercase text-xs hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                          >
                            <Edit2 className="w-3 h-3" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(pc.id)}
                            className="flex-1 bg-white text-black border-2 border-black py-2 font-bold uppercase text-xs hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-3 h-3" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Pagination />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
