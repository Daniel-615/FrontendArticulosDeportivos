import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../../api-gateway/auth.js';

function ResetPasswordPage() {
  const { register, handleSubmit, reset } = useForm();
  const [serverMessage, setServerMessage] = useState(null);
  const [success, setSuccess] = useState(null);

  // Obtenemos el token desde la query string
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = async (values) => {
    if (!token) {
      setServerMessage("Token no encontrado.");
      return;
    }

    const response = await resetPassword({ token, newPassword: values.newPassword });

    if (response.success) {
      setSuccess('Contraseña cambiada correctamente.');
      setServerMessage(null);
      reset();
    } else {
      setServerMessage(response.error || "Error al cambiar la contraseña.");
      setSuccess(null);
    }
  };

  return (
    <div className="bg-zinc-800 max-w-md p-10 rounded-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="password"
          {...register('newPassword', { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-2"
          placeholder="Nueva Contraseña"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Cambiar Contraseña
        </button>

        {serverMessage && <p className="text-red-400 text-sm mt-4">{serverMessage}</p>}
        {success && <p className="text-green-400 text-sm mt-4">{success}</p>}
      </form>
    </div>
  );
}

export default ResetPasswordPage;
