import { useState, useEffect } from "react";
import {
  createProductoColor,
  updateProductoColor,
  getProductoColorById,
  deleteProductoColor,
  getProductoColores,
} from "../../api-gateway/producto.color.crud.js";
import { getColores } from "../../api-gateway/color.crud.js";
import { getProductos } from "../../api-gateway/producto.crud.js";
import SidebarEmpleado from "../../components/sideBar.jsx";

export default function ProductoColorForm({ id: initialId, onSuccess }) {
  const [id, setId] = useState(initialId || null);
  const [colorId, setColorId] = useState("");
  const [productoId, setProductoId] = useState("");
  const [colores, setColores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); // 👈 Errores por campo
  const [productoColores, setProductoColores] = useState([]);
  const [nombreProductoActual, setNombreProductoActual] = useState("");

  useEffect(() => {
    async function init() {
      try {
        const coloresRes = await getColores();
        if (coloresRes.success) setColores(coloresRes.data);

        const productosRes = await getProductos();
        if (productosRes.success) setProductos(productosRes.data.productos || []);

        const pcRes = await getProductoColores();
        if (pcRes.success) setProductoColores(pcRes.data.data);

        if (initialId) cargarRegistro(initialId);
      } catch (err) {
        setErrorMsg("Error al inicializar el formulario.");
      }
    }
    init();
  }, []);

  const cargarRegistro = async (pcId) => {
    try {
      const res = await getProductoColorById(pcId);
      if (res.success) {
        setId(pcId);
        setColorId(res.data.colorId || "");
        setProductoId(res.data.productoId || "");
        setImagenPreview(res.data.imagenUrl || null);
        setImagenFile(null);

        const producto = productos.find((p) => p.id === res.data.data.productoId);
        setNombreProductoActual(producto?.nombre || "");

        document.getElementById("productoColorForm")?.scrollIntoView({ behavior: "smooth" });
      } else {
        setErrorMsg(res.error || "No se pudo cargar el color del producto.");
      }
    } catch {
      setErrorMsg("Error al cargar el registro.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImagenFile(file);
    if (file) setImagenPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setErrorMsg("");

    let errors = {};
    if (!productoId) errors.productoId = "Debes seleccionar un producto.";
    if (!colorId) errors.colorId = "Debes seleccionar un color.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("colorId", colorId);
      payload.append("productoId", productoId);
      if (imagenFile) payload.append("imagen", imagenFile);

      const res = id
        ? await updateProductoColor(id, payload)
        : await createProductoColor(payload);

      if (res.success) {
        onSuccess?.();
        resetForm();
        const pcRes = await getProductoColores();
        if (pcRes.success) setProductoColores(pcRes.data.data);
      } else {
        setErrorMsg(res.error || "Error al guardar el color del producto.");
      }
    } catch {
      setErrorMsg("Error en la petición.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pcId) => {
    if (!confirm("¿Estás seguro de eliminar este color de producto?")) return;
    setLoading(true);
    try {
      const res = await deleteProductoColor(pcId);
      if (res.success) {
        onSuccess?.();
        if (pcId === id) resetForm();
        setProductoColores((prev) => prev.filter((pc) => pc.id !== pcId));
      } else {
        setErrorMsg(res.error || "Error al eliminar el color del producto.");
      }
    } catch {
      setErrorMsg("Error en la petición.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setId(null);
    setColorId("");
    setProductoId("");
    setImagenFile(null);
    setImagenPreview(null);
    setNombreProductoActual("");
    setErrorMsg("");
    setFieldErrors({});
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar fijo en desktop */}
      <div className="hidden md:block">
        <SidebarEmpleado />
      </div>

      {/* Contenido principal */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 bg-gray-100 overflow-y-auto">
        <form
          id="productoColorForm"
          onSubmit={handleSubmit}
          className="max-w-lg w-full mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-4 border"
        >
          <h2 className="text-xl font-bold text-gray-800 text-center sm:text-left">
            {id
              ? `Editar Color de Producto: ${nombreProductoActual}`
              : "Nuevo Color de Producto"}
          </h2>

          {errorMsg && (
            <div className="p-2 text-red-700 bg-red-100 border border-red-300 rounded text-sm">
              {errorMsg}
            </div>
          )}

          {/* Selects */}
          {!id && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Seleccionar producto *
                </label>
                <select
                  value={productoId}
                  onChange={(e) => setProductoId(e.target.value)}
                  required
                  className={`w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 text-gray-900 ${
                    fieldErrors.productoId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">-- Selecciona un producto --</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
                {fieldErrors.productoId && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.productoId}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Seleccionar color *
                </label>
                <select
                  value={colorId}
                  onChange={(e) => setColorId(e.target.value)}
                  required
                  className={`w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 text-gray-900 ${
                    fieldErrors.colorId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">-- Selecciona un color --</option>
                  {colores.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
                {fieldErrors.colorId && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.colorId}</p>
                )}
              </div>
            </div>
          )}

          {/* Imagen */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-gray-700"
            />
            {imagenPreview && (
              <img
                src={imagenPreview}
                alt="Vista previa"
                className="mt-2 h-24 rounded-lg object-cover border mx-auto sm:mx-0"
              />
            )}
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-between gap-2 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>
            <div className="flex gap-2">
              {id && (
                <button
                  type="button"
                  onClick={() => handleDelete(id)}
                  disabled={loading}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  Eliminar
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Guardando..." : id ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </form>

        {/* Listado */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
          <h3 className="font-bold mb-2 text-gray-800 text-lg text-center sm:text-left">
            Lista de Colores de Productos
          </h3>
          {productoColores.length === 0 ? (
            <p className="text-gray-600 text-center sm:text-left">No hay registros aún.</p>
          ) : (
            <ul className="space-y-2">
              {productoColores.map((pc) => (
                <li
                  key={pc.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-white border rounded-lg shadow-sm gap-3"
                >
                  <div className="flex items-center gap-3">
                    {pc.imagenUrl && (
                      <img
                        src={pc.imagenUrl}
                        alt="thumb"
                        className="h-10 w-10 rounded-lg object-cover border"
                      />
                    )}
                    <span className="text-gray-800 font-medium text-sm sm:text-base">
                      {pc.nombreProducto} - {pc.nombreColor}
                    </span>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => cargarRegistro(pc.id)}
                      className="px-3 py-1 text-sm bg-yellow-400 text-black rounded-lg hover:bg-yellow-500"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(pc.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
