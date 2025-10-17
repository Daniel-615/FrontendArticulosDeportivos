"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { findAllActivos, findAll, findOne, Delete, deactivateAccount } from "../../../../api-gateway/user.crud.js"
import { toast } from "react-toastify"
import { Users, Eye, Trash2, UserX, ChevronDown, Settings, Filter } from "lucide-react"

function AdminPanel() {
  const [usuarios, setUsuarios] = useState([])
  const [mostrarActivos, setMostrarActivos] = useState(true)
  const [mensaje, setMensaje] = useState(null) // banner superior (opcional)
  const [detalleUsuario, setDetalleUsuario] = useState(null)
  const [mostrarDropdown, setMostrarDropdown] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    cargarUsuarios()
  }, [mostrarActivos])

  const cargarUsuarios = async () => {
    const response = mostrarActivos ? await findAllActivos() : await findAll()
    if (response.success) {
      setUsuarios(response.data || [])
      setMensaje(null)
    } else {
      setMensaje(response.error || "No se pudieron cargar los usuarios.")
      toast.error(response.error || "No se pudieron cargar los usuarios.")
    }
  }

  const handleVer = async (id) => {
    const response = await findOne(id)
    if (response.success) {
      setDetalleUsuario(response.data)
    } else {
      setMensaje(response.error || "No se pudo obtener el detalle.")
      toast.error(response.error || "No se pudo obtener el detalle.")
    }
  }

  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar este usuario? Esta acción es irreversible.")
    if (!confirmar) return

    const response = await Delete(id)
    if (response.success) {
      toast.success(response.data?.message || "Usuario eliminado correctamente.")
      await cargarUsuarios()
    } else {
      toast.error(response.error || "No se pudo eliminar el usuario.")
      setMensaje(response.error || "No se pudo eliminar el usuario.")
    }
  }

  const handleDesactivar = async (id) => {
    const confirmar = window.confirm("¿Deseas desactivar esta cuenta? El usuario no podrá iniciar sesión.")
    if (!confirmar) return

    const response = await deactivateAccount(id)
    if (response.success) {
      toast.success(response.data?.message || "Cuenta desactivada correctamente.")
      await cargarUsuarios()
    } else {
      toast.error(response.error || "No se pudo desactivar la cuenta.")
      setMensaje(response.error || "No se pudo desactivar la cuenta.")
    }
  }

  const ocultarDetalles = () => setDetalleUsuario(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-black p-3">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold uppercase tracking-tighter text-black">PANEL DE</h1>
              <h1 className="text-5xl font-bold uppercase tracking-tighter text-black">ADMINISTRADOR</h1>
            </div>
          </div>
          <div className="h-2 w-32 bg-black"></div>
        </div>

        <div className="mb-8 bg-black p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-white" />
              <label className="flex items-center gap-3 text-sm uppercase tracking-wide cursor-pointer text-white">
                <input
                  type="checkbox"
                  checked={mostrarActivos}
                  onChange={() => setMostrarActivos(!mostrarActivos)}
                  className="w-5 h-5 accent-white"
                />
                MOSTRAR SOLO USUARIOS ACTIVOS
              </label>
            </div>

            <div className="relative">
              <button
                onClick={() => setMostrarDropdown(!mostrarDropdown)}
                className="flex items-center gap-3 bg-white text-black px-8 py-4 uppercase text-sm font-bold tracking-wide hover:bg-gray-100 transition-all border-2 border-white hover:border-gray-300"
              >
                <Settings className="w-5 h-5" />
                GESTIONES ADICIONALES
                <ChevronDown className={`w-5 h-5 transition-transform ${mostrarDropdown ? "rotate-180" : ""}`} />
              </button>
              {mostrarDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-black border-2 border-black shadow-2xl z-50">
                  <ul className="py-2">
                    <li
                      className="px-6 py-4 hover:bg-black hover:text-white cursor-pointer uppercase text-sm font-bold transition-all border-b border-gray-200 last:border-0"
                      onClick={() => {
                        setMostrarDropdown(false)
                        navigate("/admin-rol-permiso")
                      }}
                    >
                      ROL PERMISO
                    </li>
                    <li
                      className="px-6 py-4 hover:bg-black hover:text-white cursor-pointer uppercase text-sm font-bold transition-all border-b border-gray-200 last:border-0"
                      onClick={() => {
                        setMostrarDropdown(false)
                        navigate("/admin-permiso")
                      }}
                    >
                      PERMISO
                    </li>
                    <li
                      className="px-6 py-4 hover:bg-black hover:text-white cursor-pointer uppercase text-sm font-bold transition-all"
                      onClick={() => {
                        setMostrarDropdown(false)
                        navigate("/admin-rol")
                      }}
                    >
                      ROL
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {mensaje && (
          <div className="mb-6 p-6 bg-red-50 border-l-4 border-red-600 text-red-900">
            <p className="font-bold uppercase text-sm">{mensaje}</p>
          </div>
        )}

        <div className="bg-white border-2 border-black shadow-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-5 text-left uppercase text-xs font-bold tracking-wider">ID</th>
                <th className="px-6 py-5 text-left uppercase text-xs font-bold tracking-wider">NOMBRE</th>
                <th className="px-6 py-5 text-left uppercase text-xs font-bold tracking-wider">APELLIDO</th>
                <th className="px-6 py-5 text-left uppercase text-xs font-bold tracking-wider">EMAIL</th>
                <th className="px-6 py-5 text-left uppercase text-xs font-bold tracking-wider">ROL</th>
                <th className="px-6 py-5 text-left uppercase text-xs font-bold tracking-wider">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, index) => (
                <tr
                  key={u.id}
                  className={`border-t-2 border-black transition-colors hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-5 font-bold text-black text-sm">{u.id}</td>
                  <td className="px-6 py-5 text-black font-medium">{u.nombre}</td>
                  <td className="px-6 py-5 text-black font-medium">{u.apellido}</td>
                  <td className="px-6 py-5 text-black text-sm">{u.email}</td>
                  <td className="px-6 py-5">
                    <span className="bg-black text-white px-3 py-1 text-xs uppercase font-bold">{u.rol}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="grid grid-cols-3 gap-2 w-fit">
                      <button
                        onClick={() => handleVer(u.id)}
                        className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 text-xs uppercase font-bold hover:bg-gray-800 transition-all whitespace-nowrap"
                      >
                        <Eye className="w-4 h-4" />
                        VER
                      </button>

                      <button
                        onClick={() => handleEliminar(u.id)}
                        className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 text-xs uppercase font-bold hover:bg-red-700 transition-all whitespace-nowrap"
                      >
                        <Trash2 className="w-4 h-4" />
                        ELIMINAR
                      </button>

                      {u.rol === "empleado" ? (
                        <button
                          onClick={() => handleDesactivar(u.id)}
                          className="flex items-center justify-center gap-2 bg-white text-black border-2 border-black px-4 py-2 text-xs uppercase font-bold hover:bg-black hover:text-white transition-all whitespace-nowrap"
                        >
                          <UserX className="w-4 h-4" />
                          DESACTIVAR
                        </button>
                      ) : (
                        <div className="w-full"></div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {detalleUsuario && (
          <div className="mt-8 bg-black text-white border-2 border-black shadow-xl overflow-hidden">
            <div className="bg-white text-black p-6 border-b-2 border-black">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6" />
                  <h3 className="text-2xl font-bold uppercase tracking-tight">DETALLES DEL USUARIO</h3>
                </div>
                <button
                  onClick={ocultarDetalles}
                  className="bg-black text-white px-6 py-3 uppercase text-sm font-bold hover:bg-gray-800 transition-all"
                >
                  OCULTAR
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 p-4 border border-white/20">
                  <p className="text-xs uppercase text-gray-400 mb-1">ID</p>
                  <p className="text-lg font-bold">{detalleUsuario.id}</p>
                </div>
                <div className="bg-white/10 p-4 border border-white/20">
                  <p className="text-xs uppercase text-gray-400 mb-1">Nombre</p>
                  <p className="text-lg font-bold">{detalleUsuario.nombre}</p>
                </div>
                <div className="bg-white/10 p-4 border border-white/20">
                  <p className="text-xs uppercase text-gray-400 mb-1">Apellido</p>
                  <p className="text-lg font-bold">{detalleUsuario.apellido}</p>
                </div>
                <div className="bg-white/10 p-4 border border-white/20">
                  <p className="text-xs uppercase text-gray-400 mb-1">Email</p>
                  <p className="text-lg font-bold">{detalleUsuario.email}</p>
                </div>
                <div className="bg-white/10 p-4 border border-white/20">
                  <p className="text-xs uppercase text-gray-400 mb-1">Rol</p>
                  <p className="text-lg font-bold uppercase">{detalleUsuario.rol}</p>
                </div>
              </div>

              {detalleUsuario.permisos && (
                <div className="bg-white/10 p-6 border border-white/20">
                  <p className="font-bold uppercase mb-4 text-lg">PERMISOS ASIGNADOS</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {detalleUsuario.permisos.map((permiso, index) => (
                      <li key={index} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-white"></div>
                        <span className="font-medium">{permiso}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
