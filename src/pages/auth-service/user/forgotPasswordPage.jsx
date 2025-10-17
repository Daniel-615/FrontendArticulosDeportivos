"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import { ForgotPassword } from "../../../api-gateway/auth.js"
import { Link } from "react-router-dom"
import { ArrowLeft, Mail } from "lucide-react"

function ForgotPasswordPage() {
  const { register, handleSubmit, reset } = useForm()
  const [serverMessage, setServerMessage] = useState(null)
  const [success, setSuccess] = useState(null)

  const onSubmit = async (values) => {
    const response = await ForgotPassword(values)
    if (response.success) {
      setSuccess("Revisa tu bandeja de correo. Te hemos enviado un enlace para restablecer tu contraseña.")
      setServerMessage(null)
      reset()
    } else {
      setServerMessage(response.error)
      setSuccess(null)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">VOLVER AL LOGIN</span>
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">RECUPERAR CONTRASEÑA</h1>
          <p className="text-white/60 text-sm">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
          </p>
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
                type="email"
                {...register("email", { required: true })}
                className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/40"
                placeholder="CORREO ELECTRÓNICO"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black px-4 py-3 font-bold hover:bg-white/90 transition-colors tracking-wide"
            >
              ENVIAR ENLACE
            </button>

            <p className="text-white/60 text-sm text-center pt-4">
              ¿Recordaste tu contraseña?{" "}
              <Link to="/login" className="text-white hover:underline font-medium">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
