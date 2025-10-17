"use client"

import { useState, useEffect } from "react"
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
  const [fieldErrors, setFieldErrors] = useState({}) // 👈 Errores por campo
  const [productoColores, setProductoColores] = useState([])
  const [nombreProductoActual, setNombreProductoActual] = useState("")

  useEffect(() => {
    async function init() {
      try {
        const coloresRes = await getColores()
        if (coloresRes.success) setColores(coloresRes.data)

        const productosRes = await getProductos()
        if (productosRes.success) setProductos(productosRes.data.productos || [])

        const pcRes = await getProductoColores()
        if (pcRes.success) setProductoColores(pcRes.data.data)

        if (initialId) cargarRegistro(initialId)
      } catch (err) {
        setErrorMsg("Error al inicializar el formulario.")
      }
    }
    init()
  }, [])

  const cargarRegistro = async (pcId) => {
    try {
      const res = await getProductoColorById(pcId)
      if (res.success) {
        setId(pcId)
        setColorId(res.data.colorId || "")
        setProductoId(res.data.productoId || "")
        setImagenPreview(res.data.imagenUrl || null)
        setImagenFile(null)

        const producto = productos.find((p) => p.id === res.data.data.productoId)
        setNombreProductoActual(producto?.nombre || "")

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
    setImagenFile(file)
    if (file) setImagenPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFieldErrors({})
    setErrorMsg("")

    const errors = {}
    if (!productoId) errors.productoId = "Debes seleccionar un producto."
    if (!colorId) errors.colorId = "Debes seleccionar un color."

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)

    try {
      const payload = new FormData()
      payload.append("colorId", colorId)
      payload.append("productoId", productoId)
      if (imagenFile) payload.append("imagen", imagenFile)

      const res = id ? await updateProductoColor(id, payload) : await createProductoColor(payload)

      if (res.success) {
        onSuccess?.()
        resetForm()
        const pcRes = await getProductoColores()
        if (pcRes.success) setProductoColores(pcRes.data.data)
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

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      <div className="hidden md:block">
        <SidebarEmpleado />
      </div>

      {/* Contenido principal */}
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

            {!id && (
              <div className="grid gap-6 md:grid-cols-2 mb-6">
                <div>
                  <label className="block mb-2 font-bold uppercase text-sm">Seleccionar producto *</label>
                  <select
                    value={productoId}
                    onChange={(e) => setProductoId(e.target.value)}
                    required
                    className={`w-full p-3 bg-white text-black border-2 border-white focus:outline-none ${
                      fieldErrors.productoId ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">-- SELECCIONA UN PRODUCTO --</option>
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.productoId && (
                    <p className="text-red-400 text-sm mt-1 font-medium">{fieldErrors.productoId}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 font-bold uppercase text-sm">Seleccionar color *</label>
                  <select
                    value={colorId}
                    onChange={(e) => setColorId(e.target.value)}
                    required
                    className={`w-full p-3 bg-white text-black border-2 border-white focus:outline-none ${
                      fieldErrors.colorId ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">-- SELECCIONA UN COLOR --</option>
                    {colores.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.colorId && (
                    <p className="text-red-400 text-sm mt-1 font-medium">{fieldErrors.colorId}</p>
                  )}
                </div>
              </div>
            )}

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

          {/* Listado */}
          <div>
            <h3 className="font-bold mb-4 text-black text-2xl uppercase">Lista de Colores de Productos</h3>
            {productoColores.length === 0 ? (
              <p className="text-gray-600 text-center py-8 border-2 border-black">No hay registros aún.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productoColores.map((pc) => (
                  <div
                    key={pc.id}
                    className="bg-white border-2 border-black p-0 hover:border-gray-600 transition-colors overflow-hidden"
                  >
                    {/* Imagen del producto */}
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

                    {/* Información del producto */}
                    <div className="p-4">
                      <h4 className="font-bold uppercase text-sm mb-1 text-black">{pc.nombreProducto}</h4>
                      <p className="text-gray-600 text-sm mb-4">{pc.nombreColor}</p>

                      {/* Botones */}
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
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
