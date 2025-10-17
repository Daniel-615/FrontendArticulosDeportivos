"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit2, Trash2, Plus, ArrowLeft } from "lucide-react"
import SidebarEmpleado from "../../../components/sideBar.jsx"

import { getRoles, deleteRol, updateRol, createRol } from "../../../api-gateway/rol.crud.js"

function AdminRol() {
  const [roles, setRoles] = useState([])
  const [mensaje, setMensaje] = useState(null)
  const [rolEditando, setRolEditando] = useState(null)
  const [nombreEditado, setNombreEditado] = useState("")
  const [nombreNuevo, setNombreNuevo] = useState("")

  const navigate = useNavigate()

  const cargarRoles = async () => {
    const response = await getRoles()
    if (response.success) {
      setRoles(response.data)
    } else {
      setMensaje(response.error)
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este rol?")) return
    const response = await deleteRol(id)
    if (response.success) {
      alert("Rol eliminado.")
      cargarRoles()
    } else {
      setMensaje(response.error)
    }
  }

  const handleGuardarEdicion = async () => {
    const response = await updateRol(rolEditando.id, {
      nombre: nombreEditado,
    })
    if (response.success) {
      alert("Rol actualizado.")
      setRolEditando(null)
      cargarRoles()
    } else {
      setMensaje(response.error)
    }
  }

  const handleCrearRol = async () => {
    if (!nombreNuevo.trim()) {
      setMensaje("El nombre del rol no puede estar vacío.")
      return
    }
    const response = await createRol({ nombre: nombreNuevo })
    if (response.success) {
      alert("Rol creado correctamente.")
      setNombreNuevo("")
      cargarRoles()
    } else {
      setMensaje(response.error)
    }
  }

  useEffect(() => {
    cargarRoles()
  }, [])

  return (
    <div className="flex h-screen bg-white">
      <SidebarEmpleado />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate("/admin-panel")}
            className="bg-black text-white p-3 hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-black uppercase tracking-tight mb-2">GESTIÓN DE ROLES</h2>
            <div className="h-1 w-20 bg-black"></div>
          </div>
        </div>

        {mensaje && <p className="text-red-600 font-medium mb-4 p-4 bg-red-50 border-2 border-red-600">{mensaje}</p>}

        <div className="bg-black text-white p-6 mb-10">
          <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Crear Nuevo Rol
          </h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={nombreNuevo}
              onChange={(e) => setNombreNuevo(e.target.value)}
              className="flex-1 px-4 py-3 bg-white text-black border-2 border-white focus:outline-none uppercase"
              placeholder="NOMBRE DEL ROL"
            />
            <button
              onClick={handleCrearRol}
              className="bg-white text-black px-6 py-3 font-bold uppercase hover:bg-gray-200 transition-colors"
            >
              Crear
            </button>
          </div>
        </div>

        <div className="border-2 border-black">
          <div className="bg-black text-white grid grid-cols-3 font-bold uppercase text-sm">
            <div className="px-6 py-4">ID</div>
            <div className="px-6 py-4">Nombre</div>
            <div className="px-6 py-4">Acciones</div>
          </div>
          {roles && roles.length > 0 ? (
            roles.map((r, idx) => (
              <div
                key={r.id}
                className={`grid grid-cols-3 border-t-2 border-black ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <div className="px-6 py-4 text-black font-bold">{r.id}</div>
                <div className="px-6 py-4 text-black font-medium uppercase">{r.nombre}</div>
                <div className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => {
                      setRolEditando(r)
                      setNombreEditado(r.nombre)
                    }}
                    className="bg-black text-white px-4 py-2 font-bold uppercase text-xs hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    <Edit2 className="w-3 h-3" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(r.id)}
                    className="bg-white text-black border-2 border-black px-4 py-2 font-bold uppercase text-xs hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-3 h-3" />
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-600 border-t-2 border-black">No hay roles disponibles.</div>
          )}
        </div>

        {rolEditando && (
          <div className="mt-10 bg-black text-white p-6 border-2 border-black">
            <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
              <Edit2 className="w-5 h-5" />
              Editar Rol
            </h3>
            <input
              type="text"
              value={nombreEditado}
              onChange={(e) => setNombreEditado(e.target.value)}
              className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none uppercase mb-4"
              placeholder="NOMBRE DEL ROL"
            />
            <div className="flex gap-4">
              <button
                onClick={handleGuardarEdicion}
                className="flex-1 bg-white text-black py-3 font-bold uppercase hover:bg-gray-200 transition-colors"
              >
                Guardar
              </button>
              <button
                onClick={() => setRolEditando(null)}
                className="flex-1 bg-gray-700 text-white py-3 font-bold uppercase hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminRol
