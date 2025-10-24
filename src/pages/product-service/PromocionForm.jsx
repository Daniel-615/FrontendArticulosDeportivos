
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { Percent, Truck, Sparkles, CalendarClock, CheckCircle2 } from "lucide-react";
import SidebarEmpleado from "../../components/sideBar.jsx";
import { createPromocion } from "../../api-gateway/promocion.crud.js";


export default function PromocionCreateForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      tipo: "DESC_FIJO",
      porcentaje: 10,
      usosMaximos: 1,
      expiraEl: "",
      metadata: {
        stackable: false,
        minCompra: 0,
        productoId: "",
      },
      activo: true,
    },
  });

  const tipo = watch("tipo");

  useEffect(() => {
    if (tipo === "ENVIO_GRATIS") {
      setValue("porcentaje", "");
    } else if (!watch("porcentaje")) {
      setValue("porcentaje", 10);
    }
  }, [tipo]); 


  const toISOorNull = (dt) => {
    if (!dt) return null;
    const asDate = new Date(dt);
    if (isNaN(asDate.getTime())) return null;
    return asDate.toISOString();
  };

  const onSubmit = async (data) => {
    const payload = {
      tipo: data.tipo,
      porcentaje:
        data.tipo === "ENVIO_GRATIS" ? null : Number(data.porcentaje),
      usosMaximos: Number(data.usosMaximos),
      expiraEl: toISOorNull(data.expiraEl),
      metadata: {
        stackable: !!data?.metadata?.stackable,
        minCompra: Number(data?.metadata?.minCompra || 0),
        productoId: data?.metadata?.productoId || null,
      },
      activo: !!data.activo,
    };

    const resp = await createPromocion(payload);
    if (resp.success) {
      alert("Promoción creada correctamente");
      reset({
        tipo: "DESC_FIJO",
        porcentaje: 10,
        usosMaximos: 1,
        expiraEl: "",
        metadata: { stackable: false, minCompra: 0, productoId: "" },
        activo: true,
      });
    } else {
      alert(`${resp.error || "Error al crear la promoción"}`);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <SidebarEmpleado />

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black uppercase tracking-tight mb-2">
            CREAR PROMOCIÓN
          </h2>
          <div className="h-1 w-20 bg-black"></div>
        </div>

        {/* Card del formulario */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black text-white p-6 mb-10"
        >
          <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Datos de la promoción
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Tipo */}
            <div>
              <label className="block text-sm font-bold mb-2 uppercase">
                Tipo de promoción
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className={`flex items-center gap-2 p-3 border ${tipo === "DESC_FIJO" ? "border-white" : "border-gray-700"} cursor-pointer`}>
                  <input
                    type="radio"
                    value="DESC_FIJO"
                    {...register("tipo", { required: true })}
                    className="accent-white"
                  />
                  <span className="font-semibold">Descuento fijo (%)</span>
                </label>

                <label className={`flex items-center gap-2 p-3 border ${tipo === "DESC_RANDOM" ? "border-white" : "border-gray-700"} cursor-pointer`}>
                  <input
                    type="radio"
                    value="DESC_RANDOM"
                    {...register("tipo", { required: true })}
                    className="accent-white"
                  />
                  <span className="font-semibold">Descuento aleatorio (%)</span>
                </label>

                <label className={`flex items-center gap-2 p-3 border ${tipo === "ENVIO_GRATIS" ? "border-white" : "border-gray-700"} cursor-pointer`}>
                  <input
                    type="radio"
                    value="ENVIO_GRATIS"
                    {...register("tipo", { required: true })}
                    className="accent-white"
                  />
                  <span className="font-semibold flex items-center gap-1">
                    <Truck className="w-4 h-4" /> Envío gratis
                  </span>
                </label>
              </div>
              {errors.tipo && (
                <p className="text-red-400 font-medium mt-2">
                  Selecciona un tipo de promoción.
                </p>
              )}
            </div>

            {/* Porcentaje */}
            {tipo !== "ENVIO_GRATIS" && (
              <div>
                <label className="block text-sm font-bold mb-2 uppercase">
                  Porcentaje
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="Ej: 10"
                    className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none uppercase placeholder:text-gray-400"
                    {...register("porcentaje", {
                      required: "El porcentaje es obligatorio",
                      min: { value: 0, message: "Debe ser ≥ 0" },
                      max: { value: 100, message: "Debe ser ≤ 100" },
                    })}
                  />
                  <Percent className="w-5 h-5" />
                </div>
                {errors.porcentaje && (
                  <p className="text-red-400 font-medium">
                    {errors.porcentaje.message}
                  </p>
                )}
              </div>
            )}

            {/* Usos máximos */}
            <div>
              <label className="block text-sm font-bold mb-2 uppercase">
                Usos máximos
              </label>
              <input
                type="number"
                min="1"
                placeholder="1"
                className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none uppercase placeholder:text-gray-400"
                {...register("usosMaximos", {
                  required: "Campo obligatorio",
                  valueAsNumber: true,
                  min: { value: 1, message: "Debe ser ≥ 1" },
                })}
              />
              {errors.usosMaximos && (
                <p className="text-red-400 font-medium">
                  {errors.usosMaximos.message}
                </p>
              )}
            </div>

            {/* Expiración */}
            <div>
              <label className="block text-sm font-bold mb-2 uppercase">
                Expira el (opcional)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="datetime-local"
                  className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none uppercase placeholder:text-gray-400"
                  {...register("expiraEl")}
                />
                <CalendarClock className="w-5 h-5" />
              </div>
            </div>

            {/* Metadata */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Stackable */}
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-white"
                  {...register("metadata.stackable")}
                />
                <span className="uppercase text-sm font-bold">Acumulable</span>
              </label>

              {/* Min compra */}
              <div>
                <label className="block text-sm font-bold mb-2 uppercase">
                  Mínimo de compra (opcional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none uppercase placeholder:text-gray-400"
                  {...register("metadata.minCompra", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Debe ser ≥ 0" },
                  })}
                />
              </div>

              {/* Producto específico */}
              <div>
                <label className="block text-sm font-bold mb-2 uppercase">
                  Producto aplicable (UUID opcional)
                </label>
                <input
                  type="text"
                  placeholder="UUID del producto"
                  className="w-full px-4 py-3 bg-white text-black border-2 border-white focus:outline-none uppercase placeholder:text-gray-400"
                  {...register("metadata.productoId")}
                />
              </div>
            </div>

            {/* Activo */}
            <div className="flex items-center gap-3">
              <Controller
                name="activo"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-white"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    <span className="uppercase font-bold">Activo</span>
                  </label>
                )}
              />
              <CheckCircle2 className="w-5 h-5" />
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-white text-black py-3 font-bold uppercase hover:bg-gray-200 transition-colors disabled:opacity-60"
              >
                {isSubmitting ? "Creando..." : "Crear promoción"}
              </button>
              <button
                type="button"
                onClick={() =>
                  reset({
                    tipo: "DESC_FIJO",
                    porcentaje: 10,
                    usosMaximos: 1,
                    expiraEl: "",
                    metadata: { stackable: false, minCompra: 0, productoId: "" },
                    activo: true,
                  })
                }
                className="flex-1 bg-gray-700 text-white py-3 font-bold uppercase hover:bg-gray-600 transition-colors"
              >
                Limpiar
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
