import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import { getRoles } from "../../../api-gateway/rol.crud.js";
import {
  getRolPermisos,
  createRolPermiso,
  deleteRolPermiso,
  getPermisosNoAsignados
} from "../../../api-gateway/rol.permiso.crud.js";

function AdminRolPermiso() {
  const [rolPermisos, setRolPermisos] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [nuevoRolId, setNuevoRolId] = useState("");
  const [nuevoPermisoId, setNuevoPermisoId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [roles, setRoles] = useState([]);
  const [permisosNoAsignados, setPermisosNoAsignados] = useState([]);

  const navigate = useNavigate();

  const cargarRoles = async () => {
    const response = await getRoles();
    if (response.success) {
      setRoles(response.data);
    } else {
      setMensaje(response.error);
    }
  };

  const cargarRolPermisos = async (page = 1) => {
    const response = await getRolPermisos(page, limit);
    if (response.success) {
      setRolPermisos(response.data.data);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.page);
    } else {
      setMensaje(response.error);
    }
  };

  const cargarPermisosNoAsignados = async (rolId) => {
    if (!rolId) {
      setPermisosNoAsignados([]);
      return;
    }

    const response = await getPermisosNoAsignados(rolId);
    if (response.success && Array.isArray(response.data.data)) {
      setPermisosNoAsignados(response.data.data);
    } else {
      setPermisosNoAsignados([]);
      setMensaje(response.error || "Error al cargar permisos.");
    }
  };

  const handleCrear = async () => {
    if (!nuevoRolId || !nuevoPermisoId) {
      setMensaje("Todos los campos son obligatorios.");
      return;
    }
    const response = await createRolPermiso({
      rolId: parseInt(nuevoRolId),
      permisoId: parseInt(nuevoPermisoId),
    });
    if (response.success) {
      alert("Relación rol-permiso creada correctamente.");
      setNuevoRolId("");
      setNuevoPermisoId("");
      setPermisosNoAsignados([]);
      cargarRolPermisos(currentPage);
    } else {
      setMensaje(response.error);
    }
  };

  const handleEliminar = async (rolId, permisoId) => {
    if (!window.confirm("¿Eliminar esta relación rol-permiso?")) return;
    const response = await deleteRolPermiso(rolId, permisoId);
    if (response.success) {
      alert("Relación eliminada.");
      cargarRolPermisos(currentPage);
    } else {
      setMensaje(response.error);
    }
  };

  useEffect(() => {
    cargarRolPermisos();
    cargarRoles();
  }, []);

  useEffect(() => {
    cargarPermisosNoAsignados(nuevoRolId);
  }, [nuevoRolId]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-zinc-800 text-white rounded-lg mt-10">
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin-panel")}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaUserShield className="text-lg inline mr-2" />
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4 text-center">Gestión Rol-Permiso</h2>

      {mensaje && <p className="text-red-400 text-center mb-4">{mensaje}</p>}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Crear nueva relación</h3>
        <div className="flex gap-2">
          <select
            value={nuevoRolId}
            onChange={(e) => {
              setNuevoRolId(e.target.value);
              setNuevoPermisoId("");
            }}
            className="w-1/2 p-2 rounded bg-zinc-800 text-white border border-zinc-500"
          >
            <option value="">Seleccione un rol</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.id} - {rol.nombre}
              </option>
            ))}
          </select>

          <select
            value={nuevoPermisoId}
            onChange={(e) => setNuevoPermisoId(e.target.value)}
            className="w-1/2 p-2 rounded bg-zinc-800 text-white border border-zinc-500"
          >
            <option value="">Seleccione un permiso</option>
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

          <button
            onClick={handleCrear}
            className="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-700"
          >
            Crear
          </button>
        </div>
      </div>

      <table className="w-full border border-zinc-600 text-sm mb-4">
        <thead className="bg-zinc-700">
          <tr>
            <th className="px-4 py-2">Rol ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Permiso ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rolPermisos.length > 0 ? (
            rolPermisos.map((rp, index) => (
              <tr key={index} className="text-center border-t border-zinc-600">
                <td>{rp.rolId}</td>
                <td>{rp.rol?.nombre || "Rol desconocido"}</td>
                <td>{rp.permisoId}</td>
                <td>{rp.permiso?.nombre || "Permiso desconocido"}</td>
                <td className="flex justify-center gap-2 py-1">
                  <button
                    onClick={() => handleEliminar(rp.rolId, rp.permisoId)}
                    className="bg-red-600 px-2 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-400">
                No hay relaciones registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => cargarRolPermisos(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-zinc-700 px-4 py-2 rounded hover:bg-zinc-600 disabled:opacity-50"
        >
          ← Anterior
        </button>
        <span className="text-sm">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => cargarRolPermisos(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-zinc-700 px-4 py-2 rounded hover:bg-zinc-600 disabled:opacity-50"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

export default AdminRolPermiso;
