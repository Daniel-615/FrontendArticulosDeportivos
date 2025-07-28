import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { LoginGoogleRequest } from '../../../api-gateway/auth.js';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../../context/AuthContent.jsx';

function LoginPage() {
  const { register, handleSubmit, reset } = useForm();
  const [serverMessage, setServerMessage] = useState(null);
  const { signin } = useAuth();
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const response = await signin(values);

    if (response.success) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setServerMessage(null);
      reset();
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      // ✅ Nos aseguramos que el mensaje sea un string
      const message =
        typeof response.message === 'string'
          ? response.message
          : typeof response.error === 'string'
          ? response.error
          : 'Error desconocido.';
      setServerMessage(message);
      setSuccess(null);
    }
  };

  const handleGoogleLogin = () => {
    LoginGoogleRequest();
  };

  return (
    <div className="bg-zinc-800 max-w-md p-10 rounded-md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          {...register('email', { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-2"
          placeholder="Correo electrónico"
        />
        <input
          type="password"
          {...register('password', { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-2"
          placeholder="Contraseña"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Iniciar Sesión
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors mt-4"
        >
          <FcGoogle className="text-2xl" />
          Iniciar sesión con Google
        </button>

        {typeof serverMessage === 'string' && (
          <p className="text-red-400 text-sm mt-4">{serverMessage}</p>
        )}
        {success && (
          <p className="text-green-400 text-sm mt-4">{success}</p>
        )}
      </form>
    </div>
  );
}

export default LoginPage;
