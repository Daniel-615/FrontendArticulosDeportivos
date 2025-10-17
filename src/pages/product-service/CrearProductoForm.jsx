"use client"

import { useForm } from "react-hook-form"
import { createProducto } from "../../api-gateway/producto.crud.js"
import { getCategorias } from "../../api-gateway/categoria.crud.js"
import { getMarcas } from "../../api-gateway/marca.crud.js"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Package, Tag, Ruler } from "lucide-react"
import SidebarEmpleado from "../../components/sideBar.jsx"

export default function CrearProductoForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const [mensaje, setMensaje] = useState(null)
  const [exito, setExito] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [marcas, setMarcas] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const catRes = await getCategorias()
      const marcaRes = await getMarcas()
      if (catRes.success) setCategorias(catRes.data)
      if (marcaRes.success) setMarcas(marcaRes.data)
    }
    fetchData()
  }, [])

  const onSubmit = async (data) => {
    const response = await createProducto(data)
    if (response.success) {
      setExito("Producto creado correctamente.")
      setMensaje(null)
      reset()
      setTimeout(() => navigate("/actualizar/producto"), 1500)
    } else {
      setMensaje(response.error || "Error al crear producto.")
      setExito(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <SidebarEmpleado />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black uppercase tracking-tight mb-2">CREAR PRODUCTO</h2>
            <div className="h-1 w-20 bg-black"></div>
          </div>

          {mensaje && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-600 text-red-600 font-medium">{mensaje}</div>
          )}
          {exito && <div className="mb-6 p-4 bg-black text-white font-medium">{exito}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white border-2 border-black p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-black" />
                <h3 className="text-lg font-bold uppercase text-black">Información Básica</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold uppercase mb-2 text-black">Nombre</label>
                  <input
                    type="text"
                    {...register("nombre", { required: "El nombre es obligatorio." })}
                    className="w-full bg-white text-black border-2 border-black px-4 py-3 focus:outline-none focus:border-gray-600 placeholder:text-gray-400"
                  />
                  {errors.nombre && <span className="text-red-600 text-sm font-medium">{errors.nombre.message}</span>}
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase mb-2 text-black">Descripción</label>
                  <textarea
                    {...register("descripcion", { required: "La descripción es obligatoria." })}
                    rows="3"
                    className="w-full bg-white text-black border-2 border-black px-4 py-3 focus:outline-none focus:border-gray-600 placeholder:text-gray-400"
                  />
                  {errors.descripcion && (
                    <span className="text-red-600 text-sm font-medium">{errors.descripcion.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase mb-2 text-black">Precio (Q)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("precio", {
                      required: "El precio es obligatorio.",
                      min: { value: 0, message: "El precio debe ser mayor o igual a 0." },
                    })}
                    className="w-full bg-white text-black border-2 border-black px-4 py-3 focus:outline-none focus:border-gray-600 placeholder:text-gray-400"
                  />
                  {errors.precio && <span className="text-red-600 text-sm font-medium">{errors.precio.message}</span>}
                </div>
              </div>
            </div>

            <div className="bg-black text-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <Ruler className="w-5 h-5" />
                <h3 className="text-lg font-bold uppercase">Dimensiones y Peso</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold uppercase mb-2">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("peso", {
                      required: "El peso es obligatorio.",
                      min: { value: 0, message: "El peso debe ser mayor o igual a 0." },
                    })}
                    className="w-full bg-white text-black border-2 border-white px-4 py-3 focus:outline-none"
                  />
                  {errors.peso && <span className="text-red-400 text-sm font-medium">{errors.peso.message}</span>}
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase mb-2">Ancho (cm)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("ancho", {
                      required: "El ancho es obligatorio.",
                      min: { value: 0, message: "El ancho debe ser mayor o igual a 0." },
                    })}
                    className="w-full bg-white text-black border-2 border-white px-4 py-3 focus:outline-none"
                  />
                  {errors.ancho && <span className="text-red-400 text-sm font-medium">{errors.ancho.message}</span>}
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase mb-2">Alto (cm)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("alto", {
                      required: "El alto es obligatorio.",
                      min: { value: 0, message: "El alto debe ser mayor o igual a 0." },
                    })}
                    className="w-full bg-white text-black border-2 border-white px-4 py-3 focus:outline-none"
                  />
                  {errors.alto && <span className="text-red-400 text-sm font-medium">{errors.alto.message}</span>}
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase mb-2">Largo (cm)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("largo", {
                      required: "El largo es obligatorio.",
                      min: { value: 0, message: "El largo debe ser mayor o igual a 0." },
                    })}
                    className="w-full bg-white text-black border-2 border-white px-4 py-3 focus:outline-none"
                  />
                  {errors.largo && <span className="text-red-400 text-sm font-medium">{errors.largo.message}</span>}
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-black p-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-black" />
                <h3 className="text-lg font-bold uppercase text-black">Clasificación</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold uppercase mb-2 text-black">Categoría</label>
                  <select
                    {...register("categoriaId", { required: "La categoría es obligatoria." })}
                    className="w-full bg-white text-black border-2 border-black px-4 py-3 focus:outline-none focus:border-gray-600"
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.categoriaId && (
                    <span className="text-red-600 text-sm font-medium">{errors.categoriaId.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase mb-2 text-black">Marca</label>
                  <select
                    {...register("marcaId", { required: "La marca es obligatoria." })}
                    className="w-full bg-white text-black border-2 border-black px-4 py-3 focus:outline-none focus:border-gray-600"
                  >
                    <option value="">Selecciona una marca</option>
                    {marcas.map((marca) => (
                      <option key={marca.id} value={marca.id}>
                        {marca.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.marcaId && <span className="text-red-600 text-sm font-medium">{errors.marcaId.message}</span>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-4 font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Crear Producto
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
