"use client"

import { motion } from "framer-motion"
import SidebarEmpleado from "../components/sideBar.jsx"
import { useNavigate } from "react-router-dom"
import { Package, Edit, FolderTree, Tag } from "lucide-react"

export default function InicioEmpleado() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <SidebarEmpleado />

      <main className="flex-1 p-8 md:p-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tight mb-4 text-black">
              PANEL DE EMPLEADOS
            </h1>
            <div className="h-1 w-32 bg-black mb-6"></div>
            <p className="text-lg text-gray-600 uppercase tracking-wide">
              ADMINISTRA PRODUCTOS, CATEGORÍAS Y MARCAS DE TU TIENDA
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <button
              onClick={() => navigate("/crear/producto")}
              className="group relative overflow-hidden bg-black text-white p-8 hover:bg-gray-900 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-3">
                <Package className="w-8 h-8" />
                <h3 className="text-xl font-bold uppercase tracking-wide">CREAR PRODUCTO</h3>
              </div>
              <p className="text-sm text-gray-300 uppercase tracking-wide">Añade nuevos productos al catálogo</p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-white group-hover:w-full transition-all duration-300"></div>
            </button>

            <button
              onClick={() => navigate("/actualizar/producto")}
              className="group relative overflow-hidden bg-white text-black border-2 border-black p-8 hover:bg-black hover:text-white transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-3">
                <Edit className="w-8 h-8" />
                <h3 className="text-xl font-bold uppercase tracking-wide">EDITAR PRODUCTOS</h3>
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-300 uppercase tracking-wide">
                Modifica o elimina productos existentes
              </p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-black group-hover:bg-white group-hover:w-full transition-all duration-300"></div>
            </button>

            <button
              onClick={() => navigate("/crear/categoria")}
              className="group relative overflow-hidden bg-white text-black border-2 border-black p-8 hover:bg-black hover:text-white transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-3">
                <FolderTree className="w-8 h-8" />
                <h3 className="text-xl font-bold uppercase tracking-wide">CATEGORÍAS</h3>
              </div>
              <p className="text-sm text-gray-600 group-hover:text-gray-300 uppercase tracking-wide">
                Gestiona las categorías de productos
              </p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-black group-hover:bg-white group-hover:w-full transition-all duration-300"></div>
            </button>

            <button
              onClick={() => navigate("/crear/marca")}
              className="group relative overflow-hidden bg-black text-white p-8 hover:bg-gray-900 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-3">
                <Tag className="w-8 h-8" />
                <h3 className="text-xl font-bold uppercase tracking-wide">MARCAS</h3>
              </div>
              <p className="text-sm text-gray-300 uppercase tracking-wide">Administra las marcas disponibles</p>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-white group-hover:w-full transition-all duration-300"></div>
            </button>
          </motion.div>

          <motion.div
            className="mt-12 p-8 bg-black text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">ACCESO RÁPIDO</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <button
                onClick={() => navigate("/crear/talla")}
                className="p-4 bg-white/10 hover:bg-white/20 transition-colors"
              >
                <p className="text-sm uppercase font-bold">TALLAS</p>
              </button>
              <button
                onClick={() => navigate("/crear/color")}
                className="p-4 bg-white/10 hover:bg-white/20 transition-colors"
              >
                <p className="text-sm uppercase font-bold">COLORES</p>
              </button>
              <button
                onClick={() => navigate("/crear/color/producto")}
                className="p-4 bg-white/10 hover:bg-white/20 transition-colors"
              >
                <p className="text-sm uppercase font-bold">COLOR PRODUCTO</p>
              </button>
              <button
                onClick={() => navigate("/crear/talla/producto")}
                className="p-4 bg-white/10 hover:bg-white/20 transition-colors"
              >
                <p className="text-sm uppercase font-bold">TALLA PRODUCTO</p>
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
