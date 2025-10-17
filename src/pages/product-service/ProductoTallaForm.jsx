"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { Edit2, Trash2 } from "lucide-react"
import {
  getProductoTallas,
  createProductoTalla,
  updateProductoTalla,
  deleteProductoTalla,
} from "../../api-gateway/producto.talla.crud.js"
import { getProductoColores } from "../../api-gateway/producto.color.crud.js"
import { getTallas } from "../../api-gateway/talla.crud.js"
import SidebarEmpleado from "../../components/sideBar.jsx"

export default function TallaColorProductoCrudForm() {
  const [items, setItems] = useState([])
  const [tallas, setTallas] = useState([])
  const [colores, setColores] = useState([])
  const [editando, setEditando] = useState(null)
  const [formError, setFormError] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    cargarItems()
    cargarTallas()
    cargarColores()
  }, [])

  const cargarItems = async () => {
    const res = await getProductoTallas()
    if (res.success) {
      setItems(Array.isArray(res.data.tallas_color) ? res.data.tallas_color : [])
    } else setFormError(res.error || "Error al cargar los registros")
  }

  const cargarTallas = async () => {
    const res = await getTallas()
    if (res.success) {
      setTallas(Array.isArray(res.data) ? res.data : [])
    } else setFormError(res.error || "Error al cargar tallas")
  }

  const cargarColores = async () => {
    const res = await getProductoColores()
    if (res.success) {
      setColores(Array.isArray(res.data.data) ? res.data.data : [])
    } else setFormError(res.error || "Error al cargar colores")
  }

  const onSubmit = async (data) => {
    setFormError("")
    const payload = {
      id_talla: data.id_talla,
      id_producto_color: data.id_producto_color,
      stock: data.stock,
    }

    let res
    if (editando) res = await updateProductoTalla(editando, payload)
    else res = await createProductoTalla(payload)

    if (res.success) {
      reset()
      setEditando(null)
      cargarItems()
    } else setFormError(res.error || "Error al guardar el registro")
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este registro?")) {
      const res = await deleteProductoTalla(id)
      if (res.success) cargarItems()
      else setFormError(res.error || "Error al eliminar registro")
    }
  }

  const handleEdit = (item) => {
    setEditando(item.id)
    setValue("id_talla", item.id_talla)
    setValue("id_producto_color", item.id_producto_color)
    setValue("stock", item.stock)
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <SidebarEmpleado />

      {/* Contenido */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black uppercase tracking-tight mb-2">TALLA PRODUCTO</h2>
            <div className="h-1 w-20 bg-black"></div>
          </div>

          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-black text-white p-6 mb-10 border"
          >
            <h3 className="text-xl font-bold uppercase mb-6">{editando ? "Editar Registro" : "Crear Registro"}</h3>

            {formError && <p className="mb-4 p-4 bg-red-600 text-white font-medium">{formError}</p>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-bold uppercase text-sm">Talla</label>
                  <select
                    {...register("id_talla", { required: "Selecciona una talla" })}
                    className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      -- SELECCIONA TALLA --
                    </option>
                    {tallas.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.valor}
                      </option>
                    ))}
                  </select>
                  {errors.id_talla && <p className="text-red-400 mt-1 font-medium">{errors.id_talla.message}</p>}
                </div>

                <div>
                  <label className="block mb-2 font-bold uppercase text-sm">Producto Color</label>
                  <select
                    {...register("id_producto_color", { required: "Selecciona un color" })}
                    className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      -- SELECCIONA COLOR --
                    </option>
                    {colores.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombreProducto} - {c.nombreColor}
                      </option>
                    ))}
                  </select>
                  {errors.id_producto_color && (
                    <p className="text-red-400 mt-1 font-medium">{errors.id_producto_color.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block mb-2 font-bold uppercase text-sm">Stock</label>
                <input
                  type="number"
                  {...register("stock", { required: "El stock es obligatorio", min: 0 })}
                  placeholder="CANTIDAD EN STOCK"
                  className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none"
                />
                {errors.stock && <p className="text-red-400 mt-1 font-medium">{errors.stock.message}</p>}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-white text-black py-3 font-bold uppercase hover:bg-gray-200 transition-colors"
                >
                  {editando ? "Actualizar" : "Crear"}
                </button>
                {editando && (
                  <button
                    type="button"
                    onClick={() => {
                      reset()
                      setEditando(null)
                      setFormError("")
                    }}
                    className="flex-1 bg-gray-700 text-white py-3 font-bold uppercase text-sm hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Lista */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white border-2 border-black p-6 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {item.color?.imagenUrl && (
                      <img
                        src={item.color.imagenUrl || "/placeholder.svg"}
                        alt={item.color?.nombreColor}
                        className="w-16 h-16 object-cover border-2 border-black"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold uppercase text-sm mb-1 text-black">{item.color?.nombreProducto}</h4>
                      <p className="text-gray-600 text-sm">{item.color?.nombreColor}</p>
                    </div>
                  </div>
                  <div className="mb-4 space-y-1">
                    <p className="text-black font-bold">TALLA: {item.talla}</p>
                    <p className="text-black font-bold">STOCK: {item.stock}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 bg-black text-white py-2 font-bold uppercase text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 bg-white text-black border-2 border-black py-2 font-bold uppercase text-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
