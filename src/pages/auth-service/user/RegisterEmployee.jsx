"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { registerRequestEmployee } from "../../../api-gateway/auth.js"
import { UserPlus, Mail, Lock, User } from "lucide-react"

function RegisterEmployeePage() {
  const { register, handleSubmit, reset } = useForm()
  const [serverMessage, setServerMessage] = useState(null)
  const [success, setSuccess] = useState(null)

  const onSubmit = async (values) => {
    values.rolId = 1
    const response = await registerRequestEmployee(values)
    if (response.success) {
      setSuccess("Empleado registrado correctamente")
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
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-10">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <UserPlus className="w-8 h-8 text-white" />
              <h2 className="text-white text-2xl font-bold uppercase tracking-tight">REGISTRAR EMPLEADO</h2>
            </div>
            <div className="h-1 w-24 bg-white"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" value={1} {...register("rolId")} />

            <div>
              <label className="block text-white/70 text-xs uppercase tracking-wide mb-2">Nombre</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  {...register("nombre", { required: true })}
                  className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 pl-12 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/30"
                  placeholder="Ingrese el nombre"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-xs uppercase tracking-wide mb-2">Apellido</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  {...register("apellido", { required: true })}
                  className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 pl-12 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/30"
                  placeholder="Ingrese el apellido"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-xs uppercase tracking-wide mb-2">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 pl-12 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/30"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-xs uppercase tracking-wide mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="password"
                  {...register("password", { required: true })}
                  className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 pl-12 focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/30"
                  placeholder="Ingrese la contraseña"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black px-6 py-4 uppercase text-sm font-bold tracking-wide hover:bg-white/90 transition-colors mt-6"
            >
              REGISTRAR EMPLEADO
            </button>

            {serverMessage && (
              <div className="mt-4 p-4 bg-red-600/20 border border-red-600/50 text-red-400 text-sm">
                {serverMessage}
              </div>
            )}
            {success && (
              <div className="mt-4 p-4 bg-green-600/20 border border-green-600/50 text-green-400 text-sm">
                {success}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterEmployeePage
