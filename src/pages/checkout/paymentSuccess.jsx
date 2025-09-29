import React, { useEffect, useMemo, useState } from "react";

export default function PaymentSuccess() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);

  const sessionId = params.get("session_id");
  const paymentIntent = params.get("payment_intent");
  const orderCode = params.get("order");
  const amount = params.get("amount"); // esperada en centavos
  const currency = (params.get("currency") || "USD").toUpperCase();
  const email = params.get("customer_email");
  const receiptUrl = params.get("receipt_url");

  const [copied, setCopied] = useState(false);

  // Si usas un carrito local, podrías vaciarlo aquí:
  useEffect(() => {
    try {
      const hasCleared = sessionStorage.getItem("__cart_cleared_after_success__");
      if (!hasCleared) {
        // localStorage.removeItem("cart"); // <- descomenta si aplica en tu app
        sessionStorage.setItem("__cart_cleared_after_success__", "1");
      }
    } catch (_) {}
  }, []);

  const displayAmount = useMemo(() => {
    if (!amount) return null;
    const cents = Number(amount);
    if (Number.isNaN(cents)) return null;
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
      }).format(cents / 100);
    } catch {
      return `${(cents / 100).toFixed(2)} ${currency}`;
    }
  }, [amount, currency]);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (_) {}
  };

  const Pill = ({ children }) => (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
      {children}
    </span>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-950 to-zinc-900 text-white">
      {/* Brillos decorativos */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <main className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-14">
        {/* Check animado */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/40">
          <svg
            className="h-8 w-8 text-emerald-400"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              className="opacity-0"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M7 12.5l3 3 7-7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="origin-center scale-0 animate-[pop_300ms_ease-out_forwards]"
            />
          </svg>
        </div>

        <h1 className="text-center text-3xl font-semibold tracking-tight">
          ¡Pago completado con éxito!
        </h1>
        <p className="mt-2 max-w-prose text-center text-white/70">
          Gracias por tu compra{email ? `, ${email}` : ""}. Hemos confirmado tu
          transacción{displayAmount ? ` por ${displayAmount}` : ""}
          {currency && !displayAmount ? ` en ${currency}` : ""}.
        </p>

        <section className="mt-8 w-full">
          <div className="rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-black/40">
            {/* Encabezado */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 ring-1 ring-white/15">
                  {/* Stripe-like icon */}
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M3 6.75A2.75 2.75 0 0 1 5.75 4h12.5A2.75 2.75 0 0 1 21 6.75v10.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25V6.75Zm6 .75h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1 0-1.5Zm0 3h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1 0-1.5Zm0 3h3.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1 0-1.5Z" />
                  </svg>
                </span>
                <div>
                  <h2 className="text-base font-medium leading-tight">Recibo de pago</h2>
                  <p className="text-xs text-white/60">Tu compra fue procesada de forma segura.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {orderCode && <Pill>Pedido: <strong className="ml-1 font-semibold text-white/90">#{orderCode}</strong></Pill>}
                {displayAmount && <Pill>Total: <strong className="ml-1 font-semibold text-white/90">{displayAmount}</strong></Pill>}
                {currency && !displayAmount && <Pill>Moneda: <strong className="ml-1 font-semibold text-white/90">{currency}</strong></Pill>}
              </div>
            </div>

            {/* Contenido */}
            <div className="grid gap-6 px-6 py-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/50">Identificadores</p>
                  <div className="mt-2 space-y-2">
                    {sessionId && (
                      <Row
                        label="Checkout Session"
                        value={sessionId}
                        onCopy={() => handleCopy(sessionId)}
                      />
                    )}
                    {paymentIntent && (
                      <Row
                        label="Payment Intent"
                        value={paymentIntent}
                        onCopy={() => handleCopy(paymentIntent)}
                      />
                    )}
                    {email && <Row label="Cliente" value={email} />}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-white/50">Estado</p>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300 ring-1 ring-emerald-400/30">
                    <span className="relative inline-flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    Completado
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/50">Resumen</p>
                  <ul className="mt-2 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
                    <li className="flex items-center justify-between bg-white/5 px-4 py-3 text-sm">
                      <span>Subtotal</span>
                      <span className="text-white/80">{displayAmount ?? "—"}</span>
                    </li>
                    <li className="flex items-center justify-between px-4 py-3 text-sm">
                      <span>Envío</span>
                      <span className="text-white/80">Incluido</span>
                    </li>
                    <li className="flex items-center justify-between bg-white/5 px-4 py-3 text-sm font-medium">
                      <span>Total</span>
                      <span className="text-white">{displayAmount ?? "—"}</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="/"
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-white/40 md:flex-none"
                  >
                    Seguir comprando
                  </a>
                  <a
                    href="/orders"
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40 md:flex-none"
                  >
                    Ver mis pedidos
                  </a>
                  <a
                    href={receiptUrl || "#"}
                    aria-disabled={!receiptUrl}
                    className={`inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition md:flex-none ${
                      receiptUrl
                        ? "bg-emerald-500 text-slate-900 hover:brightness-95"
                        : "cursor-not-allowed bg-white/10 text-white/60 ring-1 ring-white/15"
                    }`}
                  >
                    {receiptUrl ? "Ver recibo" : "Recibo no disponible"}
                  </a>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-4 border-t border-white/10 px-6 py-4 text-xs text-white/50">
              <p>
                Si necesitas ayuda, contáctanos: <a className="text-white/80 underline underline-offset-4" href="mailto:soporte@tu-tienda.com">soporte@tu-tienda.com</a>
              </p>
              {copied && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-white/80 ring-1 ring-white/15">
                  Copiado ✓
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Nota */}
        <p className="mt-6 text-center text-xs text-white/50">
          Consejo: Asegúrate de validar server-side la <em>Checkout Session</em> y el <em>Payment Intent</em> antes de marcar el pedido como pagado.
        </p>
      </main>

      <style>{`
        @keyframes pop { from { transform: scale(0); opacity: 0.4 } to { transform: scale(1); opacity: 1 } }
      `}</style>
    </div>
  );
}

function Row({ label, value, onCopy }) {
  return (
    <div className="group flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      <div>
        <p className="text-xs text-white/60">{label}</p>
        <p className="truncate text-sm font-medium text-white/90" title={value || "—"}>
          {value || "—"}
        </p>
      </div>
      {value ? (
        <button
          type="button"
          onClick={onCopy}
          className="invisible ml-auto inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[11px] text-white/80 ring-1 ring-white/15 transition hover:bg-white/15 group-hover:visible"
        >
          Copiar
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
            <path d="M16 1.998h-6A3 3 0 0 0 7 4.998v1.004H6A3 3 0 0 0 3 9.002v9a3 3 0 0 0 3 3h6a3 3 0 0 0 3-2.999v-1.004h1a3 3 0 0 0 3-2.999v-9a3 3 0 0 0-3-3h-1v-1.004a3 3 0 0 0-3-2.998Zm-7 4.004V4.998a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1.004h-1-6-1Zm8 2.002h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-1-6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h6Z" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}