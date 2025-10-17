"use client"

import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { CheckCircle, Copy, Package, ArrowRight } from "lucide-react"

export default function PaymentSuccess() {
  const params = useMemo(() => new URLSearchParams(window.location.search), [])

  const sessionId = params.get("session_id")
  const paymentIntent = params.get("payment_intent")
  const orderCode = params.get("order")
  const amount = params.get("amount")
  const currency = (params.get("currency") || "USD").toUpperCase()
  const email = params.get("customer_email")

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      const hasCleared = sessionStorage.getItem("__cart_cleared_after_success__")
      if (!hasCleared) {
        sessionStorage.setItem("__cart_cleared_after_success__", "1")
      }
    } catch (_) {}
  }, [])

  const displayAmount = useMemo(() => {
    if (!amount) return null
    const cents = Number(amount)
    if (Number.isNaN(cents)) return null
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
      }).format(cents / 100)
    } catch {
      return `${(cents / 100).toFixed(2)} ${currency}`
    }
  }, [amount, currency])

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch (_) {}
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">¡PAGO COMPLETADO!</h1>
          <p className="text-white/60 text-lg">
            Gracias por tu compra{email ? `, ${email}` : ""}. Tu pedido ha sido confirmado.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 mb-8">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-white" />
              <div>
                <h2 className="text-white font-bold text-lg">RECIBO DE PAGO</h2>
                <p className="text-white/60 text-sm">Tu compra fue procesada de forma segura</p>
              </div>
            </div>
            {displayAmount && (
              <div className="text-right">
                <p className="text-white/60 text-xs uppercase tracking-wider">Total</p>
                <p className="text-white font-black text-2xl">{displayAmount}</p>
              </div>
            )}
          </div>

          <div className="space-y-4 mb-6">
            {orderCode && (
              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider">Número de pedido</p>
                  <p className="text-white font-bold">#{orderCode}</p>
                </div>
                <button
                  onClick={() => handleCopy(orderCode)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            )}

            {sessionId && (
              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider">Session ID</p>
                  <p className="text-white font-mono text-sm truncate max-w-xs">{sessionId}</p>
                </div>
                <button
                  onClick={() => handleCopy(sessionId)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30">
              <div className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/70 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </div>
              <span className="text-green-300 font-medium text-sm">PAGO COMPLETADO</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 font-bold hover:bg-white/90 transition-colors"
            >
              SEGUIR COMPRANDO
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/orders"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 font-bold hover:bg-white/20 transition-colors"
            >
              VER MIS PEDIDOS
            </Link>
          </div>

          {copied && (
            <div className="mt-4 text-center">
              <span className="inline-block bg-white/10 border border-white/20 px-4 py-2 text-white/80 text-xs">
                ✓ Copiado al portapapeles
              </span>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-white/50 text-xs">
            ¿Necesitas ayuda? Contáctanos en{" "}
            <a href="mailto:soporte@fitzone.com" className="text-white/80 underline underline-offset-4">
              soporte@fitzone.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
