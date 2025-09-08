import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicWishlistByShareId } from "../api-gateway/wishlist.crud.js";
import { ShoppingBag } from "lucide-react";

function formatQ(value) {
  try {
    return new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" }).format(Number(value || 0));
  } catch {
    return `Q${Number(value || 0).toFixed(2)}`;
  }
}

export default function PublicWishlist() {
  const { shareId } = useParams();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { success, data, error, status } = await getPublicWishlistByShareId(shareId);
        if (!alive) return;

        if (!success) {
          const msg = error || (status === 410 ? "Enlace vencido." : "Enlace inválido.");
          setError(msg);
          setItems([]);
        } else {
          setItems(data?.data?.items || []);
          setError(null);
        }
      } catch (e) {
        if (!alive) return;
        setError("No se pudo cargar la wishlist.");
        setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="h-48 bg-white/10 rounded-xl mb-4" />
                <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
                <div className="h-4 w-1/3 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">No se puede mostrar la wishlist</h1>
          <p className="text-blue-100/80 mb-6">{error}</p>
          <Link to="/" className="inline-block px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition">
            Ir al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
            Wishlist compartida
          </h1>
          <p className="text-blue-100/80 mt-2">Vista pública de solo lectura.</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-28 h-28 mx-auto mb-6 rounded-2xl bg-white/10 border border-white/10 grid place-items-center">
              <ShoppingBag className="w-12 h-12 text-white/70" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">No hay productos en esta wishlist</h3>
            <p className="text-blue-100/70">Pídele a la persona que la comparta nuevamente si crees que es un error.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((it) => {
              const p = it.producto || {};
              return (
                <div
                  key={it.id}
                  className="rounded-2xl border border-white/10 bg-white/10 overflow-hidden backdrop-blur-xl"
                >
                  {/* Imagen */}
                  <div className="aspect-[4/3] bg-white/10">
                    {p.imagen ? (
                      <img
                        src={p.imagen}
                        alt={p.nombre || "Producto"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-white/60">
                        <ShoppingBag className="w-10 h-10" />
                      </div>
                    )}
                  </div>

                  {/* Nombre y precio */}
                  <div className="p-4">
                    <div className="text-white font-semibold line-clamp-2">
                      {p.nombre || "Producto"}
                    </div>
                    {"precio" in p && p.precio !== null && (
                      <div className="text-blue-100 mt-1">
                        {formatQ(p.precio)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
