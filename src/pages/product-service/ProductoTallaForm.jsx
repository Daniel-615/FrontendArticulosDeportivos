import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  getProductoTallas,
  createProductoTalla,
  updateProductoTalla,
  deleteProductoTalla,
} from "../../api-gateway/producto.talla.crud.js";
import { getProductoColores } from "../../api-gateway/producto.color.crud.js";
import { getTallas } from "../../api-gateway/talla.crud.js";
import SidebarEmpleado from "../../components/sideBar.jsx";

export default function TallaColorProductoCrudForm() {
  const [items, setItems] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [colores, setColores] = useState([]);
  const [editando, setEditando] = useState(null);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    cargarItems();
    cargarTallas();
    cargarColores();
  }, []);

  const cargarItems = async () => {
    const res = await getProductoTallas();
    if (res.success) {
      setItems(Array.isArray(res.data.tallas_color) ? res.data.tallas_color : []);
    } else setFormError(res.error || "Error al cargar los registros");
  };

  const cargarTallas = async () => {
    const res = await getTallas();
    if (res.success) {
      setTallas(Array.isArray(res.data) ? res.data : []);
    } else setFormError(res.error || "Error al cargar tallas");
  };

  const cargarColores = async () => {
    const res = await getProductoColores();
    if (res.success) {
      setColores(Array.isArray(res.data.data) ? res.data.data : []);
    } else setFormError(res.error || "Error al cargar colores");
  };

  const onSubmit = async (data) => {
    setFormError("");
    let payload = {
      id_talla: data.id_talla,
      id_producto_color: data.id_producto_color,
      stock: data.stock,
    };

    let res;
    if (editando) res = await updateProductoTalla(editando, payload);
    else res = await createProductoTalla(payload);

    if (res.success) {
      reset();
      setEditando(null);
      cargarItems();
    } else setFormError(res.error || "Error al guardar el registro");
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este registro?")) {
      const res = await deleteProductoTalla(id);
      if (res.success) cargarItems();
      else setFormError(res.error || "Error al eliminar registro");
    }
  };

  const handleEdit = (item) => {
    setEditando(item.id);
    setValue("id_talla", item.id_talla);
    setValue("id_producto_color", item.id_producto_color);
    setValue("stock", item.stock);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarEmpleado />

      {/* Contenido */}
      <div className="flex-1 p-4 sm:p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-black">
          Gestión de Talla y Color de Producto
        </h2>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md rounded-xl p-4 sm:p-6 mb-10 border"
        >
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
            {editando ? "Editar Registro" : "Crear Registro"}
          </h3>

          {formError && <p className="mb-4 text-red-600 font-medium">{formError}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Select Tallas */}
            <div>
              <label className="block mb-1 font-medium">Talla</label>
              <select
                {...register("id_talla", { required: "Selecciona una talla" })}
                className="w-full px-3 py-2 border rounded text-black"
                defaultValue=""
              >
                <option value="" disabled>
                  -- Selecciona Talla --
                </option>
                {tallas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.valor}
                  </option>
                ))}
              </select>
              {errors.id_talla && <p className="text-red-500">{errors.id_talla.message}</p>}
            </div>

            {/* Select Colores */}
            <div>
              <label className="block mb-1 font-medium text-black">Producto Color</label>
              <select
                {...register("id_producto_color", { required: "Selecciona un color" })}
                className="w-full px-3 py-2 border rounded text-black"
                defaultValue=""
              >
                <option value="" disabled>
                  -- Selecciona Color --
                </option>
                {colores.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombreProducto} - {c.nombreColor}
                  </option>
                ))}
              </select>
              {errors.id_producto_color && (
                <p className="text-red-500">{errors.id_producto_color.message}</p>
              )}
            </div>

            {/* Stock */}
            <input
              type="number"
              {...register("stock", { required: "El stock es obligatorio", min: 0 })}
              placeholder="Stock"
              className="w-full px-3 py-2 border rounded text-black"
            />
            {errors.stock && <p className="text-red-500">{errors.stock.message}</p>}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {editando ? "Actualizar" : "Crear"}
              </button>
              {editando && (
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setEditando(null);
                    setFormError("");
                  }}
                  className="flex-1 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Lista */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-4 shadow rounded-xl border"
              >
                <div className="flex items-center gap-3 mb-2">
                  {item.color?.imagenUrl && (
                    <img
                      src={item.color.imagenUrl}
                      alt={item.color?.nombreColor}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <h4 className="text-base md:text-lg font-semibold text-black">
                    {item.color?.nombreProducto} - {item.color?.nombreColor}
                  </h4>
                </div>
                <p className="text-black mb-1">Talla: {item.talla}</p>
                <p className="text-black mb-2">Stock: {item.stock}</p>

                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 bg-red-600 text-white py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
