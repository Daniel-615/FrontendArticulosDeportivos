import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";

import {
  getRoles,
  deleteRol,
  updateRol,
  createRol,
} from "../../../api-gateway/rol.crud.js";

function AdminRol() {
  const [roles, setRoles] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [rolEditando, setRolEditando] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");
  const [nombreNuevo, setNombreNuevo] = useState("");

  const navigate = useNavigate();

  const cargarRoles = async () => {
    const response = await getRoles();
    if (response.success) {
      setRoles(response.data);
    } else {
      setMensaje(response.error);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este rol?")) return;
    const response = await deleteRol(id);
    if (response.success) {
      alert("Rol eliminado.");
      cargarRoles();
    } else {
      setMensaje(response.error);
    }
  };

  const handleGuardarEdicion = async () => {
    const response = await updateRol(rolEditando.id, {
      nombre: nombreEditado,
    });
    if (response.success) {
      alert("Rol actualizado.");
      setRolEditando(null);
      cargarRoles();
    } else {
      setMensaje(response.error);
    }
  };

  const handleCrearRol = async () => {
    if (!nombreNuevo.trim()) {
      setMensaje("El nombre del rol no puede estar vacío.");
      return;
    }
    const response = await createRol({ nombre: nombreNuevo });
    if (response.success) {
      alert("Rol creado correctamente.");
      setNombreNuevo("");
      cargarRoles();
    } else {
      setMensaje(response.error);
    }
  };

  useEffect(() => {
    cargarRoles();
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

      <h2 className="text-xl font-bold mb-4 text-center">Gestión de Roles</h2>

      {mensaje && <p className="text-red-400 text-center mb-4">{mensaje}</p>}

      {/* Crear nuevo rol */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Crear nuevo rol</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={nombreNuevo}
            onChange={(e) => setNombreNuevo(e.target.value)}
            className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-500"
            placeholder="Nombre del nuevo rol"
          />
          <button
            onClick={handleCrearRol}
            className="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-700"
          >
            Crear
          </button>
        </div>
      </div>

      {/* Tabla de roles */}
      <table className="w-full border border-zinc-600 text-sm mb-4">
        <thead className="bg-zinc-700">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles && roles.length > 0 ? (
            roles.map((r) => (
              <tr key={r.id} className="text-center border-t border-zinc-600">
                <td>{r.id}</td>
                <td>{r.nombre}</td>
                <td className="flex justify-center gap-2 py-1">
                  <button
                    onClick={() => {
                      setRolEditando(r);
                      setNombreEditado(r.nombre);
                    }}
                    className="bg-yellow-500 px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(r.id)}
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
                No hay roles disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Formulario para editar rol */}
      {rolEditando && (
        <div className="mt-6 p-4 bg-zinc-700 rounded">
          <h3 className="text-lg font-bold mb-2">Editar Rol</h3>
          <input
            type="text"
            value={nombreEditado}
            onChange={(e) => setNombreEditado(e.target.value)}
            className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-500 mb-4"
            placeholder="Nombre del rol"
          />
          <div className="flex gap-3">
            <button
              onClick={handleGuardarEdicion}
              className="bg-green-600 px-4 py-1 rounded hover:bg-green-700"
            >
              Guardar
            </button>
            <button
              onClick={() => setRolEditando(null)}
              className="bg-gray-500 px-4 py-1 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRol;
