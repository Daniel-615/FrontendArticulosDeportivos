import { useEffect, useState } from "react";
import { getProductos } from "../../api-gateway/producto.crud.js"; // Ajusta la ruta si es necesario

export default function ProductosCardView() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    const response = await getProductos();
    if (response.success) {
      setProductos(response.data);
    } else {
      setError(response.error || "No se pudieron cargar los productos.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Nuestros Productos</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105"
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{producto.nombre}</h2>
              <p className="text-gray-600 text-sm mb-1">Precio: <strong>Q{producto.precio}</strong></p>
              <p className="text-gray-600 text-sm mb-1">Stock: {producto.stock}</p>
              <p className="text-gray-500 text-sm mt-2 italic">{producto.descripcion}</p>
            </div>
            <div className="bg-gray-50 px-4 py-2 flex justify-end">
              <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">
                Ver más
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
