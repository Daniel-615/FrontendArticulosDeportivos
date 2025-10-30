import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
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
import SearchableSelect from "../../components/searchableSelect.jsx"

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
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id_talla: "",
      id_producto_color: "",
      stock: "",
    },
  })

  useEffect(() => {
    cargarItems()
    cargarTallas()
    cargarColores()
  }, [])

  const cargarItems = async () => {
    const res = await getProductoTallas()
    if (res.success) {
      setItems(Array.isArray(res.data?.tallas_color) ? res.data.tallas_color : [])
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
      setColores(Array.isArray(res.data?.data) ? res.data.data : [])
    } else setFormError(res.error || "Error al cargar colores")
  }

  const onSubmit = async (data) => {
    setFormError("")
    const payload = {
      id_talla: data.id_talla,
      id_producto_color: data.id_producto_color,
      stock: Number(data.stock),
    }

    const res = editando
      ? await updateProductoTalla(editando, payload)
      : await createProductoTalla(payload)

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
    setValue("id_talla", String(item.id_talla))
    setValue("id_producto_color", String(item.id_producto_color))
    setValue("stock", String(item.stock ?? ""))
    // scroll al formulario
    document.getElementById("tallaFormTop")?.scrollIntoView({ behavior: "smooth" })
  }

  // Opciones para los combos
  const tallaOptions = tallas.map((t) => ({ value: String(t.id), label: t.valor }))
  const colorOptions = colores.map((c) => ({
    value: String(c.id),
    label: `${c.nombreProducto} - ${c.nombreColor}`,
  }))

  return (
    <div className="flex min-h-screen bg-white">
      <SidebarEmpleado />

      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black uppercase tracking-tight mb-2">TALLA PRODUCTO</h2>
            <div className="h-1 w-20 bg-black"></div>
          </div>

          {/* Formulario */}
          <motion.div
            id="tallaFormTop"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-black text-white p-6 mb-10 border"
          >
            <h3 className="text-xl font-bold uppercase mb-6">{editando ? "Editar Registro" : "Crear Registro"}</h3>

            {formError && <p className="mb-4 p-4 bg-red-600 text-white font-medium">{formError}</p>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* TALLA */}
                <div>
                  <Controller
                    name="id_talla"
                    control={control}
                    rules={{ required: "Selecciona una talla" }}
                    render={({ field }) => (
                      <SearchableSelect
                        label="Talla"
                        required
                        placeholder="SELECCIONA TALLA"
                        value={field.value}
                        onChange={field.onChange}
                        options={tallaOptions}
                        error={errors.id_talla?.message}
                        // estilos de botón/lista para buen contraste
                        buttonClassName="border-white"
                        listClassName="bg-white"
                      />
                    )}
                  />
                </div>

                {/* PRODUCTO COLOR */}
                <div>
                  <Controller
                    name="id_producto_color"
                    control={control}
                    rules={{ required: "Selecciona un color de producto" }}
                    render={({ field }) => (
                      <SearchableSelect
                        label="Producto Color"
                        required
                        placeholder="SELECCIONA COLOR"
                        value={field.value}
                        onChange={field.onChange}
                        options={colorOptions}
                        error={errors.id_producto_color?.message}
                        buttonClassName="border-white"
                        listClassName="bg-white"
                      />
                    )}
                  />
                </div>
              </div>

              {/* STOCK */}
              <div>
                <label className="block mb-2 font-bold uppercase text-sm">Stock</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  placeholder="CANTIDAD EN STOCK"
                  className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none"
                  {...register("stock", {
                    required: "El stock es obligatorio",
                    min: { value: 0, message: "Debe ser 0 o mayor" },
                  })}
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
