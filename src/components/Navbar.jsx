import { useState } from "react"
import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  Home,
  Package,
  Users,
  Settings,
  Flame,
  Truck,
  ChevronDown,
  DollarSign,
  BarChart3,
  Menu,
  X,
  BookOpen,
  TicketPercent,
} from "lucide-react"

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAdmin = Array.isArray(user?.rol) && user.rol.includes("admin")

  const handleLogout = async () => {
    await logout()
    setMobileMenuOpen(false)
  }

  const handleNavClick = () => {
    setMobileMenuOpen(false)
    setOpenDropdown(null)
  }

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key))
  }

  return (
    <nav className="bg-black border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <div className="flex items-center space-x-3 shrink-0">
            <NavLink
              to="/"
              end
              onClick={handleNavClick}
              className="text-xl sm:text-2xl font-black text-white tracking-tighter hover:text-white/80 transition-colors"
            >
              FITZONE
            </NavLink>
            <NavLink
              to="/shenron"
              onClick={handleNavClick}
              className="hidden sm:flex items-center space-x-1 opacity-0 hover:opacity-100 transition-opacity duration-300 group"
            >
              <Flame size={14} className="text-orange-500 animate-pulse" />
              <span className="text-xs font-bold text-orange-500 tracking-wider">SHENRON</span>
              <Flame size={14} className="text-orange-500 animate-pulse" />
            </NavLink>
          </div>

          {/* NAV DESKTOP */}
          <div className="hidden lg:flex flex-1 items-stretch">
            <div className="nav-scroll overflow-x-auto overflow-y-visible overscroll-x-contain w-full pb-1 -mb-1">
              <ul className="flex items-center justify-end space-x-1 whitespace-nowrap min-w-max pr-4">
                {!isAuthenticated && (
                  <>
                    <li>
                      <NavLink
                        to="/login"
                        className={({ isActive }) =>
                          `px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                        }
                      >
                        INICIAR SESIÓN
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/register"
                        className={({ isActive }) =>
                          `px-4 py-2 bg-white text-black hover:bg-white/90 transition-colors text-sm font-bold tracking-wide ${isActive ? "bg-white/90" : ""}`
                        }
                      >
                        REGISTRARSE
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
                          `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                        }
                      >
                        <Home size={16} />
                        <span>INICIO</span>
                      </NavLink>
                    </li>

                    {/* ADMIN como trigger con flecha y submenu Dashboard/Docs */}
                    {isAdmin && (
                      <>
                        {/* Link a Admin Panel + botón flecha que despliega submenu */}
                        <li className="relative flex items-stretch">
                          <NavLink
                            to="/admin-panel"
                            className={({ isActive }) =>
                              `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                            }
                          >
                            <Settings size={16} />
                            <span>ADMIN</span>
                          </NavLink>

                          {/* Botón flecha (no navega) */}
                          <button
                            type="button"
                            aria-haspopup="menu"
                            aria-expanded={openDropdown === "admin"}
                            onClick={() => toggleDropdown("admin")}
                            className="px-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <ChevronDown size={14} />
                          </button>

                          {/* Submenu: Dashboard y Docs */}
                          {openDropdown === "admin" && (
                            <div className="absolute top-full left-0 mt-0 w-56 bg-black border border-white/10 shadow-xl z-50">
                              <NavLink
                                to="/dashboard"
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                  `flex items-center gap-2 px-4 py-3 text-sm font-medium tracking-wide text-white/80 hover:text-white hover:bg-blue-500/10 ${isActive ? "text-white bg-blue-500/10" : ""}`
                                }
                              >
                                <BarChart3 size={16} />
                                <span>Dashboard</span>
                              </NavLink>
                              <NavLink
                                to="/documentation"
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                  `flex items-center gap-2 px-4 py-3 text-sm font-medium tracking-wide text-white/80 hover:text-white hover:bg-purple-500/10 ${isActive ? "text-white bg-purple-500/10" : ""}`
                                }
                              >
                                <BookOpen size={16} />
                                <span>Docs</span>
                              </NavLink>
                              {/* Si quieres también aquí Empleados, descomenta:
                              <NavLink
                                to="/register-employee"
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                  `flex items-center gap-2 px-4 py-3 text-sm font-medium tracking-wide text-white/80 hover:text-white hover:bg-white/5 ${isActive ? "text-white bg-white/5" : ""}`
                                }
                              >
                                <Users size={16} />
                                <span>Empleados</span>
                              </NavLink>
                              */}
                            </div>
                          )}
                        </li>

                        {/* Empleados se queda como ítem normal (si quieres meterlo al submenu, mueve el <NavLink/> arriba y elimina este li) */}
                        <li>
                          <NavLink
                            to="/register-employee"
                            className={({ isActive }) =>
                              `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                            }
                          >
                            <Users size={16} />
                            <span>EMPLEADOS</span>
                          </NavLink>
                        </li>
                      </>
                    )}

                    {Array.isArray(user?.rol) && (user.rol.includes("cliente") || isAdmin) && (
                      <li>
                        <NavLink
                          to="/user/profile"
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                          }
                        >
                          <User size={16} />
                          <span>PERFIL</span>
                        </NavLink>
                      </li>
                    )}

                    {Array.isArray(user?.rol) &&
                      (user.rol.includes("cliente") || isAdmin || user.rol.includes("empleado")) && (
                        <>
                          <li>
                            <NavLink
                              to="/producto"
                              className={({ isActive }) =>
                                `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                              }
                            >
                              <Package size={16} />
                              <span>PRODUCTOS</span>
                            </NavLink>
                          </li>

                          {/* CARRITO (Dropdown) */}
                          <li
                            className="relative"
                            onMouseEnter={() => setOpenDropdown("carrito")}
                            onMouseLeave={() => setOpenDropdown(null)}
                          >
                            <NavLink
                              to="/carrito"
                              className={({ isActive }) =>
                                `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                              }
                            >
                              <ShoppingCart size={16} />
                              <span>CARRITO</span>
                              <ChevronDown size={14} className="ml-1" />
                            </NavLink>

                            {openDropdown === "carrito" && (
                              <div className="absolute top-full left-0 mt-0 w-48 bg-black border border-white/10 shadow-xl z-50">
                                <NavLink
                                  to="/wishlist"
                                  className={({ isActive }) =>
                                    `flex items-center space-x-2 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                                  }
                                >
                                  <Heart size={16} />
                                  <span>WISHLIST</span>
                                </NavLink>
                              </div>
                            )}
                          </li>
                        </>
                      )}

                    {/* ENVÍOS con flecha (dropdown) solo para empleados/admin */}
                    {Array.isArray(user?.rol) && (user.rol.includes("empleado") || isAdmin) && (
                      <>
                        <li className="relative">
                          {/* Trigger que no navega, solo despliega */}
                          <button
                            type="button"
                            onClick={() => toggleDropdown("envios")}
                            onMouseEnter={() => setOpenDropdown("envios")}
                            className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide"
                          >
                            <Truck size={16} />
                            <span>ENVÍOS</span>
                            <ChevronDown size={14} className="ml-1" />
                          </button>

                          {openDropdown === "envios" && (
                            <div
                              className="absolute top-full left-0 mt-0 w-48 bg-black border border-white/10 shadow-xl z-50"
                              onMouseLeave={() => setOpenDropdown(null)}
                            >
                              <NavLink
                                to="/envio"
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                  `flex items-center space-x-2 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                                }
                              >
                                <Truck size={16} />
                                <span>Envíos</span>
                              </NavLink>
                              <NavLink
                                to="/envio/tarifas"
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                  `flex items-center space-x-2 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                                }
                              >
                                <DollarSign size={16} />
                                <span>Tarifas</span>
                              </NavLink>
                            </div>
                          )}
                        </li>

                        <li>
                          <NavLink
                            to="/empleado-panel"
                            className={({ isActive }) =>
                              `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                            }
                          >
                            <Users size={16} />
                            <span>PANEL</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/promocion"
                            className={({ isActive }) =>
                              `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                            }
                          >
                            <TicketPercent size={16} />
                            <span>PROM</span>
                          </NavLink>
                        </li>
                      </>
                    )}

                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-colors text-sm font-medium tracking-wide border border-transparent"
                      >
                        <LogOut size={16} />
                        <span>SALIR</span>
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* TOGGLE MÓVIL */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* (Quité el Admin Quickbar para que Dashboard/Docs no aparezcan arriba) */}

        {/* MENÚ MÓVIL */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-top border-white/10 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <ul className="space-y-1">
              {!isAuthenticated && (
                <>
                  <li>
                    <NavLink
                      to="/login"
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                      }
                    >
                      INICIAR SESIÓN
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/register"
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `block px-4 py-3 bg-white text-black hover:bg-white/90 transition-colors text-sm font-bold tracking-wide text-center ${isActive ? "bg-white/90" : ""}`
                      }
                    >
                      REGISTRARSE
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
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `flex items-center space-x-2 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                      }
                    >
                      <Home size={16} />
                      <span>INICIO</span>
                    </NavLink>
                  </li>
                  {isAdmin && (
                    <>
                      <li>
                        <div className="flex items-center">
                          <NavLink
                            to="/admin-panel"
                            onClick={handleNavClick}
                            className={({ isActive }) =>
                              `flex-1 flex items-center space-x-2 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                            }
                          >
                            <Settings size={16} />
                            <span>ADMIN</span>
                          </NavLink>
                          <button
                            type="button"
                            onClick={() => toggleDropdown("admin-mobile")}
                            className="px-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                            aria-expanded={openDropdown === "admin-mobile"}
                          >
                            <ChevronDown size={16} />
                          </button>
                        </div>

                        {openDropdown === "admin-mobile" && (
                          <ul className="ml-8 mt-1 mb-2 space-y-1">
                            <li>
                              <NavLink
                                to="/dashboard"
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                  `flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-blue-500/10 text-sm rounded ${isActive ? "text-white bg-blue-500/10" : ""}`
                                }
                              >
                                <BarChart3 size={16} />
                                <span>Dashboard</span>
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/documentation"
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                  `flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-purple-500/10 text-sm rounded ${isActive ? "text-white bg-purple-500/10" : ""}`
                                }
                              >
                                <BookOpen size={16} />
                                <span>Docs</span>
                              </NavLink>
                            </li>
                          </ul>
                        )}
                      </li>

                      <li>
                        <NavLink
                          to="/register-employee"
                          onClick={handleNavClick}
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                          }
                        >
                          <Users size={16} />
                          <span>EMPLEADOS</span>
                        </NavLink>
                      </li>
                    </>
                  )}

                  {Array.isArray(user?.rol) && (user.rol.includes("cliente") || isAdmin) && (
                    <li>
                      <NavLink
                        to="/user/profile"
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                          `flex items-center space-x-2 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                        }
                      >
                        <User size={16} />
                        <span>PERFIL</span>
                      </NavLink>
                    </li>
                  )}

                  {Array.isArray(user?.rol) &&
                    (user.rol.includes("cliente") || isAdmin || user.rol.includes("empleado")) && (
                      <>
                        <li>
                          <NavLink
                            to="/producto"
                            onClick={handleNavClick}
                            className={({ isActive }) =>
                              `flex items-center space-x-2 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                            }
                          >
                            <Package size={16} />
                            <span>PRODUCTOS</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/carrito"
                            onClick={handleNavClick}
                            className={({ isActive }) =>
                              `flex items-center space-x-2 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                            }
                          >
                            <ShoppingCart size={16} />
                            <span>CARRITO</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/wishlist"
                            onClick={handleNavClick}
                            className={({ isActive }) =>
                              `flex items-center space-x-2 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                            }
                          >
                            <Heart size={16} />
                            <span>WISHLIST</span>
                          </NavLink>
                        </li>
                      </>
                    )}

                  {Array.isArray(user?.rol) && (user.rol.includes("empleado") || isAdmin) && (
                    <>
                      <li>
                        <NavLink
                          to="/envio"
                          onClick={handleNavClick}
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                          }
                        >
                          <Truck size={16} />
                          <span>ENVÍOS</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/envio/tarifas"
                          onClick={handleNavClick}
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                          }
                        >
                          <DollarSign size={16} />
                          <span>TARIFAS</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/empleado-panel"
                          onClick={handleNavClick}
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                          }
                        >
                          <Users size={16} />
                          <span>PANEL</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/promocion"
                          onClick={handleNavClick}
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${isActive ? "text-white bg-white/5" : ""}`
                          }
                        >
                          <TicketPercent size={16} />
                          <span>PROMOCION</span>
                        </NavLink>
                      </li>
                    </>
                  )}

                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-3 text-white/80 hover:text-white hover:bg-red-500/10 transition-colors text-sm font-medium tracking-wide"
                    >
                      <LogOut size={16} />
                      <span>SALIR</span>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
