import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  getProductoTallas,
  createProductoTalla,
  updateProductoTalla,
  deleteProductoTalla,
} from "../../api-gateway/producto.talla.crud.js";

export default function ProductoTallaCrudForm() {
  const [tallas, setTallas] = useState([]);
  const [editando, setEditando] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    cargarTallas();
  }, []);

  const cargarTallas = async () => {
    const res = await getProductoTallas();
    if (res.success) {
      setTallas(res.data);
    } else {
      alert(res.error);
    }
  };

  const onSubmit = async (data) => {
    let res;
    if (editando) {
      res = await updateProductoTalla(editando, data);
    } else {
      res = await createProductoTalla(data);
    }

    if (res.success) {
      reset();
      setEditando(null);
      cargarTallas();
    } else {
      alert(res.error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta talla?")) {
      const res = await deleteProductoTalla(id);
      if (res.success) {
        cargarTallas();
      } else {
        alert(res.error);
      }
    }
  };

  const handleEdit = (talla) => {
    setEditando(talla.id);
    setValue("talla", talla.talla);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Empleado</h2>
        <nav className="flex flex-col gap-4">
          <a href="/empleado-panel" className="hover:text-yellow-400">Inicio</a>
          <a href="/crear/marca" className="hover:text-yellow-400">Marcas</a>
          <a href="/crear/producto" className="hover:text-yellow-400">Crear Producto</a>
          <a href="/actualizar/producto" className="hover:text-yellow-400">Actualizar Producto</a>
          <a href="/crear/talla" className="hover:text-yellow-400">Tallas</a>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 bg-gray-100 overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Producto Tallas</h2>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md rounded-xl p-6 mb-10"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {editando ? "Editar Talla" : "Crear Talla"}
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("talla", { required: "La talla es obligatoria" })}
              placeholder="Ej. S, M, L, 38, 40..."
              className="w-full px-3 py-2 border rounded text-black"
            />
            {errors.talla && (
              <p className="text-red-500">{errors.talla.message}</p>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {editando ? "Actualizar" : "Crear"}
              </button>
              {editando && (
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setEditando(null);
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Lista */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {tallas.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-4 shadow rounded-xl"
              >
                <h4 className="text-lg font-semibold text-black">{t.talla}</h4>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(t)}
                    className="flex-1 bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="flex-1 bg-red-600 text-white py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
