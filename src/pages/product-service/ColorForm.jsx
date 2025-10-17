"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Edit2 } from "lucide-react"
import { postColor, getColorId, getColores, putColor } from "../../api-gateway/color.crud"
import namer from "color-namer"
import SidebarEmpleado from "../../components/sideBar.jsx"

export default function ColorCrudForm() {
  const [colores, setColores] = useState([])
  const [editando, setEditando] = useState(null)
  const [nombreManual, setNombreManual] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm()

  const codigoHex = watch("codigoHex")
  const nombre = watch("nombre")

  useEffect(() => {
    cargarColores()
  }, [])

  useEffect(() => {
    if (codigoHex && !nombreManual) {
      const nombres = namer(codigoHex)
      const nombreColor = nombres.ntc[0].name
      setValue("nombre", nombreColor)
    }
  }, [codigoHex, nombreManual, setValue])

  const cargarColores = async () => {
    const response = await getColores()
    if (response.success) setColores(response.data)
    else alert(response.error)
  }

  const onSubmit = async (data) => {
    let response
    if (editando) response = await putColor(editando, data)
    else response = await postColor(data)

    if (response.success) {
      reset()
      setEditando(null)
      setNombreManual(false)
      cargarColores()
    } else {
      alert(response.error || "No se pudo guardar el color")
    }
  }

  const editarColor = async (id) => {
    const response = await getColorId(id)
    if (response.success) {
      setEditando(id)
      setValue("nombre", response.data.nombre)
      setValue("codigoHex", response.data.codigoHex || "#000000")
      setNombreManual(false)
    } else {
      alert(response.error)
    }
  }

  const cancelarEdicion = () => {
    reset()
    setEditando(null)
    setNombreManual(false)
  }

  return (
    <div className="flex min-h-screen bg-white">
      <SidebarEmpleado />

      <div className="flex-1 flex flex-col">
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-black uppercase tracking-tight mb-2">GESTIÓN DE COLORES</h2>
              <div className="h-1 w-20 bg-black"></div>
            </div>

            <div className="bg-black text-white p-6 mb-10">
              <h3 className="text-xl font-bold uppercase mb-4">{editando ? "Editar Color" : "Agregar Color"}</h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block mb-2 font-bold uppercase text-sm">Nombre del color</label>
                  <input
                    {...register("nombre", { required: "El nombre es obligatorio" })}
                    className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none uppercase"
                    placeholder="EJ: ROJO"
                    onChange={() => setNombreManual(true)}
                  />
                  {errors.nombre && <p className="text-red-400 text-sm font-medium mt-1">{errors.nombre.message}</p>}
                </div>

                <div>
                  <label className="block mb-2 font-bold uppercase text-sm">Código HEX</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      {...register("codigoHex")}
                      className="w-20 h-12 border-2 border-white cursor-pointer"
                    />
                    <span className="text-white font-mono">{codigoHex || "#000000"}</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-white text-black py-3 font-bold uppercase hover:bg-gray-200 transition-colors"
                  >
                    {editando ? "Actualizar" : "Guardar"}
                  </button>
                  {editando && (
                    <button
                      type="button"
                      onClick={cancelarEdicion}
                      className="flex-1 bg-gray-700 text-white py-3 font-bold uppercase hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {colores.map((color) => (
                <div
                  key={color.id}
                  className="bg-white border-2 border-black p-6 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 border-2 border-black" style={{ backgroundColor: color.codigoHex }}></div>
                    <div>
                      <h4 className="font-bold uppercase text-lg text-black">{color.nombre}</h4>
                      <p className="text-sm text-gray-600 font-mono">{color.codigoHex}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => editarColor(color.id)}
                    className="w-full bg-black text-white py-2 font-bold uppercase text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
