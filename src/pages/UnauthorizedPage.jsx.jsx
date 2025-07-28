import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Acceso denegado</h1>
        <p className="text-lg text-gray-700 mb-6">
          No tienes los permisos necesarios para ver esta página.
        </p>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-300"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
