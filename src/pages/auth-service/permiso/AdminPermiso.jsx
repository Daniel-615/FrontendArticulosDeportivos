import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { FaUserShield } from "react-icons/fa";

import {
  getPermisos,
  deletePermiso,
  updatePermiso,
  createPermiso,
} from "../../../api-gateway/permiso.crud.js";

function AdminPermiso() {
  const [permisos, setPermisos] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [permisoEditando, setPermisoEditando] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");
  const [nombreNuevo, setNombreNuevo] = useState("");

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const limite = 10;

  const navigate = useNavigate(); 

  const cargarPermisos = async () => {
    const response = await getPermisos(pagina, limite);
    if (response.success) {
      setPermisos(response.data);
      setTotalPaginas(response.totalPages || 1);
    } else {
      setMensaje(response.error);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este permiso?")) return;
    const response = await deletePermiso(id);
    if (response.success) {
      alert("Permiso eliminado.");
      cargarPermisos();
    } else {
      setMensaje(response.error);
    }
  };

  const handleGuardarEdicion = async () => {
    const response = await updatePermiso(permisoEditando.id, {
      nombre: nombreEditado,
    });
    if (response.success) {
      alert("Permiso actualizado.");
      setPermisoEditando(null);
      cargarPermisos();
    } else {
      setMensaje(response.error);
    }
  };

  const handleCrearPermiso = async () => {
    if (!nombreNuevo.trim()) {
      setMensaje("El nombre del permiso no puede estar vacío.");
      return;
    }
    const response = await createPermiso({ nombre: nombreNuevo });
    if (response.success) {
      alert("Permiso creado correctamente.");
      setNombreNuevo("");
      cargarPermisos();
    } else {
      setMensaje(response.error);
    }
  };

  useEffect(() => {
    cargarPermisos();
  }, [pagina]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-zinc-800 text-white rounded-lg mt-10">
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin-panel")} 
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaUserShield className="text-lg"></FaUserShield>
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4 text-center">Gestión de Permisos</h2>

      {mensaje && <p className="text-red-400 text-center mb-4">{mensaje}</p>}

      {/* Crear nuevo permiso */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Crear nuevo permiso</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={nombreNuevo}
            onChange={(e) => setNombreNuevo(e.target.value)}
            className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-500"
            placeholder="Nombre del nuevo permiso"
          />
          <button
            onClick={handleCrearPermiso}
            className="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-700"
          >
            Crear
          </button>
        </div>
      </div>

      {/* Tabla de permisos */}
      <table className="w-full border border-zinc-600 text-sm mb-4">
        <thead className="bg-zinc-700">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {permisos && permisos.length > 0 ? (
            permisos.map((p) => (
              <tr key={p.id} className="text-center border-t border-zinc-600">
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td className="flex justify-center gap-2 py-1">
                  <button
                    onClick={() => {
                      setPermisoEditando(p);
                      setNombreEditado(p.nombre);
                    }}
                    className="bg-yellow-500 px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(p.id)}
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
                No hay permisos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
          disabled={pagina === 1}
          className="px-3 py-1 rounded bg-zinc-600 hover:bg-zinc-700 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="self-center">
          Página {pagina} de {totalPaginas}
        </span>
        <button
          onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas))}
          disabled={pagina === totalPaginas}
          className="px-3 py-1 rounded bg-zinc-600 hover:bg-zinc-700 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      {/* Formulario para editar permiso */}
      {permisoEditando && (
        <div className="mt-6 p-4 bg-zinc-700 rounded">
          <h3 className="text-lg font-bold mb-2">Editar Permiso</h3>
          <input
            type="text"
            value={nombreEditado}
            onChange={(e) => setNombreEditado(e.target.value)}
            className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-500 mb-4"
            placeholder="Nombre del permiso"
          />
          <div className="flex gap-3">
            <button
              onClick={handleGuardarEdicion}
              className="bg-green-600 px-4 py-1 rounded hover:bg-green-700"
            >
              Guardar
            </button>
            <button
              onClick={() => setPermisoEditando(null)}
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

export default AdminPermiso;
