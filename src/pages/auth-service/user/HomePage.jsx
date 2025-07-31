import { useAuth } from '../../../context/AuthContent.jsx';
import { FaRunning } from 'react-icons/fa';

function HomePage() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="text-center text-white mt-10">Cargando usuario...</div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-700 to-black max-w-xl p-10 rounded-2xl text-white mx-auto mt-16 shadow-2xl border border-green-500">
      <div className="flex flex-col items-center">
        <FaRunning className="text-5xl text-yellow-400 mb-4 animate-bounce" />
        <h1 className="text-4xl font-extrabold mb-2 uppercase tracking-wide">Articulos Deportivos</h1>
        <p className="text-lg text-zinc-200 italic mb-6">¡Tu energía comienza aquí!</p>

        {user ? (
          <>
            <p className="text-white text-xl font-semibold mb-2">
              Bienvenido, <span className="text-yellow-300">{user.nombre} {user.apellido}</span>
            </p>
            <p className="text-md text-zinc-300">
              Rol asignado: <span className="font-bold text-white">{user.rol}</span>
            </p>
          </>
        ) : (
          <p className="text-lg">No se ha iniciado sesión.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
