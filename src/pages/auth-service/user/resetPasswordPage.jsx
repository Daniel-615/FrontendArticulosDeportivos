"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { resetPassword } from "../../../api-gateway/auth.js"
import { ArrowLeft, Lock, CheckCircle } from "lucide-react"

function ResetPasswordPage() {
  const { register, handleSubmit, reset, watch } = useForm()
  const [serverMessage, setServerMessage] = useState(null)
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const newPassword = watch("newPassword")

  const onSubmit = async (values) => {
    if (!token) {
      setServerMessage("Token no encontrado.")
      return
    }

    if (values.newPassword !== values.confirmPassword) {
      setServerMessage("Las contraseñas no coinciden.")
      return
    }

    const response = await resetPassword({ token, newPassword: values.newPassword })

    if (response.success) {
      setSuccess("Contraseña cambiada correctamente. Redirigiendo al login...")
      setServerMessage(null)
      reset()
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } else {
      setServerMessage(response.error || "Error al cambiar la contraseña.")
      setSuccess(null)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">VOLVER AL LOGIN</span>
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">NUEVA CONTRASEÑA</h1>
          <p className="text-white/60 text-sm">Ingresa tu nueva contraseña para restablecer tu cuenta</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-8 border border-white/20">
          {serverMessage && (
            <div className="bg-red-500/20 border border-red-500/50 p-3 text-white mb-4 text-center text-sm">
              {serverMessage}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/50 p-3 text-white mb-4 text-center text-sm flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                type="password"
                {...register("newPassword", { required: true, minLength: 6 })}
                className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/40"
                placeholder="NUEVA CONTRASEÑA"
              />
            </div>

            <div>
              <input
                type="password"
                {...register("confirmPassword", { required: true })}
                className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/40"
                placeholder="CONFIRMAR CONTRASEÑA"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black px-4 py-3 font-bold hover:bg-white/90 transition-colors tracking-wide"
            >
              CAMBIAR CONTRASEÑA
            </button>

            <p className="text-white/60 text-xs text-center pt-2">La contraseña debe tener al menos 6 caracteres</p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
