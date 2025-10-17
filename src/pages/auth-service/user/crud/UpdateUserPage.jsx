"use client"

import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { updateUser, deactivateAccount } from "../../../../api-gateway/user.crud.js"
import { useNavigate } from "react-router-dom"
import { Logout } from "../../../../api-gateway/auth.js"
import { toast } from "react-toastify"
import { User, Mail, AlertTriangle } from "lucide-react"

function UpdateUserPage() {
  const { register, handleSubmit, setValue } = useForm()
  const [serverMessage, setServerMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deactivating, setDeactivating] = useState(false)
  const navigate = useNavigate()

  const storedUser = JSON.parse(localStorage.getItem("user"))
  const userId = storedUser?.id

  useEffect(() => {
    if (storedUser) {
      if (storedUser.nombre) setValue("nombre", storedUser.nombre)
      if (storedUser.apellido) setValue("apellido", storedUser.apellido)
      if (storedUser.email) setValue("email", storedUser.email)
    }
  }, [storedUser, setValue])

  const onSubmit = async (data) => {
    if (!userId) {
      setServerMessage("ID de usuario no encontrado.")
      toast.error("ID de usuario no encontrado.")
      return
    }

    setSaving(true)
    try {
      const response = await updateUser(data, userId)

      if (response.success) {
        const msg = response.data?.message || "Usuario actualizado correctamente."
        toast.success(msg)
        setSuccessMessage(msg)
        setServerMessage(null)

        const updatedUser = { ...storedUser, ...data }
        localStorage.setItem("user", JSON.stringify(updatedUser))

        setValue("nombre", data.nombre)
        setValue("apellido", data.apellido)
        setValue("email", data.email)

        setTimeout(() => navigate("/"), 1200)
      } else {
        const errMsg = response.error || "No se pudo actualizar el usuario."
        toast.error(errMsg)
        setServerMessage(errMsg)
        setSuccessMessage(null)
      }
    } catch {
      toast.error("Error inesperado al actualizar.")
      setServerMessage("Error inesperado al actualizar.")
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async () => {
    if (!userId) {
      toast.error("ID de usuario no encontrado.")
      return
    }

    const confirm = window.confirm("¿Estás seguro de que deseas desactivar tu cuenta?")
    if (!confirm) return

    setDeactivating(true)
    try {
      const result = await deactivateAccount(userId)

      if (result.success) {
        const msg = result.data?.message || "Cuenta desactivada exitosamente."
        toast.success(msg)
        try {
          await Logout()
        } catch {
          /* si falla el logout no bloqueamos la salida */
        } finally {
          localStorage.removeItem("user")
          navigate("/login")
        }
      } else {
        toast.error(result.error || "No se pudo desactivar la cuenta.")
        setServerMessage(result.error || "No se pudo desactivar la cuenta.")
      }
    } catch {
      toast.error("Error inesperado al desactivar la cuenta.")
    } finally {
      setDeactivating(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">MI PERFIL</h1>
          <p className="text-white/60 text-sm tracking-wider uppercase">Actualiza tu información</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-8 border border-white/20">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-white/60 text-xs font-medium mb-2 tracking-wider uppercase">Nombre</label>
              <input
                type="text"
                {...register("nombre", { required: true })}
                className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/40"
                placeholder="NOMBRE"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs font-medium mb-2 tracking-wider uppercase">Apellido</label>
              <input
                type="text"
                {...register("apellido", { required: true })}
                className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/40"
                placeholder="APELLIDO"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs font-medium mb-2 tracking-wider uppercase">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  {...register("email")}
                  className="w-full bg-white/5 border border-white/20 text-white pl-11 pr-4 py-3 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/40"
                  placeholder="CORREO ELECTRÓNICO"
                  disabled={saving}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className={`w-full text-black px-4 py-3 font-bold transition-colors tracking-wide ${
                saving ? "bg-white/50 cursor-not-allowed" : "bg-white hover:bg-white/90"
              }`}
            >
              {saving ? "GUARDANDO…" : "GUARDAR CAMBIOS"}
            </button>

            {serverMessage && (
              <p className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/30 p-2">
                {serverMessage}
              </p>
            )}
            {successMessage && (
              <p className="text-green-400 text-xs text-center bg-green-500/10 border border-green-500/30 p-2">
                {successMessage}
              </p>
            )}
          </form>

          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex items-center gap-2 text-white/60 text-xs mb-3">
              <AlertTriangle className="w-4 h-4" />
              <span className="uppercase tracking-wider">Zona de peligro</span>
            </div>
            <button
              className={`w-full text-white px-4 py-3 font-bold transition-colors tracking-wide border ${
                deactivating
                  ? "bg-red-500/20 border-red-500/30 cursor-not-allowed"
                  : "bg-red-500/10 border-red-500/50 hover:bg-red-500/20"
              }`}
              onClick={handleDeactivate}
              disabled={deactivating}
            >
              {deactivating ? "DESACTIVANDO…" : "DESACTIVAR CUENTA"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateUserPage
