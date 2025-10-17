"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit2, Trash2, Plus, ArrowLeft } from "lucide-react"
import SidebarEmpleado from "../../../components/sideBar.jsx"

import { getPermisos, deletePermiso, updatePermiso, createPermiso } from "../../../api-gateway/permiso.crud.js"

function AdminPermiso() {
  const [permisos, setPermisos] = useState([])
  const [mensaje, setMensaje] = useState(null)
  const [permisoEditando, setPermisoEditando] = useState(null)
  const [nombreEditado, setNombreEditado] = useState("")
  const [nombreNuevo, setNombreNuevo] = useState("")

  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const limite = 10

  const navigate = useNavigate()

  const cargarPermisos = async () => {
    const response = await getPermisos(pagina, limite)
    if (response.success) {
      setPermisos(response.data)
      setTotalPaginas(response.totalPages || 1)
    } else {
      setMensaje(response.error)
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este permiso?")) return
    const response = await deletePermiso(id)
    if (response.success) {
      alert("Permiso eliminado.")
      cargarPermisos()
    } else {
      setMensaje(response.error)
    }
  }

  const handleGuardarEdicion = async () => {
    const response = await updatePermiso(permisoEditando.id, {
      nombre: nombreEditado,
    })
    if (response.success) {
      alert("Permiso actualizado.")
      setPermisoEditando(null)
      cargarPermisos()
    } else {
      setMensaje(response.error)
    }
  }

  const handleCrearPermiso = async () => {
    if (!nombreNuevo.trim()) {
      setMensaje("El nombre del permiso no puede estar vacío.")
      return
    }
    const response = await createPermiso({ nombre: nombreNuevo })
    if (response.success) {
      alert("Permiso creado correctamente.")
      setNombreNuevo("")
      cargarPermisos()
    } else {
      setMensaje(response.error)
    }
  }

  useEffect(() => {
    cargarPermisos()
  }, [pagina])

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
            <h2 className="text-3xl font-bold text-black uppercase tracking-tight mb-2">GESTIÓN DE PERMISOS</h2>
            <div className="h-1 w-20 bg-black"></div>
          </div>
        </div>

        {mensaje && <p className="text-red-600 font-medium mb-4 p-4 bg-red-50 border-2 border-red-600">{mensaje}</p>}

        <div className="bg-black text-white p-6 mb-10">
          <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Crear Nuevo Permiso
          </h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={nombreNuevo}
              onChange={(e) => setNombreNuevo(e.target.value)}
              className="flex-1 px-4 py-3 bg-white text-black border-2 border-white focus:outline-none uppercase"
              placeholder="NOMBRE DEL PERMISO"
            />
            <button
              onClick={handleCrearPermiso}
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
          {permisos && permisos.length > 0 ? (
            permisos.map((p, idx) => (
              <div
                key={p.id}
                className={`grid grid-cols-3 border-t-2 border-black ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <div className="px-6 py-4 text-black font-bold">{p.id}</div>
                <div className="px-6 py-4 text-black font-medium uppercase">{p.nombre}</div>
                <div className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => {
                      setPermisoEditando(p)
                      setNombreEditado(p.nombre)
                    }}
                    className="bg-black text-white px-4 py-2 font-bold uppercase text-xs hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    <Edit2 className="w-3 h-3" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(p.id)}
                    className="bg-white text-black border-2 border-black px-4 py-2 font-bold uppercase text-xs hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-3 h-3" />
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-600 border-t-2 border-black">
              No hay permisos disponibles.
            </div>
          )}
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
            disabled={pagina === 1}
            className="px-6 py-3 bg-black text-white font-bold uppercase disabled:opacity-50 hover:bg-gray-800 transition-colors"
          >
            Anterior
          </button>
          <span className="text-black font-bold">
            PÁGINA {pagina} DE {totalPaginas}
          </span>
          <button
            onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas))}
            disabled={pagina === totalPaginas}
            className="px-6 py-3 bg-black text-white font-bold uppercase disabled:opacity-50 hover:bg-gray-800 transition-colors"
          >
            Siguiente
          </button>
        </div>

        {permisoEditando && (
          <div className="mt-10 bg-black text-white p-6 border-2 border-black">
            <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
              <Edit2 className="w-5 h-5" />
              Editar Permiso
            </h3>
            <input
              type="text"
              value={nombreEditado}
              onChange={(e) => setNombreEditado(e.target.value)}
              className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none uppercase mb-4"
              placeholder="NOMBRE DEL PERMISO"
            />
            <div className="flex gap-4">
              <button
                onClick={handleGuardarEdicion}
                className="flex-1 bg-white text-black py-3 font-bold uppercase hover:bg-gray-200 transition-colors"
              >
                Guardar
              </button>
              <button
                onClick={() => setPermisoEditando(null)}
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

export default AdminPermiso
