"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import { LoginGoogleRequest } from "../../../api-gateway/auth.js"
import { useNavigate, Link } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import { useAuth } from "../../../context/AuthContext.jsx"

function LoginPage() {
  const { register, handleSubmit, reset } = useForm()
  const [serverMessage, setServerMessage] = useState(null)
  const { signin } = useAuth()
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()

  const onSubmit = async (values) => {
    const response = await signin(values)

    if (response.success) {
      localStorage.setItem("user", JSON.stringify(response.data.user))
      setServerMessage(null)
      reset()
      setTimeout(() => {
        navigate("/")
      }, 1000)
    } else {
      const message =
        typeof response.message === "string"
          ? response.message
          : typeof response.error === "string"
            ? response.error
            : "Error desconocido."
      setServerMessage(message)
      setSuccess(null)
    }
  }

  const handleGoogleLogin = () => {
    LoginGoogleRequest()
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="Gokuchiquito.avif"
          alt="Athletic sports"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute bottom-12 left-12 text-white">
          <h2 className="text-4xl font-black mb-2 tracking-tight">IMPOSSIBLE IS NOTHING</h2>
          <p className="text-white/80 text-lg tracking-wide">Tu rendimiento comienza aquí</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">FITZONE</h1>
            <p className="text-white/60 text-xs sm:text-sm tracking-wider uppercase">Inicia sesión</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 sm:p-8 border border-white/20">
            {serverMessage && (
              <div className="bg-red-500/20 border border-red-500/50 p-3 text-white mb-4 text-center text-sm">
                {serverMessage}
              </div>
            )}

            {success && (
              <div className="bg-green-500/20 border border-green-500/50 p-3 text-white mb-4 text-center text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/40"
                  placeholder="CORREO ELECTRÓNICO"
                />
              </div>

              <div>
                <input
                  type="password"
                  {...register("password", { required: true })}
                  className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/40"
                  placeholder="CONTRASEÑA"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black px-4 py-3 font-bold hover:bg-white/90 transition-colors tracking-wide"
              >
                INICIAR SESIÓN
              </button>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <FcGoogle className="text-xl" />
                Continuar con Google
              </button>

              <div className="text-center pt-4 space-y-2">
                <p className="text-white/60 text-xs sm:text-sm">
                  ¿No tienes una cuenta?{" "}
                  <Link to="/register" className="text-white hover:underline font-medium">
                    Regístrate
                  </Link>
                </p>
                <p className="text-white/60 text-xs sm:text-sm">
                  <Link to="/forgot-password" className="text-white/60 hover:text-white transition-colors">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
