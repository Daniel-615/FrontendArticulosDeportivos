import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { LoginGoogleRequest } from '../../../api-gateway/auth.js';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../../context/AuthContext.jsx';

function RegisterPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { signup } = useAuth();
  const [serverMessage, setServerMessage] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    setServerMessage(null);
    setSuccess(null);

    const response = await signup(values);

    if (response.success && response.data) {
      const user = {
        id: response.data.id ||'',
        nombre: response.data.nombre || '',
        apellido: response.data.apellido || '',
        rol: response.data.rolAsignado === 1 ? 'empleado' : 'cliente',
      };
      localStorage.setItem('user', JSON.stringify(user));
      setSuccess("¡Registro exitoso!");
      reset();

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      setServerMessage(response.message || response.error || "Ocurrió un error.");
    }
  };

  const handleGoogleLogin = () => {
    LoginGoogleRequest();
  };

  return (
    <div className="bg-zinc-800 max-w-md p-10 rounded-md">
      {serverMessage && (
        <div className="bg-red-500 p-2 text-white mb-4 rounded text-center">
          {serverMessage}
        </div>
      )}

      {success && (
        <div className="bg-green-500 p-2 text-white mb-4 rounded text-center">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          {...register('nombre', { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-2"
          placeholder="Nombre"
        />
        {errors.nombre && <p className="text-red-500 text-sm mb-2">Nombre es requerido</p>}

        <input
          type="text"
          {...register('apellido', { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-2"
          placeholder="Apellido"
        />
        {errors.apellido && <p className="text-red-500 text-sm mb-2">Apellido es requerido</p>}

        <input
          type="email"
          {...register('email', { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-2"
          placeholder="Correo electrónico"
        />
        {errors.email && <p className="text-red-500 text-sm mb-2">Correo es requerido</p>}

        <input
          type="password"
          {...register('password', { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-2"
          placeholder="Contraseña"
        />
        {errors.password && <p className="text-red-500 text-sm mb-4">Contraseña es requerida</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Registrarse
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors mt-4 flex items-center justify-center gap-2"
        >
          <FcGoogle className="text-2xl" />
          Registrarse con Google
        </button>

        <p className="text-gray-300 text-sm mt-6 text-center">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
