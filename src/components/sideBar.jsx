import { useNavigate, useLocation } from "react-router-dom";

export default function SidebarEmpleado() {
  const navigate = useNavigate();
  const location = useLocation(); 

  const links = [
    { 
      path: "/crear/producto", 
      label: "Crear Producto" 
    },
    { 
      path: "/actualizar/producto", 
      label: "Actualizar Productos" 
    },
    { 
      path: "/crear/categoria", 
      label: "Gestionar Categorías" 
    },
    { 
      path: "/crear/marca", 
      label: "Gestionar Marcas" 
    },
    { 
      path: "/crear/talla", 
      label: "Gestionar Tallas"
    },
    {
      path: "/crear/color", 
      label: "Gestionar Colores"
    },
    { 
      path: "/crear/color/producto",
      label: "Gestionar Color Producto"
    },
    {
      path: "/crear/tala/producto",
      label: "Gestionar Talla Producto"
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-gray-800 text-white p-6">
      <h2 className="text-xl font-bold mb-6">
        <a href="/empleado-panel">Empleado Panel</a>
      </h2>
      <nav className="space-y-4">
        {links
          .filter(link => link.path !== location.pathname) 
          .map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="w-full text-left hover:text-blue-400"
            >
              {link.label}
            </button>
          ))}
      </nav>
    </aside>
  );
}
