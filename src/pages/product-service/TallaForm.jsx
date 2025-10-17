"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Ruler, Edit2, Trash2 } from "lucide-react"
import { getTallas, postTalla, putTalla, deleteTalla } from "../../api-gateway/talla.crud.js"
import SidebarEmpleado from "../../components/sideBar.jsx"

export default function TallasCrudForm() {
  const [tallas, setTallas] = useState([])
  const [editando, setEditando] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    cargarTallas()
  }, [])

  const cargarTallas = async () => {
    const response = await getTallas()
    if (response.success) setTallas(response.data)
  }

  const onSubmit = async (data) => {
    let response
    if (editando) {
      response = await putTalla(editando, data)
    } else {
      response = await postTalla(data)
    }

    if (response.success) {
      reset()
      setEditando(null)
      cargarTallas()
    } else {
      alert(response.error || "No se pudo guardar la talla")
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta talla?")) {
      const response = await deleteTalla(id)
      if (response.success) {
        cargarTallas()
      } else {
        alert(response.error || "No se pudo eliminar la talla")
      }
    }
  }

  const handleEdit = (talla) => {
    setEditando(talla.id)
    setValue("valor", talla.valor)
  }

  return (
    <div className="flex h-screen bg-white">
      <SidebarEmpleado />

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black uppercase tracking-tight mb-2">GESTIÓN DE TALLAS</h2>
          <div className="h-1 w-20 bg-black"></div>
        </div>

        <div className="bg-black text-white p-6 mb-10">
          <h3 className="text-xl font-bold uppercase mb-4">{editando ? "Editar Talla" : "Crear Talla"}</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("valor", { required: "El valor es obligatorio" })}
              placeholder="TALLA (EJ. S, M, L, 38, 40...)"
              className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none uppercase"
            />
            {errors.valor && <p className="text-red-400 font-medium">{errors.valor.message}</p>}

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
                  }}
                  className="flex-1 bg-gray-700 text-white py-3 font-bold uppercase text-sm hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tallas.map((t) => (
            <div key={t.id} className="bg-white border-2 border-black p-6 hover:border-gray-600 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <Ruler className="w-5 h-5 text-black" />
                <h4 className="text-2xl font-bold uppercase text-black">{t.valor}</h4>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(t)}
                  className="flex-1 bg-black text-white py-2 font-bold uppercase text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
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
