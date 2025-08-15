import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  findAllActivos,
  findAll,
  findOne,
  Delete,
  deactivateAccount
} from '../../../../api-gateway/user.crud.js';
import { toast } from 'react-toastify';

function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarActivos, setMostrarActivos] = useState(true);
  const [mensaje, setMensaje] = useState(null);           // banner superior (opcional)
  const [detalleUsuario, setDetalleUsuario] = useState(null);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    cargarUsuarios();
  }, [mostrarActivos]);

  const cargarUsuarios = async () => {
    const response = mostrarActivos ? await findAllActivos() : await findAll();
    if (response.success) {
      setUsuarios(response.data || []);
      setMensaje(null);
    } else {
      setMensaje(response.error || "No se pudieron cargar los usuarios.");
      toast.error(response.error || "No se pudieron cargar los usuarios.");
    }
  };

  const handleVer = async (id) => {
    const response = await findOne(id);
    if (response.success) {
      setDetalleUsuario(response.data);
    } else {
      setMensaje(response.error || "No se pudo obtener el detalle.");
      toast.error(response.error || "No se pudo obtener el detalle.");
    }
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar este usuario? Esta acción es irreversible.');
    if (!confirmar) return;

    const response = await Delete(id);
    if (response.success) {
      toast.success(response.data?.message || "Usuario eliminado correctamente.");
      await cargarUsuarios();
    } else {
      toast.error(response.error || "No se pudo eliminar el usuario.");
      setMensaje(response.error || "No se pudo eliminar el usuario.");
    }
  };

  const handleDesactivar = async (id) => {
    const confirmar = window.confirm('¿Deseas desactivar esta cuenta? El usuario no podrá iniciar sesión.');
    if (!confirmar) return;

    const response = await deactivateAccount(id);
    if (response.success) {
      toast.success(response.data?.message || 'Cuenta desactivada correctamente.');
      await cargarUsuarios();
    } else {
      toast.error(response.error || 'No se pudo desactivar la cuenta.');
      setMensaje(response.error || 'No se pudo desactivar la cuenta.');
    }
  };

  const ocultarDetalles = () => setDetalleUsuario(null);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-zinc-800 text-white rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Panel de Administrador</h2>

      <div className="flex justify-between items-center mb-4">
        <label className="text-sm">
          <input
            type="checkbox"
            checked={mostrarActivos}
            onChange={() => setMostrarActivos(!mostrarActivos)}
            className="mr-2"
          />
          Mostrar solo usuarios activos
        </label>

        <div className="relative">
          <button
            onClick={() => setMostrarDropdown(!mostrarDropdown)}
            className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded text-sm"
          >
            Gestiones adicionales
          </button>
          {mostrarDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-700 rounded-md shadow-lg z-10">
              <ul className="py-1 text-sm text-white">
                <li
                  className="px-4 py-2 hover:bg-zinc-600 cursor-pointer"
                  onClick={() => {
                    setMostrarDropdown(false);
                    navigate("/admin-rol-permiso");
                  }}
                >
                  Rol Permiso
                </li>
                <li
                  className="px-4 py-2 hover:bg-zinc-600 cursor-pointer"
                  onClick={() => {
                    setMostrarDropdown(false);
                    navigate("/admin-permiso");
                  }}
                >
                  Permiso
                </li>
                <li
                  className="px-4 py-2 hover:bg-zinc-600 cursor-pointer"
                  onClick={() => {
                    setMostrarDropdown(false);
                    navigate("/admin-rol");
                  }}
                >
                  Rol
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {mensaje && <p className="text-red-400 text-center mb-4">{mensaje}</p>}

      <table className="w-full border border-zinc-600 text-sm">
        <thead className="bg-zinc-700">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Apellido</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Rol</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="text-center border-t border-zinc-600">
              <td className="px-2 py-1">{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.apellido}</td>
              <td>{u.email}</td>
              <td>{u.rol}</td>
              <td className="flex flex-col gap-1 justify-center items-center py-2">
                <button
                  onClick={() => handleVer(u.id)}
                  className="bg-blue-600 px-2 py-1 rounded hover:bg-blue-700 w-28"
                >
                  Ver
                </button>

                {u.rol === 'empleado' && (
                  <button
                    onClick={() => handleDesactivar(u.id)}
                    className="bg-yellow-600 px-2 py-1 rounded hover:bg-yellow-700 w-28"
                  >
                    Desactivar
                  </button>
                )}

                <button
                  onClick={() => handleEliminar(u.id)}
                  className="bg-red-600 px-2 py-1 rounded hover:bg-red-700 w-28"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {detalleUsuario && (
        <div className="mt-6 p-4 bg-zinc-700 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Detalles del Usuario</h3>
            <button
              onClick={ocultarDetalles}
              className="bg-zinc-500 hover:bg-zinc-600 px-3 py-1 rounded text-sm"
            >
              Ocultar
            </button>
          </div>
          <p><strong>ID:</strong> {detalleUsuario.id}</p>
          <p><strong>Nombre:</strong> {detalleUsuario.nombre}</p>
          <p><strong>Apellido:</strong> {detalleUsuario.apellido}</p>
          <p><strong>Email:</strong> {detalleUsuario.email}</p>
          <p><strong>Rol:</strong> {detalleUsuario.rol}</p>

          {detalleUsuario.permisos && (
            <div className="mt-2">
              <strong>Permisos:</strong>
              <ul className="list-disc list-inside mt-1 text-sm text-zinc-300">
                {detalleUsuario.permisos.map((permiso, index) => (
                  <li key={index}>{permiso}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
