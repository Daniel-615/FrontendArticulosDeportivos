"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Trash2, ArrowLeft } from "lucide-react"
import SidebarEmpleado from "../../../components/sideBar.jsx"
import { getRoles } from "../../../api-gateway/rol.crud.js"
import {
  getRolPermisos,
  createRolPermiso,
  deleteRolPermiso,
  getPermisosNoAsignados,
} from "../../../api-gateway/rol.permiso.crud.js"

function AdminRolPermiso() {
  const [rolPermisos, setRolPermisos] = useState([])
  const [mensaje, setMensaje] = useState(null)
  const [nuevoRolId, setNuevoRolId] = useState("")
  const [nuevoPermisoId, setNuevoPermisoId] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(10)
  const [roles, setRoles] = useState([])
  const [permisosNoAsignados, setPermisosNoAsignados] = useState([])

  const navigate = useNavigate()

  const cargarRoles = async () => {
    const response = await getRoles()
    if (response.success) {
      setRoles(response.data)
    } else {
      setMensaje(response.error)
    }
  }

  const cargarRolPermisos = async (page = 1) => {
    const response = await getRolPermisos(page, limit)
    if (response.success) {
      setRolPermisos(response.data.data)
      setTotalPages(response.data.totalPages)
      setCurrentPage(response.data.page)
    } else {
      setMensaje(response.error)
    }
  }

  const cargarPermisosNoAsignados = async (rolId) => {
    if (!rolId) {
      setPermisosNoAsignados([])
      return
    }

    const response = await getPermisosNoAsignados(rolId)
    if (response.success && Array.isArray(response.data.data)) {
      setPermisosNoAsignados(response.data.data)
    } else {
      setPermisosNoAsignados([])
      setMensaje(response.error || "Error al cargar permisos.")
    }
  }

  const handleCrear = async () => {
    if (!nuevoRolId || !nuevoPermisoId) {
      setMensaje("Todos los campos son obligatorios.")
      return
    }
    const response = await createRolPermiso({
      rolId: Number.parseInt(nuevoRolId),
      permisoId: Number.parseInt(nuevoPermisoId),
    })
    if (response.success) {
      alert("Relación rol-permiso creada correctamente.")
      setNuevoRolId("")
      setNuevoPermisoId("")
      setPermisosNoAsignados([])
      cargarRolPermisos(currentPage)
    } else {
      setMensaje(response.error)
    }
  }

  const handleEliminar = async (rolId, permisoId) => {
    if (!window.confirm("¿Eliminar esta relación rol-permiso?")) return
    const response = await deleteRolPermiso(rolId, permisoId)
    if (response.success) {
      alert("Relación eliminada.")
      cargarRolPermisos(currentPage)
    } else {
      setMensaje(response.error)
    }
  }

  useEffect(() => {
    cargarRolPermisos()
    cargarRoles()
  }, [])

  useEffect(() => {
    cargarPermisosNoAsignados(nuevoRolId)
  }, [nuevoRolId])

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
            <h2 className="text-3xl font-bold text-black uppercase tracking-tight mb-2">GESTIÓN ROL-PERMISO</h2>
            <div className="h-1 w-20 bg-black"></div>
          </div>
        </div>

        {mensaje && <p className="text-red-600 font-medium mb-4 p-4 bg-red-50 border-2 border-red-600">{mensaje}</p>}

        <div className="bg-black text-white p-6 mb-10">
          <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Crear Nueva Relación
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-bold uppercase text-sm">Seleccionar Rol</label>
              <select
                value={nuevoRolId}
                onChange={(e) => {
                  setNuevoRolId(e.target.value)
                  setNuevoPermisoId("")
                }}
                className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none"
              >
                <option value="">-- SELECCIONE UN ROL --</option>
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.id} - {rol.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-bold uppercase text-sm">Seleccionar Permiso</label>
              <select
                value={nuevoPermisoId}
                onChange={(e) => setNuevoPermisoId(e.target.value)}
                className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none"
              >
                <option value="">-- SELECCIONE UN PERMISO --</option>
                {Array.isArray(permisosNoAsignados) && permisosNoAsignados.length > 0 ? (
                  permisosNoAsignados.map((permiso) => (
                    <option key={permiso.id} value={permiso.id}>
                      {permiso.id} - {permiso.nombre}
                    </option>
                  ))
                ) : (
                  <option value="">No hay permisos disponibles</option>
                )}
              </select>
            </div>
          </div>

          <button
            onClick={handleCrear}
            className="w-full bg-white text-black py-3 font-bold uppercase hover:bg-gray-200 transition-colors"
          >
            Crear Relación
          </button>
        </div>

        <div className="border-2 border-black">
          <div className="bg-black text-white grid grid-cols-5 font-bold uppercase text-sm">
            <div className="px-6 py-4">Rol ID</div>
            <div className="px-6 py-4">Nombre Rol</div>
            <div className="px-6 py-4">Permiso ID</div>
            <div className="px-6 py-4">Nombre Permiso</div>
            <div className="px-6 py-4">Acciones</div>
          </div>
          {rolPermisos.length > 0 ? (
            rolPermisos.map((rp, idx) => (
              <div
                key={`${rp.rolId}-${rp.permisoId}`}
                className={`grid grid-cols-5 border-t-2 border-black ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <div className="px-6 py-4 text-black font-bold">{rp.rolId}</div>
                <div className="px-6 py-4 text-black font-medium uppercase">{rp.rol?.nombre || "Rol desconocido"}</div>
                <div className="px-6 py-4 text-black font-bold">{rp.permisoId}</div>
                <div className="px-6 py-4 text-black font-medium uppercase">
                  {rp.permiso?.nombre || "Permiso desconocido"}
                </div>
                <div className="px-6 py-4">
                  <button
                    onClick={() => handleEliminar(rp.rolId, rp.permisoId)}
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
              No hay relaciones registradas.
            </div>
          )}
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => cargarRolPermisos(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-6 py-3 bg-black text-white font-bold uppercase disabled:opacity-50 hover:bg-gray-800 transition-colors"
          >
            Anterior
          </button>
          <span className="text-black font-bold">
            PÁGINA {currentPage} DE {totalPages}
          </span>
          <button
            onClick={() => cargarRolPermisos(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-6 py-3 bg-black text-white font-bold uppercase disabled:opacity-50 hover:bg-gray-800 transition-colors"
          >
            Siguiente
          </button>
        </div>
      </main>
    </div>
  )
}

export default AdminRolPermiso
