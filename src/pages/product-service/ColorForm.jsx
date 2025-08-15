import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { postColor, getColorId, getColores, putColor } from "../../api-gateway/color.crud";

export default function ColorCrudForm() {
  const [colores, setColores] = useState([]);
  const [editando, setEditando] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    cargarColores();
  }, []);

  const cargarColores = async () => {
    const response = await getColores();
    if (response.success) setColores(response.data);
    else alert(response.error);
  };

  const onSubmit = async (data) => {
    let response;
    if (editando) {
      response = await putColor(editando, data);
    } else {
      response = await postColor(data);
    }
    if (response.success) {
      reset();
      setEditando(null);
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
    } else {
      alert(response.error);
    }
  };

  const cancelarEdicion = () => {
    reset();
    setEditando(null);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {editando ? "Editar Color" : "Agregar Color"}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow p-4 rounded space-y-4"
      >
        {/* Campo nombre */}
        <div>
          <label className="block mb-1 font-medium">Nombre del color</label>
          <input
            {...register("nombre", { required: "El nombre es obligatorio" })}
            className="border p-2 w-full rounded text-black"
            placeholder="Ej: Rojo"
          />
          {errors.nombre && (
            <p className="text-red-500 text-sm">{errors.nombre.message}</p>
          )}
        </div>

        {/* Campo codigoHex */}
        <div>
          <label className="block mb-1 font-medium">Código HEX</label>
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
              <span>{color.nombre}</span>
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
  );
}
