"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import { LoginGoogleRequest } from "../../../api-gateway/auth.js"
import { useNavigate, Link } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import { useAuth } from "../../../context/AuthContext.jsx"

function RegisterPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const { signup } = useAuth()
  const [serverMessage, setServerMessage] = useState(null)
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()

  const onSubmit = async (values) => {
    setServerMessage(null)
    setSuccess(null)

    const response = await signup(values)

    if (response.success && response.data) {
      const user = {
        id: response.data.id || "",
        nombre: response.data.nombre || "",
        apellido: response.data.apellido || "",
        rol: response.data.rolAsignado === 1 ? "empleado" : "cliente",
      }
      localStorage.setItem("user", JSON.stringify(user))
      setSuccess("¡Registro exitoso!")
      reset()

      setTimeout(() => {
        navigate("/")
      }, 1000)
    } else {
      setServerMessage(response.message || response.error || "Ocurrió un error.")
    }
  }

  const handleGoogleLogin = () => {
    LoginGoogleRequest()
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-white mb-2 tracking-tight">FITZONE</h1>
          <p className="text-white/60 text-sm tracking-wider uppercase">Crea tu cuenta</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-8 border border-white/20">
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
                type="text"
                {...register("nombre", { required: true })}
                className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/40"
                placeholder="NOMBRE"
              />
              {errors.nombre && <p className="text-red-400 text-xs mt-1 ml-1">Nombre es requerido</p>}
            </div>

            <div>
              <input
                type="text"
                {...register("apellido", { required: true })}
                className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/40"
                placeholder="APELLIDO"
              />
              {errors.apellido && <p className="text-red-400 text-xs mt-1 ml-1">Apellido es requerido</p>}
            </div>

            <div>
              <input
                type="email"
                {...register("email", { required: true })}
                className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/40"
                placeholder="CORREO ELECTRÓNICO"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">Correo es requerido</p>}
            </div>

            <div>
              <input
                type="password"
                {...register("password", { required: true })}
                className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/40"
                placeholder="CONTRASEÑA"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">Contraseña es requerida</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black px-4 py-3 font-bold hover:bg-white/90 transition-colors tracking-wide"
            >
              REGISTRARSE
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <FcGoogle className="text-xl" />
              Continuar con Google
            </button>

            <div className="text-white/60 text-sm text-center pt-4 space-y-2">
              <p>
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="text-white hover:underline font-medium">
                  Inicia sesión
                </Link>
              </p>
              <p>
                <Link to="/forgot-password" className="text-white/60 hover:text-white transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
