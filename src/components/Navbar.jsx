"use client"

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
  BookOpen,
  TicketPercent,
  Menu,
  X,
} from "lucide-react"

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <div className="flex items-center space-x-3">
            <NavLink
              to="/"
              end
              className="text-2xl font-black text-white tracking-tighter hover:text-white/80 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              FITZONE
            </NavLink>
            <NavLink
              to="/shenron"
              className="flex items-center space-x-1 opacity-0 hover:opacity-100 transition-opacity duration-300 group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Flame size={14} className="text-orange-500 animate-pulse" />
              <span className="text-xs font-bold text-orange-500 tracking-wider">SHENRON</span>
              <Flame size={14} className="text-orange-500 animate-pulse" />
            </NavLink>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/5 rounded transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* MENÚ DESKTOP */}
          <ul className="hidden md:flex items-center space-x-1">
            {!isAuthenticated && (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                        isActive ? "text-white bg-white/5" : ""
                      }`
                    }
                  >
                    INICIAR SESIÓN
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `px-4 py-2 bg-white text-black hover:bg-white/90 transition-colors text-sm font-bold tracking-wide ${
                        isActive ? "bg-white/90" : ""
                      }`
                    }
                  >
                    REGISTRARSE
                  </NavLink>
                </li>
              </>
            )}

            {isAuthenticated && (
              <>
                {/* Inicio */}
                <li>
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                        isActive ? "text-white bg-white/5" : ""
                      }`
                    }
                  >
                    <Home size={16} />
                    <span>INICIO</span>
                  </NavLink>
                </li>

                {/* ADMIN con dropdown */}
                {Array.isArray(user?.rol) && user.rol.includes("admin") && (
                  <li
                    className="relative"
                    onMouseEnter={() => setOpenDropdown("admin")}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <NavLink
                      to="/admin-panel"
                      className={({ isActive }) =>
                        `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                          isActive ? "text-white bg-white/5" : ""
                        }`
                      }
                    >
                      <Settings size={16} />
                      <span>ADMIN</span>
                      <ChevronDown size={14} className="ml-1" />
                    </NavLink>

                    {/* Dropdown ADMIN */}
                    {openDropdown === "admin" && (
                      <div className="absolute top-full left-0 mt-0 w-48 bg-black border border-white/10 shadow-xl z-50">
                        <NavLink
                          to="/register-employee"
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                              isActive ? "text-white bg-white/5" : ""
                            }`
                          }
                        >
                          <Users size={16} />
                          <span>EMPLEADOS</span>
                        </NavLink>
                        <NavLink
                          to="/dashboard"
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-3 text-white/80 hover:text-white hover:bg-blue-500/10 transition-colors text-sm font-medium tracking-wide ${
                              isActive ? "text-white bg-blue-500/10" : ""
                            }`
                          }
                        >
                          <BarChart3 size={16} />
                          <span>DASHBOARD</span>
                        </NavLink>
                        <NavLink
                          to="/documentation"
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-3 text-white/80 hover:text-white hover:bg-purple-500/10 transition-colors text-sm font-medium tracking-wide ${
                              isActive ? "text-white bg-purple-500/10" : ""
                            }`
                          }
                        >
                          <BookOpen size={16} />
                          <span>DOCS</span>
                        </NavLink>
                      </div>
                    )}
                  </li>
                )}

                {/* PERFIL */}
                {Array.isArray(user?.rol) && (user.rol.includes("cliente") || user.rol.includes("admin")) && (
                  <li>
                    <NavLink
                      to="/user/profile"
                      className={({ isActive }) =>
                        `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                          isActive ? "text-white bg-white/5" : ""
                        }`
                      }
                    >
                      <User size={16} />
                      <span>PERFIL</span>
                    </NavLink>
                  </li>
                )}

                {/* PRODUCTOS / CARRITO */}
                {Array.isArray(user?.rol) &&
                  (user.rol.includes("cliente") || user.rol.includes("admin") || user.rol.includes("empleado")) && (
                    <>
                      <li>
                        <NavLink
                          to="/producto"
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                              isActive ? "text-white bg-white/5" : ""
                            }`
                          }
                        >
                          <Package size={16} />
                          <span>PRODUCTOS</span>
                        </NavLink>
                      </li>

                      <li
                        className="relative"
                        onMouseEnter={() => setOpenDropdown("carrito")}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        <NavLink
                          to="/carrito"
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                              isActive ? "text-white bg-white/5" : ""
                            }`
                          }
                        >
                          <ShoppingCart size={16} />
                          <span>CARRITO</span>
                          <ChevronDown size={14} className="ml-1" />
                        </NavLink>

                        {/* Dropdown CARRITO */}
                        {openDropdown === "carrito" && (
                          <div className="absolute top-full left-0 mt-0 w-48 bg-black border border-white/10 shadow-xl z-50">
                            <NavLink
                              to="/wishlist"
                              className={({ isActive }) =>
                                `flex items-center space-x-2 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                                  isActive ? "text-white bg-white/5" : ""
                                }`
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

                {/* ENVÍOS */}
                {Array.isArray(user?.rol) && (user.rol.includes("empleado") || user.rol.includes("admin")) && (
                  <>
                    <li
                      className="relative"
                      onMouseEnter={() => setOpenDropdown("envios")}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <NavLink
                        to="/envio"
                        className={({ isActive }) =>
                          `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                            isActive ? "text-white bg-white/5" : ""
                          }`
                        }
                      >
                        <Truck size={16} />
                        <span>ENVÍOS</span>
                        <ChevronDown size={14} className="ml-1" />
                      </NavLink>

                      {/* Dropdown ENVÍOS */}
                      {openDropdown === "envios" && (
                        <div className="absolute top-full left-0 mt-0 w-48 bg-black border border-white/10 shadow-xl z-50">
                          <NavLink
                            to="/envio/tarifas"
                            className={({ isActive }) =>
                              `flex items-center space-x-2 px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                                isActive ? "text-white bg-white/5" : ""
                              }`
                            }
                          >
                            <DollarSign size={16} />
                            <span>TARIFAS</span>
                          </NavLink>
                        </div>
                      )}
                    </li>

                    <li>
                      <NavLink
                        to="/empleado-panel"
                        className={({ isActive }) =>
                          `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                            isActive ? "text-white bg-white/5" : ""
                          }`
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
                          `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                            isActive ? "text-white bg-white/5" : ""
                          }`
                        }
                      >
                        <TicketPercent size={16} />
                        <span>PROM</span>
                      </NavLink>
                    </li>
                  </>
                )}

                {/* SALIR */}
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

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <ul className="space-y-2">
              {!isAuthenticated && (
                <>
                  <li>
                    <NavLink
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                          isActive ? "text-white bg-white/5" : ""
                        }`
                      }
                    >
                      INICIAR SESIÓN
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2 bg-white text-black hover:bg-white/90 transition-colors text-sm font-bold tracking-wide ${
                          isActive ? "bg-white/90" : ""
                        }`
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
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                          isActive ? "text-white bg-white/5" : ""
                        }`
                      }
                    >
                      <Home size={16} />
                      <span>INICIO</span>
                    </NavLink>
                  </li>

                  {Array.isArray(user?.rol) && user.rol.includes("admin") && (
                    <>
                      <li>
                        <NavLink
                          to="/admin-panel"
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                              isActive ? "text-white bg-white/5" : ""
                            }`
                          }
                        >
                          <Settings size={16} />
                          <span>ADMIN</span>
                        </NavLink>
                      </li>
                      <li className="pl-8">
                        <NavLink
                          to="/register-employee"
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                              isActive ? "text-white bg-white/5" : ""
                            }`
                          }
                        >
                          <Users size={16} />
                          <span>EMPLEADOS</span>
                        </NavLink>
                      </li>
                      <li className="pl-8">
                        <NavLink
                          to="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-blue-500/10 transition-colors text-sm font-medium tracking-wide ${
                              isActive ? "text-white bg-blue-500/10" : ""
                            }`
                          }
                        >
                          <BarChart3 size={16} />
                          <span>DASHBOARD</span>
                        </NavLink>
                      </li>
                      <li className="pl-8">
                        <NavLink
                          to="/documentation"
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-purple-500/10 transition-colors text-sm font-medium tracking-wide ${
                              isActive ? "text-white bg-purple-500/10" : ""
                            }`
                          }
                        >
                          <BookOpen size={16} />
                          <span>DOCS</span>
                        </NavLink>
                      </li>
                    </>
                  )}

                  {Array.isArray(user?.rol) && (user.rol.includes("cliente") || user.rol.includes("admin")) && (
                    <li>
                      <NavLink
                        to="/user/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                            isActive ? "text-white bg-white/5" : ""
                          }`
                        }
                      >
                        <User size={16} />
                        <span>PERFIL</span>
                      </NavLink>
                    </li>
                  )}

                  {Array.isArray(user?.rol) &&
                    (user.rol.includes("cliente") || user.rol.includes("admin") || user.rol.includes("empleado")) && (
                      <>
                        <li>
                          <NavLink
                            to="/producto"
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                                isActive ? "text-white bg-white/5" : ""
                              }`
                            }
                          >
                            <Package size={16} />
                            <span>PRODUCTOS</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/carrito"
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                                isActive ? "text-white bg-white/5" : ""
                              }`
                            }
                          >
                            <ShoppingCart size={16} />
                            <span>CARRITO</span>
                          </NavLink>
                        </li>
                        <li className="pl-8">
                          <NavLink
                            to="/wishlist"
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                                isActive ? "text-white bg-white/5" : ""
                              }`
                            }
                          >
                            <Heart size={16} />
                            <span>WISHLIST</span>
                          </NavLink>
                        </li>
                      </>
                    )}

                  {Array.isArray(user?.rol) && (user.rol.includes("empleado") || user.rol.includes("admin")) && (
                    <>
                      <li>
                        <NavLink
                          to="/envio"
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                              isActive ? "text-white bg-white/5" : ""
                            }`
                          }
                        >
                          <Truck size={16} />
                          <span>ENVÍOS</span>
                        </NavLink>
                      </li>
                      <li className="pl-8">
                        <NavLink
                          to="/envio/tarifas"
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                              isActive ? "text-white bg-white/5" : ""
                            }`
                          }
                        >
                          <DollarSign size={16} />
                          <span>TARIFAS</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/empleado-panel"
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                              isActive ? "text-white bg-white/5" : ""
                            }`
                          }
                        >
                          <Users size={16} />
                          <span>PANEL</span>
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/promocion"
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide ${
                              isActive ? "text-white bg-white/5" : ""
                            }`
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
                      className="flex items-center space-x-2 w-full px-4 py-2 text-white/80 hover:text-white hover:bg-red-500/10 transition-colors text-sm font-medium tracking-wide"
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
