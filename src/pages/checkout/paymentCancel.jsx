import { Link } from "react-router-dom"
import { XCircle, ArrowLeft, ShoppingBag } from "lucide-react"

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        <div className="w-20 h-20 bg-red-500/20 border border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-400" />
        </div>

        <h1 className="text-5xl font-black text-white mb-4 tracking-tight">PAGO CANCELADO</h1>
        <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">
          La transacción no fue completada. Si fue un error, puedes intentarlo de nuevo desde tu carrito.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            to="/carrito"
            className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 font-bold hover:bg-white/90 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            VOLVER AL CARRITO
          </Link>
          <Link
            to="/producto"
            className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 font-bold hover:bg-white/20 transition-colors"
          >
            EXPLORAR PRODUCTOS
          </Link>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          VOLVER AL INICIO
        </Link>

        <div className="mt-12 p-4 bg-white/5 border border-white/10 rounded-lg">
          <p className="text-white/50 text-xs">
            Si el cargo fue iniciado en tu banco, verifica con soporte antes de volver a intentarlo.
          </p>
        </div>
      </div>
    </div>
  )
}
