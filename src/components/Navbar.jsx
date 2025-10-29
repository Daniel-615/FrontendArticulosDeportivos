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
} from "lucide-react"

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setMobileMenuOpen(false)
  }

  const handleNavClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-black border-b border-white/10">
      <div className="w-full px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <NavLink
              to="/"
              end
              className="text-xl sm:text-2xl font-black text-white tracking-tighter hover:text-white/80 transition-colors"
            >
              FITZONE
            </NavLink>
            <NavLink
              to="/shenron"
              className="hidden sm:flex items-center space-x-1 opacity-0 hover:opacity-100 transition-opacity duration-300 group"
            >
              <Flame size={14} className="text-orange-500 animate-pulse" />
              <span className="text-xs font-bold text-orange-500 tracking-wider">SHENRON</span>
              <Flame size={14} className="text-orange-500 animate-pulse" />
            </NavLink>
          </div>

          {isAuthenticated ? (
            <div className="relative flex-1 ml-4">
              {/* Left fade indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />

              {/* Scrollable menu container */}
              <ul className="flex items-center space-x-0.5 overflow-x-auto scrollbar-hide scroll-smooth px-8">
                <li className="flex-shrink-0">
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      `flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap ${
                        isActive ? "text-white bg-white/5" : ""
                      }`
                    }
                  >
                    <Home size={14} />
                    <span>INICIO</span>
                  </NavLink>
                </li>

                {Array.isArray(user?.rol) && user.rol.includes("admin") && (
                  <>
                    <li className="flex-shrink-0">
                      <NavLink
                        to="/admin-panel"
                        className={({ isActive }) =>
                          `flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap ${
                            isActive ? "text-white bg-white/5" : ""
                          }`
                        }
                      >
                        <Settings size={14} />
                        <span>ADMIN</span>
                      </NavLink>
                    </li>
                    <li className="flex-shrink-0">
                      <NavLink
                        to="/register-employee"
                        className={({ isActive }) =>
                          `flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap ${
                            isActive ? "text-white bg-white/5" : ""
                          }`
                        }
                      >
                        <Users size={14} />
                        <span>EMPLEADOS</span>
                      </NavLink>
                    </li>
                  </>
                )}

                {Array.isArray(user?.rol) && (user.rol.includes("cliente") || user.rol.includes("admin")) && (
                  <li className="flex-shrink-0">
                    <NavLink
                      to="/user/profile"
                      className={({ isActive }) =>
                        `flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap ${
                          isActive ? "text-white bg-white/5" : ""
                        }`
                      }
                    >
                      <User size={14} />
                      <span>PERFIL</span>
                    </NavLink>
                  </li>
                )}

                {Array.isArray(user?.rol) &&
                  (user.rol.includes("cliente") || user.rol.includes("admin") || user.rol.includes("empleado")) && (
                    <>
                      <li className="flex-shrink-0">
                        <NavLink
                          to="/producto"
                          className={({ isActive }) =>
                            `flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap ${
                              isActive ? "text-white bg-white/5" : ""
                            }`
                          }
                        >
                          <Package size={14} />
                          <span>PRODUCTOS</span>
                        </NavLink>
                      </li>

                      <li
                        className="relative flex-shrink-0"
                        onMouseEnter={() => setOpenDropdown("carrito")}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        <NavLink
                          to="/carrito"
                          className={({ isActive }) =>
                            `flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap ${
                              isActive ? "text-white bg-white/5" : ""
                            }`
                          }
                        >
                          <ShoppingCart size={14} />
                          <span>CARRITO</span>
                          <ChevronDown size={12} className="ml-0.5" />
                        </NavLink>

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

                {Array.isArray(user?.rol) && (user.rol.includes("empleado") || user.rol.includes("admin")) && (
                  <>
                    <li
                      className="relative flex-shrink-0"
                      onMouseEnter={() => setOpenDropdown("envios")}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <NavLink
                        to="/envio"
                        className={({ isActive }) =>
                          `flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap ${
                            isActive ? "text-white bg-white/5" : ""
                          }`
                        }
                      >
                        <Truck size={14} />
                        <span>ENVÍOS</span>
                        <ChevronDown size={12} className="ml-0.5" />
                      </NavLink>

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

                    <li className="flex-shrink-0">
                      <NavLink
                        to="/empleado-panel"
                        className={({ isActive }) =>
                          `flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap ${
                            isActive ? "text-white bg-white/5" : ""
                          }`
                        }
                      >
                        <Users size={14} />
                        <span>PANEL</span>
                      </NavLink>
                    </li>
                  </>
                )}

                <li className="flex-shrink-0">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 text-white/80 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-colors text-xs sm:text-sm font-medium tracking-wide border border-transparent whitespace-nowrap"
                  >
                    <LogOut size={14} />
                    <span>SALIR</span>
                  </button>
                </li>
              </ul>

              {/* Right fade indicator */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
            </div>
          ) : (
            <div className="flex items-center space-x-2 flex-shrink-0 ml-auto">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-3 sm:px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap ${
                    isActive ? "text-white bg-white/5" : ""
                  }`
                }
              >
                INICIAR SESIÓN
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `px-3 sm:px-4 py-2 bg-white text-black hover:bg-white/90 transition-colors text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap ${
                    isActive ? "bg-white/90" : ""
                  }`
                }
              >
                REGISTRARSE
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
