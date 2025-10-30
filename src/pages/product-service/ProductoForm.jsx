"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { Edit2, Trash2, Package } from "lucide-react"
import SidebarEmpleado from "../../components/sideBar.jsx"
import { getProductos, deleteProducto, updateProducto } from "../../api-gateway/producto.crud.js"

export default function ProductosCrudForm() {
  // Estado de datos y UI
  const [productos, setProductos] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10) // tu API ya usa 10
  const [loading, setLoading] = useState(false)
  const [editando, setEditando] = useState(null)
  const [error, setError] = useState(null)

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit])

  useEffect(() => {
    cargarProductos(page, limit)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit])

  const cargarProductos = async (pageArg = 1, limitArg = limit) => {
    setLoading(true)
    setError(null)
    try {
      const response = await getProductos({ page: pageArg, limit: limitArg })
      // Soporta respuesta {success, data:{...}} o {success, ...}
      const payload = response?.data ?? response
      if (response?.success && payload) {
        setProductos(payload.productos ?? [])
        setTotal(Number(payload.total ?? 0))
        setPage(Number(payload.page ?? pageArg))
        setLimit(Number(payload.limit ?? limitArg))
      } else {
        setProductos([])
        setTotal(0)
        setError(payload?.message || "No se pudieron obtener los productos.")
      }
    } catch (e) {
      setError("Error al cargar productos.")
      setProductos([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return
    try {
      const response = await deleteProducto(id)
      if (response?.success) {
        // Si borraste el último elemento visible, retrocede una página si aplica
        const nextPage = productos.length === 1 && page > 1 ? page - 1 : page
        await cargarProductos(nextPage, limit)
      }
    } catch {
      setError("Error al eliminar el producto.")
    }
  }

  const handleEdit = (producto) => {
    setEditando(producto.id)
    setValue("nombre", producto.nombre ?? "")
    setValue("descripcion", producto.descripcion ?? "")
    setValue("precio", producto.precio != null ? Number.parseFloat(producto.precio) : "")
    setValue("stock", producto.stock != null ? Number.parseInt(producto.stock) : "")
    setValue("peso", producto.peso ?? "")
    setValue("ancho", producto.ancho ?? "")
    setValue("alto", producto.alto ?? "")
    setValue("largo", producto.largo ?? "")
  }

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      precio: data.precio === "" ? null : Number.parseFloat(data.precio),
      stock: data.stock === "" ? null : Number.parseInt(data.stock),
      peso: data.peso === "" ? null : Number.parseFloat(data.peso),
      ancho: data.ancho === "" ? null : Number.parseFloat(data.ancho),
      alto: data.alto === "" ? null : Number.parseFloat(data.alto),
      largo: data.largo === "" ? null : Number.parseFloat(data.largo),
    }

    try {
      const response = await updateProducto(editando, payload)
      if (response?.success) {
        setEditando(null)
        reset()
        cargarProductos(page, limit) // recarga la página actual
      }
    } catch {
      setError("Error al actualizar el producto.")
    }
  }

  const Pagination = () => {
    // Rango compacto: 1 … (page-1, page, page+1) … total
    const pages = []
    const show = (p) => p >= 1 && p <= totalPages
    const push = (p) => pages.push(p)

    push(1)
    if (page - 2 > 2) push("left-ellipsis")
    for (let p = page - 1; p <= page + 1; p++) if (show(p)) push(p)
    if (page + 2 < totalPages - 1) push("right-ellipsis")
    if (totalPages > 1) push(totalPages)

    const cleaned = pages.filter((p, i) => pages.indexOf(p) === i)

    const baseBtn =
      "inline-flex items-center justify-center h-9 w-9 rounded-md border border-black text-sm leading-none transition-colors"
    const inactive = "bg-white text-black hover:bg-gray-100"
    const active = "bg-black text-white"
    const disabled = "opacity-50 cursor-not-allowed"

    return (
      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-sm text-gray-700">
          Mostrando <span className="font-semibold">{productos.length}</span> de{" "}
          <span className="font-semibold">{total}</span> productos · Página{" "}
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
              <span
                key={p}
                className="inline-flex items-center justify-center h-9 w-9 text-gray-500 select-none"
                aria-hidden="true"
              >
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
            onChange={(e) => {
              setPage(1)
              setLimit(parseInt(e.target.value))
            }}
            disabled={loading}
            className="ml-2 h-9 px-2 rounded-md border border-black bg-white text-sm"
            aria-label="Elementos por página"
          >
            {[6, 10, 12, 18, 24].map((n) => (
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
    <div className="flex h-screen bg-white">
      {/* Sidebar externo */}
      <SidebarEmpleado />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black uppercase tracking-tight mb-2">ACTUALIZAR PRODUCTOS</h2>
          <div className="h-1 w-20 bg-black"></div>
        </div>

        {/* Estado / errores */}
        {loading && <div className="mb-4 text-gray-600">Cargando productos…</div>}
        {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}
        {!loading && !error && productos.length === 0 && (
          <div className="mb-4 text-gray-600">No hay productos para mostrar.</div>
        )}

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {productos.map((prod) => (
            <div key={prod.id} className="bg-white border-2 border-black p-6 hover:border-gray-600 transition-colors">
              <div className="flex items-start gap-3 mb-4">
                <Package className="w-5 h-5 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-black uppercase mb-1">{prod.nombre}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{prod.descripcion}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <p className="font-bold text-black">PRECIO: Q{Number(prod.precio).toFixed(2)}</p>
                {prod.peso != null && prod.peso !== "" && <p className="text-gray-700">Peso: {prod.peso} kg</p>}
                {(prod.ancho != null || prod.alto != null || prod.largo != null) && (
                  <p className="text-gray-700">
                    Dimensiones: {prod.ancho ?? "-"} x {prod.alto ?? "-"} x {prod.largo ?? "-"} cm
                  </p>
                )}
                <p className="text-gray-700">Marca: {prod.marca?.nombre || "Sin marca"}</p>
                <p className="text-gray-700">Categoría: {prod.categoria?.nombre || "Sin categoría"}</p>
                {prod.stock != null && <p className="text-gray-700">Stock: {prod.stock}</p>}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(prod)}
                  className="flex-1 bg-black text-white py-2 font-bold uppercase text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(prod.id)}
                  className="flex-1 bg-white text-black border-2 border-black py-2 font-bold uppercase text-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <Pagination />

        {/* Formulario de edición */}
        {editando && (
          <div className="bg-black text-white p-8 border-4 border-black mt-8">
            <h3 className="text-2xl font-bold uppercase mb-6">Editar Producto</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase mb-2">Nombre</label>
                <input
                  type="text"
                  {...register("nombre", { required: "Nombre requerido" })}
                  className="w-full bg-white text-black border-2 border-white px-4 py-3 focus:outline-none"
                />
                {errors.nombre && <span className="text-red-400 text-sm font-medium">{errors.nombre.message}</span>}
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-2">Descripción</label>
                <textarea
                  rows="3"
                  {...register("descripcion", { required: "Descripción requerida" })}
                  className="w-full bg-white text-black border-2 border-white px-4 py-3 focus:outline-none"
                />
                {errors.descripcion && (
                  <span className="text-red-400 text-sm font-medium">{errors.descripcion.message}</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold uppercase mb-2">Precio (Q)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("precio", { required: "Precio requerido" })}
                    className="w-full bg-white text-black border-2 border-white px-4 py-3 focus:outline-none"
                  />
                  {errors.precio && <span className="text-red-400 text-sm font-medium">{errors.precio.message}</span>}
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase mb-2">Stock</label>
                  <input
                    type="number"
                    {...register("stock", { required: "Stock requerido", min: { value: 0, message: "Mínimo 0" } })}
                    className="w-full bg-white text-black border-2 border-white px-4 py-3 focus:outline-none"
                  />
                  {errors.stock && <span className="text-red-400 text-sm font-medium">{errors.stock.message}</span>}
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase mb-2">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("peso")}
                    className="w-full bg-white text-black border-2 border-white px-4 py-3 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase mb-2">Ancho (cm)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("ancho")}
                    className="w-full bg-white text-black border-2 border-white px-4 py-3 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase mb-2">Alto (cm)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("alto")}
                    className="w-full bg-white text-black border-2 border-white px-4 py-3 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase mb-2">Largo (cm)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("largo")}
                    className="w-full bg-white text-black border-2 border-white px-4 py-3 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    reset()
                    setEditando(null)
                  }}
                  className="flex-1 bg-white text-black py-3 font-bold uppercase hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-white text-black py-3 font-bold uppercase hover:bg-gray-200 transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
