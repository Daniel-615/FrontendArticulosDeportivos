import { useEffect, useState } from "react";
import {
  getMarcas,
  createMarca,
  updateMarca,
  deleteMarca,
} from "../../api-gateway/marca.crud.js";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

export default function MarcasCrudForm() {
  const [marcas, setMarcas] = useState([]);
  const [editando, setEditando] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    cargarMarcas();
  }, []);

  const cargarMarcas = async () => {
    const response = await getMarcas();
    if (response.success) setMarcas(response.data);
  };

  const onSubmit = async (data) => {
    let response;
    if (editando) {
      response = await updateMarca(editando, data);
    } else {
      response = await createMarca(data);
    }

    if (response.success) {
      reset();
      setEditando(null);
      cargarMarcas();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta marca?")) {
      const response = await deleteMarca(id);
      if (response.success) cargarMarcas();
    }
  };

  const handleEdit = (marca) => {
    setEditando(marca.id);
    setValue("nombre", marca.nombre);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Empleado</h2>
        <nav className="flex flex-col gap-4">
          <a href="/empleado-panel" className="hover:text-yellow-400">Inicio</a>
          <a href="/crear/categoria" className="hover:text-yellow-400">Categoria</a>
          <a href="/crear/producto" className="hover:text-yellow-400">Crear Producto</a>
          <a href="/actualizar/producto" className="hover:text-yellow-400">Actualizar Producto</a>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 bg-gray-100 overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Marcas</h2>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md rounded-xl p-6 mb-10"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {editando ? "Editar Marca" : "Crear Marca"}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("nombre", { required: "El nombre es obligatorio" })}
              placeholder="Nombre de la marca"
              className="w-full px-3 py-2 border rounded text-black"
            />
            {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}

            <div className="flex gap-4">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
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
            {marcas.map((marca) => (
              <motion.div
                key={marca.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-4 shadow rounded-xl"
              >
                <h4 className="text-lg font-semibold text-black">{marca.nombre}</h4>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(marca)}
                    className="flex-1 bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(marca.id)}
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
