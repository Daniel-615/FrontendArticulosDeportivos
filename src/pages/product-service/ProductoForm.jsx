import { useEffect, useState } from "react";
import {
  getProductos,
  deleteProducto,
  updateProducto,
} from "../../api-gateway/producto.crud.js";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductosCrudForm() {
  const [productos, setProductos] = useState([]);
  const [editando, setEditando] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    const response = await getProductos();
    if (response.success) {
      setProductos(response.data.productos);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      const response = await deleteProducto(id);
      if (response.success) {
        cargarProductos();
      }
    }
  };

  const handleEdit = (producto) => {
    setEditando(producto.id);
    setValue("nombre", producto.nombre);
    setValue("descripcion", producto.descripcion);
    setValue("precio", parseFloat(producto.precio));
    setValue("stock", producto.stock);
  };

  const onSubmit = async (data) => {
    const response = await updateProducto(editando, {
      ...data,
      precio: parseFloat(data.precio),
      stock: parseInt(data.stock),
    });
    if (response.success) {
      setEditando(null);
      reset();
      cargarProductos();
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-6">Empleado</h2>
        <nav className="flex flex-col gap-4">
          <a href="/empleado-panel" className="hover:text-yellow-400">
            Inicio Empleado
          </a>
          <a href="/crear/marca" className="hover:text-yellow-400">
            Marcas
          </a>
          <a href="/crear/categoria" className="hover:text-yellow-400">
            Categoria
          </a>
          <a href="/crear/producto" className="hover:text-yellow-400">
            Crear Productos
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <motion.h2
          className="text-3xl font-bold mb-6 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Lista de Productos
        </motion.h2>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {productos.map((prod) => (
              <motion.div
                key={prod.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4 }}
                className="bg-white shadow-lg rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{prod.nombre}</h3>
                  <p className="text-gray-600 text-sm mt-1">{prod.descripcion}</p>
                  <p className="mt-2 font-semibold text-gray-700">
                    Precio: Q{Number(prod.precio).toFixed(2)}
                  </p>
                  <p className="text-gray-600">Stock: {prod.stock}</p>
                  <p className="text-gray-600">Marca: {prod.marca?.nombre || "Sin marca"}</p>
                  <p className="text-gray-600">Categoría: {prod.categoria?.nombre || "Sin categoría"}</p>

                </div>
                <div className="flex gap-2 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(prod)}
                    className="flex-1 bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(prod.id)}
                    className="flex-1 bg-red-600 text-white py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {editando && (
            <motion.div
              key="editar-formulario"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              className="mt-10 bg-white rounded-xl p-6 shadow-md"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Editar Producto</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                  {...register("nombre", { required: "El nombre es obligatorio" })}
                  placeholder="Nombre"
                  className="w-full px-3 py-2 border rounded text-gray-900"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-sm">{errors.nombre.message}</p>
                )}

                <textarea
                  {...register("descripcion", {
                    required: "La descripción es obligatoria",
                  })}
                  placeholder="Descripción"
                  className="w-full px-3 py-2 border rounded text-gray-900"
                />
                {errors.descripcion && (
                  <p className="text-red-500 text-sm">{errors.descripcion.message}</p>
                )}

                <input
                  type="number"
                  step="0.01"
                  {...register("precio", {
                    required: "El precio es obligatorio",
                    min: { value: 0, message: "Debe ser mayor o igual a 0" },
                  })}
                  placeholder="Precio"
                  className="w-full px-3 py-2 border rounded text-gray-900"
                />
                {errors.precio && (
                  <p className="text-red-500 text-sm">{errors.precio.message}</p>
                )}

                <input
                  type="number"
                  {...register("stock", {
                    required: "El stock es obligatorio",
                    min: { value: 0, message: "Debe ser mayor o igual a 0" },
                  })}
                  placeholder="Stock"
                  className="w-full px-3 py-2 border rounded text-gray-900"
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm">{errors.stock.message}</p>
                )}

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Guardar Cambios
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => {
                      reset();
                      setEditando(null);
                    }}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancelar
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
