import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import {
  getRolPermisos,
  createRolPermiso,
  deleteRolPermiso
} from "../../../api-gateway/rol.permiso.crud.js";

function AdminRolPermiso() {
  const [rolPermisos, setRolPermisos] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [nuevoRolId, setNuevoRolId] = useState("");
  const [nuevoPermisoId, setNuevoPermisoId] = useState("");
  const navigate = useNavigate();

  const cargarRolPermisos = async () => {
    const response = await getRolPermisos();
    if (response.success) {
      setRolPermisos(response.data);
    } else {
      setMensaje(response.error);
    }
  };

  const handleCrear = async () => {
    if (!nuevoRolId.trim() || !nuevoPermisoId.trim()) {
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
      cargarRolPermisos();
    } else {
      setMensaje(response.error);
    }
  };

  const handleEliminar = async (rolId, permisoId) => {
    if (!window.confirm("¿Eliminar esta relación rol-permiso?")) return;
    const response = await deleteRolPermiso(rolId, permisoId);
    if (response.success) {
      alert("Relación eliminada.");
      cargarRolPermisos();
    } else {
      setMensaje(response.error);
    }
  };

  useEffect(() => {
    cargarRolPermisos();
  }, []);

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
          <input
            type="number"
            value={nuevoRolId}
            onChange={(e) => setNuevoRolId(e.target.value)}
            className="w-1/2 p-2 rounded bg-zinc-800 text-white border border-zinc-500"
            placeholder="ID del Rol"
          />
          <input
            type="number"
            value={nuevoPermisoId}
            onChange={(e) => setNuevoPermisoId(e.target.value)}
            className="w-1/2 p-2 rounded bg-zinc-800 text-white border border-zinc-500"
            placeholder="ID del Permiso"
          />
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
            <th className="px-4 py-2">Permiso ID</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rolPermisos && rolPermisos.length > 0 ? (
            rolPermisos.map((rp, index) => (
              <tr key={index} className="text-center border-t border-zinc-600">
                <td>{rp.rolId}</td>
                <td>{rp.permisoId}</td>
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
              <td colSpan="3" className="text-center py-4 text-gray-400">
                No hay relaciones registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminRolPermiso;