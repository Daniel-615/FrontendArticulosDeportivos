import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContent';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-zinc-900 text-white px-6 py-4 flex justify-between items-center">
      <div className="text-lg font-bold">Mi App</div>
      <ul className="flex space-x-4 text-sm">
        {isAuthenticated && (
          <>
            <li>
              <Link to="/" className="hover:text-blue-400">Inicio</Link>
            </li>
            <li>
              <Link to="/shenron" className="hover:text-blue-400">Shenron</Link>
            </li>
          </>
        )}

        {!isAuthenticated && (
          <>
            <li><Link to="/login" className="hover:text-blue-400">Iniciar Sesión</Link></li>
            <li><Link to="/register" className="hover:text-blue-400">Registrarse</Link></li>
          </>
        )}
        {isAuthenticated &&user?.rol?.includes('admin') &&(
          <li>
            <Link to="/admin-panel" className='hover:text-blue-400'>Panel Administrador</Link>
          </li>
        )}
        {isAuthenticated && user?.rol?.includes('admin') && (
          <li>
            <Link to="/register-employee" className="hover:text-blue-400">Registrar Empleados</Link>
          </li>
        )}
        {isAuthenticated && (user?.rol?.includes('cliente') || user?.rol?.includes('admin')) &&(
          <li>
            <Link to="/user/profile" className="hover:text-blue-400">Perfil</Link>
          </li>
        )}
        {isAuthenticated && (user?.rol?.includes('cliente') || user?.rol?.includes('admin') || user?.rol?.includes('empleado')) &&(
          <li>
            <Link to="/producto" className="hover:text-blue-400">Ver Productos</Link>
          </li>
        )}
        {isAuthenticated && (user?.rol?.includes('cliente') || user?.rol?.includes('admin') || user?.rol?.includes('empleado')) &&(
          <li>
            <Link to="/carrito" className="hover:text-blue-400">Carrito</Link>
          </li>
        )}
        {isAuthenticated && (user?.rol?.includes('admin') || user?.rol?.includes('empleado')) &&(
          <li>
            <Link to="/empleado-panel" className="hover:text-blue-400">Empleados</Link>
          </li>
        )}
        {isAuthenticated && (
          <li>
            <button onClick={handleLogout} className="hover:text-red-400">Cerrar Sesión</button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
