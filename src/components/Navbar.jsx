import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="relative z-[1000] bg-zinc-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-lg font-bold">FitZone</div>
      <ul className="flex flex-wrap items-center gap-4 text-sm">
        {/* --- Enlaces públicos --- */}
        {!isAuthenticated && (
          <>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `hover:text-blue-400 ${isActive ? 'text-blue-400 font-semibold' : ''}`
                }
              >
                Iniciar Sesión
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `hover:text-blue-400 ${isActive ? 'text-blue-400 font-semibold' : ''}`
                }
              >
                Registrarse
              </NavLink>
            </li>
          </>
        )}


        {isAuthenticated && (
          <>
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `hover:text-blue-400 ${isActive ? 'text-blue-400 font-semibold' : ''}`
                }
              >
                Inicio
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/shenron"
                className={({ isActive }) =>
                  `hover:text-blue-400 ${isActive ? 'text-blue-400 font-semibold' : ''}`
                }
              >
                Shenron
              </NavLink>
            </li>

            {Array.isArray(user?.rol) && user.rol.includes('admin') && (
              <>
                <li>
                  <NavLink
                    to="/admin-panel"
                    className={({ isActive }) =>
                      `hover:text-blue-400 ${isActive ? 'text-blue-400 font-semibold' : ''}`
                    }
                  >
                    Panel Admin
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/register-employee"
                    className={({ isActive }) =>
                      `hover:text-blue-400 ${isActive ? 'text-blue-400 font-semibold' : ''}`
                    }
                  >
                    Registrar Empleados
                  </NavLink>
                </li>
              </>
            )}

            {Array.isArray(user?.rol) &&
              (user.rol.includes('cliente') || user.rol.includes('admin')) && (
                <li>
                  <NavLink
                    to="/user/profile"
                    className={({ isActive }) =>
                      `hover:text-blue-400 ${isActive ? 'text-blue-400 font-semibold' : ''}`
                    }
                  >
                    Perfil
                  </NavLink>
                </li>
              )}

            {Array.isArray(user?.rol) &&
              (user.rol.includes('cliente') ||
                user.rol.includes('admin') ||
                user.rol.includes('empleado')) && (
                <>
                  <li>
                    <NavLink
                      to="/producto"
                      className={({ isActive }) =>
                        `hover:text-blue-400 ${isActive ? 'text-blue-400 font-semibold' : ''}`
                      }
                    >
                      Productos
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/carrito"
                      className={({ isActive }) =>
                        `hover:text-blue-400 ${isActive ? 'text-blue-400 font-semibold' : ''}`
                      }
                    >
                      Carrito
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/wishlist"
                      className={({ isActive }) =>
                        `hover:text-blue-400 ${isActive ? 'text-blue-400 font-semibold' : ''}`
                      }
                    >
                      Wishlist
                    </NavLink>
                  </li>
                </>
              )}


            {Array.isArray(user?.rol) &&
              (user.rol.includes('empleado') || user.rol.includes('admin')) && (
                <li>
                  <NavLink
                    to="/empleado-panel"
                    className={({ isActive }) =>
                      `hover:text-blue-400 ${isActive ? 'text-blue-400 font-semibold' : ''}`
                    }
                  >
                    Panel Empleados
                  </NavLink>
                </li>
              )}

            <li>
              <button
                onClick={handleLogout}
                className="hover:text-red-400 transition-colors"
              >
                Cerrar Sesión
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
