"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { ShoppingCart, Heart, User, LogOut, Home, Package, Users, Settings, Flame } from "lucide-react"

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="text-2xl font-black text-white tracking-tighter hover:text-white/80 transition-colors"
            >
              FITZONE
            </Link>
            <Link
              to="/shenron"
              className="flex items-center space-x-1 opacity-0 hover:opacity-100 transition-opacity duration-300 group"
            >
              <Flame size={14} className="text-orange-500 animate-pulse" />
              <span className="text-xs font-bold text-orange-500 tracking-wider">SHENRON</span>
              <Flame size={14} className="text-orange-500 animate-pulse" />
            </Link>
          </div>

          <ul className="flex items-center space-x-1">
            {isAuthenticated && (
              <>
                <li>
                  <Link
                    to="/"
                    className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide"
                  >
                    <Home size={16} />
                    <span>INICIO</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/producto"
                    className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide"
                  >
                    <Package size={16} />
                    <span>PRODUCTOS</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/carrito"
                    className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide"
                  >
                    <ShoppingCart size={16} />
                    <span>CARRITO</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/wishlist"
                    className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide"
                  >
                    <Heart size={16} />
                    <span>WISHLIST</span>
                  </Link>
                </li>
              </>
            )}

            {!isAuthenticated && (
              <>
                <li>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide"
                  >
                    INICIAR SESIÓN
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-white text-black hover:bg-white/90 transition-colors text-sm font-bold tracking-wide"
                  >
                    REGISTRARSE
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated && user?.rol?.includes("admin") && (
              <>
                <li>
                  <Link
                    to="/admin-panel"
                    className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide"
                  >
                    <Settings size={16} />
                    <span>ADMIN</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register-employee"
                    className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide"
                  >
                    <Users size={16} />
                    <span>EMPLEADOS</span>
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated && (user?.rol?.includes("admin") || user?.rol?.includes("empleado")) && (
              <li>
                <Link
                  to="/empleado-panel"
                  className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide"
                >
                  <Users size={16} />
                  <span>PANEL</span>
                </Link>
              </li>
            )}

            {isAuthenticated && (user?.rol?.includes("cliente") || user?.rol?.includes("admin")) && (
              <li>
                <Link
                  to="/user/profile"
                  className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium tracking-wide"
                >
                  <User size={16} />
                  <span>PERFIL</span>
                </Link>
              </li>
            )}

            {isAuthenticated && (
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-colors text-sm font-medium tracking-wide border border-transparent"
                >
                  <LogOut size={16} />
                  <span>SALIR</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
