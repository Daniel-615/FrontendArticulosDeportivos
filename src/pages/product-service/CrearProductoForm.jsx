import { useForm } from "react-hook-form";
import { createProducto } from "../../api-gateway/producto.crud.js";
import { getCategorias } from "../../api-gateway/categoria.crud.js";
import { getMarcas } from "../../api-gateway/marca.crud.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SidebarEmpleado from "../../components/sideBar.jsx";
export default function CrearProductoForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [mensaje, setMensaje] = useState(null);
  const [exito, setExito] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const catRes = await getCategorias();
      const marcaRes = await getMarcas();
      if (catRes.success) setCategorias(catRes.data);
      if (marcaRes.success) setMarcas(marcaRes.data);
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    const response = await createProducto(data);
    if (response.success) {
      setExito("Producto creado correctamente.");
      setMensaje(null);
      reset();
      setTimeout(() => navigate("/actualizar/producto"), 1500);
    } else {
      setMensaje(response.error || "Error al crear producto.");
      setExito(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <SidebarEmpleado/>

      {/* Main Content */}
      <main className="flex-1 bg-gray-900 text-white p-8">
        <motion.div className="max-w-xl mx-auto" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <motion.h2 className="text-2xl font-bold text-center mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            Crear Producto
          </motion.h2>

          {mensaje && <motion.p className="text-red-400 text-sm mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{mensaje}</motion.p>}
          {exito && <motion.p className="text-green-400 text-sm mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{exito}</motion.p>}

          <motion.form onSubmit={handleSubmit(onSubmit)} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
            <div>
              <label className="block text-sm font-medium">Nombre</label>
              <input
                type="text"
                {...register("nombre", { required: "El nombre es obligatorio." })}
                className="mt-1 block w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
              />
              {errors.nombre && <span className="text-red-400 text-sm">{errors.nombre.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium">Descripción</label>
              <textarea
                {...register("descripcion", { required: "La descripción es obligatoria." })}
                className="mt-1 block w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
              />
              {errors.descripcion && <span className="text-red-400 text-sm">{errors.descripcion.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium">Precio (Q)</label>
              <input
                type="number"
                step="0.01"
                {...register("precio", {
                  required: "El precio es obligatorio.",
                  min: { value: 0, message: "El precio debe ser mayor o igual a 0." },
                })}
                className="mt-1 block w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
              />
              {errors.precio && <span className="text-red-400 text-sm">{errors.precio.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium">Categoría</label>
              <select
                {...register("categoriaId", { required: "La categoría es obligatoria." })}
                className="mt-1 block w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
              {errors.categoriaId && <span className="text-red-400 text-sm">{errors.categoriaId.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium">Marca</label>
              <select
                {...register("marcaId", { required: "La marca es obligatoria." })}
                className="mt-1 block w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2"
              >
                <option value="">Selecciona una marca</option>
                {marcas.map((marca) => (
                  <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                ))}
              </select>
              {errors.marcaId && <span className="text-red-400 text-sm">{errors.marcaId.message}</span>}
            </div>

            <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Crear Producto
            </motion.button>
          </motion.form>
        </motion.div>
      </main>
    </div>
  );
}
