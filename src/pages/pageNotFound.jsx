import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-white px-6">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-rose-500">404</h1>
        <p className="text-2xl mt-4 font-semibold">Página no encontrada</p>
        <p className="text-zinc-400 mt-2">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <button
          onClick={handleReturn}
          className="mt-6 px-6 py-2 bg-rose-600 hover:bg-rose-700 rounded-lg text-white transition duration-300"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default PageNotFound;
