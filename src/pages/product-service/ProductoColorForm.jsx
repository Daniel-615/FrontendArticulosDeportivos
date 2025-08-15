import { useState, useEffect } from "react";
import {
  createProductoColor,
  updateProductoColor,
  getProductoColorById,
} from "../../api-gateway/producto.color.crud.js"; 
import { getColores } from "../../api-gateway/color.crud.js";
import { getProductos } from "../../api-gateway/producto.crud.js"; 

export default function ProductoColorForm({ id, onSuccess, onCancel }) {
  const [colorId, setColorId] = useState("");
  const [productoId, setProductoId] = useState(""); 
  const [colores, setColores] = useState([]);
  const [productos, setProductos] = useState([]); 
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function init() {
      try {
        // Cargar colores
        const coloresRes = await getColores();
        if (coloresRes.success) setColores(coloresRes.data);
        else setErrorMsg("No se pudieron cargar los colores.");

        // Cargar productos
        const productosRes = await getProductos();
        if (productosRes.success) setProductos(productosRes.data.productos || []);
        else setErrorMsg("No se pudieron cargar los productos.");

        // Si estamos editando
        if (id) {
          const res = await getProductoColorById(id);
          if (res.success) {
            setColorId(res.data.colorId || "");
            setProductoId(res.data.productoId || "");
            setImagenPreview(res.data.imagenUrl || null);
          } else {
            setErrorMsg(res.error || "No se pudo cargar el color del producto.");
          }
        }
      } catch (err) {
        setErrorMsg("Error al inicializar el formulario.");
      }
    }
    init();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImagenFile(file);
    if (file) setImagenPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!colorId || !productoId) return setErrorMsg("Debes seleccionar color y producto.");
  setLoading(true);
  setErrorMsg("");

  try {
    const payload = new FormData();
    payload.append("colorId", colorId);
    payload.append("productoId", productoId);
    if (imagenFile) payload.append("imagen", imagenFile); // ✅ este nombre coincide con upload.single("imagen")

    const res = id
      ? await updateProductoColor(id, payload)
      : await createProductoColor(payload);

    if (res.success) {
      onSuccess?.();
    } else {
      setErrorMsg(res.error || "Error al guardar el color del producto.");
    }
  } catch (err) {
    setErrorMsg("Error en la petición.");
  } finally {
    setLoading(false);
  }
};


  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md p-4 bg-white rounded-lg shadow space-y-4"
    >
      <h2 className="text-lg font-bold text-black">
        {id ? "Editar Color de Producto" : "Nuevo Color de Producto"}
      </h2>

      {errorMsg && (
        <div className="p-2 text-red-700 bg-red-100 border border-red-300 rounded">
          {errorMsg}
        </div>
      )}

      {/* Combobox de productos */}
      <div>
        <label className="block mb-1 font-medium text-black">
          Seleccionar producto *
        </label>
        <select
          value={productoId}
          onChange={(e) => setProductoId(e.target.value)}
          required
          className="w-full p-2 border rounded text-black"
        >
          <option value="">-- Selecciona un producto --</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Combobox de colores */}
      <div>
        <label className="block mb-1 font-medium text-black">
          Seleccionar color *
        </label>
        <select
          value={colorId}
          onChange={(e) => setColorId(e.target.value)}
          required
          className="w-full p-2 border rounded text-black"
        >
          <option value="">-- Selecciona un color --</option>
          {colores.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Imagen */}
      <div>
        <label className="block mb-1 font-medium">Imagen</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {imagenPreview && (
          <img
            src={imagenPreview}
            alt="Vista previa"
            className="mt-2 h-24 rounded object-cover border"
          />
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Guardando..." : id ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
}
