"use client"

import { useAuth } from "../../../context/AuthContext.jsx"
import { useEffect, useState } from "react"
import { getProductos } from "../../../api-gateway/producto.crud.js"
import { getCategorias } from "../../../api-gateway/categoria.crud.js"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Truck, Shield, Zap, Heart } from "lucide-react"
import { LoadingScreen } from "../../../components/LoadingScreen"

function HomePage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosRes, categoriasRes] = await Promise.all([getProductos(), getCategorias()])

        if (productosRes.success) {
          setProductos(productosRes.data.slice(0, 4))
        }

        if (categoriasRes.success) {
          setCategorias(categoriasRes.data.slice(0, 4))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <LoadingScreen message="CARGANDO" />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Adidas-inspired bold hero */}
      <section className="relative h-[600px] bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
        <img
          src="supreme.jpeg"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 container mx-auto px-6 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            {user && (
              <p className="text-white/90 text-sm font-medium mb-2 tracking-wider uppercase">
                Bienvenido, {user.nombre}
              </p>
            )}
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
              TU ENERGÍA
              <br />
              COMIENZA AQUÍ
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Descubre la colección más innovadora de artículos deportivos diseñados para llevar tu rendimiento al
              siguiente nivel.
            </p>
            <button
              onClick={() => navigate("/producto")}
              className="group bg-white text-black px-8 py-4 font-bold text-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              EXPLORAR PRODUCTOS
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-black mb-2">PRODUCTOS DESTACADOS</h2>
              <p className="text-gray-600 text-lg">Lo mejor de nuestra colección</p>
            </div>
            <button
              onClick={() => navigate("/wishlist")}
              className="hidden md:flex items-center gap-2 text-black font-bold hover:gap-4 transition-all"
            >
              VER TODO
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {loadingData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {productos.map((producto, index) => (
                <motion.div
                  key={producto.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate("/productos")}
                  className="group cursor-pointer"
                >
                  <div className="relative bg-gray-50 mb-4 overflow-hidden aspect-square">
                    <img
                      src={producto.imagen || `/placeholder.svg?height=400&width=400&query=${producto.nombre}`}
                      alt={producto.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button className="absolute top-4 right-4 bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-black">{producto.nombre}</h3>
                  <p className="text-gray-600 text-sm mb-2">{producto.descripcion?.substring(0, 50)}...</p>
                  <p className="font-black text-xl text-black">${producto.precio}</p>
                </motion.div>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate("/producto")}
            className="md:hidden flex items-center gap-2 text-black font-bold mx-auto mt-8 hover:gap-4 transition-all"
          >
            VER TODO
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-12 text-center">COMPRA POR CATEGORÍA</h2>

          {loadingData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categorias.map((categoria, index) => (
                <motion.div
                  key={categoria.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate("/producto")}
                  className="group relative h-80 overflow-hidden cursor-pointer bg-black"
                >
                  <img
                    src={`/.jpg?height=400&width=400&query=${categoria.nombre} deportivo`}
                    alt={categoria.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-black text-white mb-2">{categoria.nombre}</h3>
                    <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      EXPLORAR
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-black">ENVÍO GRATIS</h3>
              <p className="text-gray-600">En compras mayores a $50</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-black">COMPRA SEGURA</h3>
              <p className="text-gray-600">Protección en cada transacción</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-black">ENTREGA RÁPIDA</h3>
              <p className="text-gray-600">Recibe en 24-48 horas</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-black">CALIDAD PREMIUM</h3>
              <p className="text-gray-600">Productos de primera calidad</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="relative h-96 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30 z-10"></div>
        <img
          src="Mechi.webp"
          alt="CTA Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 container mx-auto px-6 h-full flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">¿LISTO PARA EMPEZAR?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Únete a miles de atletas que confían en nosotros para alcanzar sus metas
            </p>
            <button
              onClick={() => navigate("/carrito")}
              className="bg-white text-black px-10 py-4 font-black text-lg hover:bg-gray-100 transition-colors"
            >
              COMPRAR AHORA
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
