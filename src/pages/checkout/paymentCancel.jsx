
import React from "react";
import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-950 to-zinc-900 text-white">
      {/* Fondos decorativos */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      <main className="relative mx-auto flex max-w-lg flex-col items-center px-6 py-16 text-center">
        {/* Icono cancelación */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-400/40">
          <svg
            className="h-8 w-8 text-red-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">
          Pago cancelado
        </h1>
        <p className="mt-2 max-w-prose text-white/70">
          La transacción no fue completada. Si fue un error, puedes intentarlo de nuevo.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/carrito"
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-white/40 md:flex-none"
          >
            Volver al carrito
          </Link>
          <Link
            to="/producto"
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40 md:flex-none"
          >
            Explorar productos
          </Link>
        </div>

        {/* Nota */}
        <p className="mt-6 text-xs text-white/50">
          Consejo: Si el cargo fue iniciado en tu banco, verifica con soporte antes de volver a intentarlo.
        </p>
      </main>
    </div>
  );
}
