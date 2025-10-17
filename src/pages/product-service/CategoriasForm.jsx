"use client"

import { useEffect, useState } from "react"
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from "../../api-gateway/categoria.crud.js"
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { FolderOpen, Edit2, Trash2 } from "lucide-react"
import SidebarEmpleado from "../../components/sideBar.jsx"

export default function CategoriasCrudForm() {
  const [categorias, setCategorias] = useState([])
  const [editando, setEditando] = useState(null)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    cargarCategorias()
  }, [])

  const cargarCategorias = async () => {
    const response = await getCategorias()
    if (response.success) setCategorias(response.data)
  }

  const onSubmit = async (data) => {
    let response
    if (editando) {
      response = await updateCategoria(editando, data)
    } else {
      response = await createCategoria(data)
    }

    if (response.success) {
      reset()
      setEditando(null)
      cargarCategorias()
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta categoría?")) {
      const response = await deleteCategoria(id)
      if (response.success) cargarCategorias()
    }
  }

  const handleEdit = (categoria) => {
    setEditando(categoria.id)
    setValue("nombre", categoria.nombre)
  }

  return (
    <div className="flex h-screen bg-white">
      <SidebarEmpleado />

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black uppercase tracking-tight mb-2">GESTIÓN DE CATEGORÍAS</h2>
          <div className="h-1 w-20 bg-black"></div>
        </div>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black text-white p-6 mb-10"
        >
          <h3 className="text-xl font-bold uppercase mb-4">{editando ? "Editar Categoría" : "Crear Categoría"}</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("nombre", { required: "El nombre es obligatorio" })}
              placeholder="NOMBRE DE LA CATEGORÍA"
              className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none uppercase placeholder:text-gray-400"
            />
            {errors.nombre && <p className="text-red-400 font-medium">{errors.nombre.message}</p>}

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
                  className="flex-1 bg-gray-700 text-white py-3 font-bold uppercase hover:bg-gray-600 transition-colors"
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
            {categorias.map((cat) => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4 }}
                className="bg-white border-2 border-black p-6 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <FolderOpen className="w-5 h-5 text-black" />
                  <h4 className="text-lg font-bold uppercase text-black">{cat.nombre}</h4>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="flex-1 bg-black text-white py-2 font-bold uppercase text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
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
      </main>
    </div>
  )
}
