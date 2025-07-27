import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { LoginGoogleRequest,registerRequest } from '../../../api-gateway/auth.js';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
function RegisterPage() {
    const { register, handleSubmit, reset } = useForm();
    const [serverMessage, setServerMessage] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate=useNavigate();
    const onSubmit = async (values) => {
        const response = await registerRequest(values);
        if (response.success) {
            navigate('');
            setServerMessage(null);
            reset();
        } else {
            setServerMessage(response.error);
            setSuccess(null);
            }
    };
    const handleGoogleLogin=()=>{
        //Esto redirige directamente al gateway para iniciar con google.
        LoginGoogleRequest();
    }
    return (
        <div className="bg-zinc-800 max-w-md p-10 rounded-md">
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
            type="text"
            {...register('nombre', { required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-2"
            placeholder="Nombre"
            />
            <input
            type="text"
            {...register('apellido', { required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-2"
            placeholder="Apellido"
            />
            <input
            type="email"
            {...register('email', { required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-2"
            placeholder="Correo electrónico"
            />
            <input
            type="password"
            {...register('password', { required: true })}
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-4"
            placeholder="Contraseña"
            />
            <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
            Registrarse
            </button>
            <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors mt-4"
            >
                <FcGoogle className="text-2xl" />
                Iniciar sesión con Google
            </button>
            {serverMessage && (
            <p className="text-red-400 text-sm mt-4">{serverMessage}</p>
            )}
            {success && (
            <p className="text-green-400 text-sm mt-4">{success}</p>
            )}
        </form>
        </div>
    );
}
export default RegisterPage;
