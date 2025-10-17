"use client"

import { useNavigate, useLocation } from "react-router-dom"
import { Home, Package, Edit, FolderTree, Tag, Ruler, Palette, ChevronRight } from "lucide-react"

export default function SidebarEmpleado() {
  const navigate = useNavigate()
  const location = useLocation()

  const links = [
    {
      path: "/empleado-panel",
      label: "Inicio",
      icon: Home,
    },
    {
      path: "/crear/producto",
      label: "Crear Producto",
      icon: Package,
    },
    {
      path: "/actualizar/producto",
      label: "Actualizar Productos",
      icon: Edit,
    },
    {
      path: "/crear/categoria",
      label: "Gestionar Categorías",
      icon: FolderTree,
    },
    {
      path: "/crear/marca",
      label: "Gestionar Marcas",
      icon: Tag,
    },
    {
      path: "/crear/talla",
      label: "Gestionar Tallas",
      icon: Ruler,
    },
    {
      path: "/crear/color",
      label: "Gestionar Colores",
      icon: Palette,
    },
    {
      path: "/crear/color/producto",
      label: "Color Producto",
      icon: Palette,
    },
    {
      path: "/crear/talla/producto",
      label: "Talla Producto",
      icon: Ruler,
    },
  ]

  return (
    <aside className="w-full md:w-80 bg-black text-white p-8 border-r-2 border-white/10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">EMPLEADO PANEL</h2>
        <div className="h-1 w-16 bg-white"></div>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = link.path === location.pathname

          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`
                w-full flex items-center justify-between gap-3 p-4 text-left uppercase text-sm font-bold tracking-wide
                transition-all duration-200
                ${isActive ? "bg-white text-black" : "hover:bg-white/10 hover:translate-x-1"}
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </div>
              {!isActive && <ChevronRight className="w-4 h-4" />}
            </button>
          )
        })}
      </nav>

      <div className="mt-12 pt-8 border-t border-white/10">
        <p className="text-xs uppercase tracking-wider text-gray-400">FITZONE ADMIN</p>
      </div>
    </aside>
  )
}
