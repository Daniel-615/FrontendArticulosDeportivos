"use client"

import { Link } from "react-router-dom"
import { ShieldAlert, ArrowLeft, Home } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <div className="w-24 h-24 bg-red-500/20 border border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShieldAlert className="w-12 h-12 text-red-400" />
        </div>

        <h1 className="text-6xl font-black text-white mb-4 tracking-tight">ACCESO DENEGADO</h1>
        <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">
          No tienes los permisos necesarios para acceder a esta página. Si crees que esto es un error, contacta al
          administrador.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 font-bold hover:bg-white/90 transition-colors"
          >
            <Home className="w-5 h-5" />
            IR AL INICIO
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 font-bold hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            VOLVER ATRÁS
          </button>
        </div>

        <div className="p-4 bg-white/5 border border-white/10 inline-block">
          <p className="text-white/50 text-xs">
            Código de error: <span className="text-white/80 font-mono">403 - FORBIDDEN</span>
          </p>
        </div>
      </div>
    </div>
  )
}
