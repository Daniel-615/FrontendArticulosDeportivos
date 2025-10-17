"use client"

import { useEffect, useState } from "react"
import { getProductos, deleteProducto, updateProducto } from "../../api-gateway/producto.crud.js"
import { useForm } from "react-hook-form"
import { Edit2, Trash2, Package } from "lucide-react"
import SidebarEmpleado from "../../components/sideBar.jsx"

export default function ProductosCrudForm() {
  const [productos, setProductos] = useState([])
  const [editando, setEditando] = useState(null)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    cargarProductos()
  }, [])

  const cargarProductos = async () => {
    const response = await getProductos()
    console.log(response)
    if (response.success) {
      setProductos(response.data.productos)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      const response = await deleteProducto(id)
      if (response.success) {
        cargarProductos()
      }
    }
  }

  const handleEdit = (producto) => {
    setEditando(producto.id)
    setValue("nombre", producto.nombre)
    setValue("descripcion", producto.descripcion)
    setValue("precio", Number.parseFloat(producto.precio))
    setValue("stock", producto.stock)
  }

  const onSubmit = async (data) => {
    const response = await updateProducto(editando, {
      ...data,
      precio: Number.parseFloat(data.precio),
      stock: Number.parseInt(data.stock),
    })
    if (response.success) {
      setEditando(null)
      reset()
      cargarProductos()
    }
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
                <p className="text-gray-700">Peso: {prod.peso} kg</p>
                <p className="text-gray-700">
                  Dimensiones: {prod.ancho} x {prod.alto} x {prod.largo} cm
                </p>
                <p className="text-gray-700">Marca: {prod.marca?.nombre || "Sin marca"}</p>
                <p className="text-gray-700">Categoría: {prod.categoria?.nombre || "Sin categoría"}</p>
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

        {editando && (
          <div className="bg-black text-white p-8 border-4 border-black">
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
                  {...register("descripcion", { required: "Descripción requerida" })}
                  rows="3"
                  className="w-full bg-white text-black border-2 border-white px-4 py-3 focus:outline-none"
                />
                {errors.descripcion && (
                  <span className="text-red-400 text-sm font-medium">{errors.descripcion.message}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold uppercase mb-2">Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("precio", { required: "Precio requerido" })}
                    className="w-full bg-white text-black border-2 border-white px-4 py-3 focus:outline-none"
                  />
                  {errors.precio && <span className="text-red-400 text-sm font-medium">{errors.precio.message}</span>}
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase mb-2">Peso</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("peso")}
                    className="w-full bg-white text-black border-2 border-white px-4 py-3 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase mb-2">Ancho</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("ancho")}
                    className="w-full bg-white text-black border-2 border-white px-4 py-3 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase mb-2">Alto</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("alto")}
                    className="w-full bg-white text-black border-2 border-white px-4 py-3 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase mb-2">Largo</label>
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
