import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { LoginGoogleRequest } from '../../../api-gateway/auth.js';
import { useNavigate, Link } from 'react-router-dom';
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
          className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors mt-4 flex items-center justify-center gap-2"
        >
          <FcGoogle className="text-2xl" />
          Iniciar sesión con Google
        </button>

        {typeof serverMessage === 'string' && (
          <p className="text-red-400 text-sm mt-4 text-center">{serverMessage}</p>
        )}

        {success && (
          <p className="text-green-400 text-sm mt-4 text-center">{success}</p>
        )}
      </form>

      {/* Enlaces adicionales */}
      <div className="text-center mt-6 text-sm text-gray-300">
        <p>
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-blue-400 hover:underline">
            Regístrate aquí
          </Link>
        </p>
        <p className="mt-2">
          ¿Olvidaste tu contraseña?{' '}
          <Link to="/forgot-password" className="text-blue-400 hover:underline">
            Recuperarla
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
