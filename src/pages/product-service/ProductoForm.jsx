import { useEffect, useState } from "react";
import {
  getProductos,
  deleteProducto,
  updateProducto,
} from "../../api-gateway/producto.crud.js";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import SidebarEmpleado from "../../components/sideBar.jsx";

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
      {/* Sidebar externo */}
      <SidebarEmpleado />

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
                {/* ...inputs y botones igual que antes */}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
