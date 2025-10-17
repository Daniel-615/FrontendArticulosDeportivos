"use client"

import { useEffect, useState } from "react"
import { getMarcas, createMarca, updateMarca, deleteMarca } from "../../api-gateway/marca.crud.js"
import { useForm } from "react-hook-form"
import { Award, Edit2, Trash2 } from "lucide-react"
import SidebarEmpleado from "../../components/sideBar.jsx"

export default function MarcasCrudForm() {
  const [marcas, setMarcas] = useState([])
  const [editando, setEditando] = useState(null)
  const [serverError, setServerError] = useState(null) // Estado para errores del backend

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    cargarMarcas()
  }, [])

  const cargarMarcas = async () => {
    const response = await getMarcas()
    if (response.success) setMarcas(response.data)
  }

  const onSubmit = async (data) => {
    setServerError(null) // Limpiar errores previos
    let response

    try {
      if (editando) {
        response = await updateMarca(editando, data)
      } else {
        response = await createMarca(data)
      }

      if (response.success) {
        reset()
        setEditando(null)
        cargarMarcas()
      } else {
        // Mostrar mensaje de error enviado por la API
        setServerError(response.message || "Ocurrió un error desconocido.")
      }
    } catch (err) {
      // Capturar errores de red o inesperados
      setServerError(err.response?.data?.message || err.message || "Error al comunicarse con el servidor.")
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta marca?")) {
      const response = await deleteMarca(id)
      if (response.success) cargarMarcas()
    }
  }

  const handleEdit = (marca) => {
    setEditando(marca.id)
    setValue("nombre", marca.nombre)
    setServerError(null) // Limpiar errores al iniciar edición
  }

  return (
    <div className="flex h-screen bg-white">
      <SidebarEmpleado />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black uppercase tracking-tight mb-2">GESTIÓN DE MARCAS</h2>
          <div className="h-1 w-20 bg-black"></div>
        </div>

        <div className="bg-black text-white p-6 mb-10">
          <h3 className="text-xl font-bold uppercase mb-4">{editando ? "Editar Marca" : "Crear Marca"}</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("nombre", { required: "El nombre es obligatorio" })}
              placeholder="NOMBRE DE LA MARCA"
              className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none uppercase"
            />
            {errors.nombre && <p className="text-red-400 font-medium">{errors.nombre.message}</p>}
            {serverError && <p className="text-red-400 font-medium">{serverError}</p>}

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
                    setServerError(null)
                  }}
                  className="flex-1 bg-gray-700 text-white py-3 font-bold uppercase text-sm hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marcas.map((marca) => (
            <div key={marca.id} className="bg-white border-2 border-black p-6 hover:border-gray-600 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-5 h-5 text-black" />
                <h4 className="text-lg font-bold uppercase text-black">{marca.nombre}</h4>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(marca)}
                  className="flex-1 bg-black text-white py-2 font-bold uppercase text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(marca.id)}
                  className="flex-1 bg-white text-black border-2 border-black py-2 font-bold uppercase text-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
