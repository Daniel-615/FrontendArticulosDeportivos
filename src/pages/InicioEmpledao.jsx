import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function InicioEmpleado() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-800 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Empleado Panel</h2>
        <nav className="space-y-4">
          <button
            onClick={() => navigate("/crear/producto")}
            className="w-full text-left hover:text-blue-400"
          >
            Crear Producto
          </button>
          <button
            onClick={() => navigate("/actualizar/producto")}
            className="w-full text-left hover:text-blue-400"
          >
            Actualizar Productos
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-3xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Bienvenido al Panel de Empleados de FitZone
          </motion.h1>

          <motion.p
            className="text-lg text-gray-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Desde aquí puedes administrar productos, actualizar inventario y gestionar el contenido de la tienda.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={() => navigate("/crear/producto")}
              className="bg-blue-600 hover:bg-blue-700 transition px-6 py-4 rounded-lg shadow-lg text-lg font-semibold"
            >
              Crear Nuevo Producto
            </button>

            <button
              onClick={() => navigate("/actualizar/producto")}
              className="bg-yellow-500 hover:bg-yellow-600 transition px-6 py-4 rounded-lg shadow-lg text-lg font-semibold text-white"
            >
              Editar / Eliminar Productos
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
