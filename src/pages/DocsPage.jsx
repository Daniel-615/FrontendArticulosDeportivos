import { BookOpen, ExternalLink } from "lucide-react"

const docsLinks = [
  { name: "Auth Service", url: "https://auth-service-ebak.onrender.com/docs", color: "from-blue-500/70 to-indigo-600/60" },
  { name: "Wishlist Service", url: "https://wishlist-service-sctc.onrender.com/docs", color: "from-pink-500/70 to-rose-600/60" },
  { name: "Producto Service", url: "https://producto-service.onrender.com/docs", color: "from-emerald-500/70 to-green-600/60" },
  { name: "Envíos Service", url: "https://envios-service.onrender.com/docs", color: "from-yellow-400/70 to-orange-500/60" },
  { name: "Payment Service", url: "https://payment-service-main.onrender.com/docs", color: "from-cyan-500/70 to-sky-600/60" },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-4xl w-full text-center mb-12">
        <div className="flex justify-center items-center gap-3 mb-6">
          <BookOpen className="w-10 h-10 text-white" />
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Documentación de Servicios
          </h1>
        </div>
        <p className="text-white/60 text-sm sm:text-base tracking-wide uppercase">
          Accede a los endpoints y especificaciones de cada microservicio
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {docsLinks.map((service) => (
          <div
            key={service.name}
            className={`group relative bg-gradient-to-br ${service.color} p-[2px] rounded-2xl transition-transform hover:scale-105`}
          >
            <div className="bg-black rounded-2xl h-full w-full p-6 flex flex-col items-center justify-center text-center">
              <h2 className="text-xl font-bold text-white mb-3 tracking-tight">{service.name}</h2>
              <p className="text-white/60 text-sm mb-5">Ver especificaciones Swagger UI</p>
              <button
                onClick={() => window.open(service.url, "_blank")}
                className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg border border-white/20 text-white font-semibold text-sm bg-white/10 hover:bg-white/20 transition-all"
              >
                Abrir documentación
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-16 text-white/40 text-xs text-center">
        <p>© {new Date().getFullYear()} Microservicios Fitzone — Plataforma Distribuida</p>
      </footer>
    </div>
  )
}
