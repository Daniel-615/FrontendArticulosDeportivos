import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { postColor, getColorId, getColores, putColor } from "../../api-gateway/color.crud";
import namer from "color-namer";
import SidebarEmpleado from "../../components/sideBar.jsx";
export default function ColorCrudForm() {
  const [colores, setColores] = useState([]);
  const [editando, setEditando] = useState(null);
  const [nombreManual, setNombreManual] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const codigoHex = watch("codigoHex");
  const nombre = watch("nombre");

  useEffect(() => {
    cargarColores();
  }, []);

  useEffect(() => {
    if (codigoHex && !nombreManual) {
      const nombres = namer(codigoHex);
      const nombreColor = nombres.ntc[0].name;
      setValue("nombre", nombreColor);
    }
  }, [codigoHex, nombreManual, setValue]);

  const cargarColores = async () => {
    const response = await getColores();
    if (response.success) setColores(response.data);
    else alert(response.error);
  };

  const onSubmit = async (data) => {
    let response;
    if (editando) response = await putColor(editando, data);
    else response = await postColor(data);

    if (response.success) {
      reset();
      setEditando(null);
      setNombreManual(false);
      cargarColores();
    } else {
      alert(response.error || "No se pudo guardar el color");
    }
  };

  const editarColor = async (id) => {
    const response = await getColorId(id);
    if (response.success) {
      setEditando(id);
      setValue("nombre", response.data.nombre);
      setValue("codigoHex", response.data.codigoHex || "#000000");
      setNombreManual(false);
    } else {
      alert(response.error);
    }
  };

  const cancelarEdicion = () => {
    reset();
    setEditando(null);
    setNombreManual(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SidebarEmpleado />
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between">
          <button
            className="md:hidden text-gray-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1 className="text-xl font-bold text-gray-800">Gestión de Colores</h1>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4 text-black">
              {editando ? "Editar Color" : "Agregar Color"}
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white shadow p-4 rounded space-y-4"
            >
              <div>
                <label className="block mb-1 font-medium text-black">Nombre del color</label>
                <input
                  {...register("nombre", { required: "El nombre es obligatorio" })}
                  className="border p-2 w-full rounded text-black"
                  placeholder="Ej: Rojo"
                  onChange={() => setNombreManual(true)}
                />
                {errors.nombre && (
                  <p className="text-red-500 text-sm">{errors.nombre.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium text-black" >Código HEX</label>
                <input
                  type="color"
                  {...register("codigoHex")}
                  className="border p-1 w-16 h-10 rounded"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {editando ? "Actualizar" : "Guardar"}
                </button>
                {editando && (
                  <button
                    type="button"
                    onClick={cancelarEdicion}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            <h3 className="text-lg font-bold mt-6 mb-2">Lista de Colores</h3>
            <AnimatePresence>
              {colores.map((color) => (
                <motion.div
                  key={color.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  className="flex justify-between items-center bg-gray-100 p-2 mb-2 rounded"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: color.codigoHex }}
                    ></span>
                    <span className="text-black">{color.nombre}</span>
                  </div>
                  <button
                    onClick={() => editarColor(color.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
