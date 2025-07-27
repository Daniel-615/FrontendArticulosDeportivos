import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerRequestEmployee } from '../../../api-gateway/auth.js';
function RegisterEmployeePage() {
    const { register, handleSubmit, reset } = useForm();
    const [serverMessage, setServerMessage] = useState(null);
    const [success, setSuccess] = useState(null);
    const onSubmit = async (values) => {
        const response = await registerRequestEmployee(values); 
        if (response.success) {
            setServerMessage(null);
            reset();
        } else {
            setServerMessage(response.error);
            setSuccess(null);
        }
    };

    return (
        <div className="bg-zinc-800 max-w-md p-10 rounded-md">
        <h2 className="text-white text-xl font-bold mb-4">Registrar Empleado</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
            type="hidden"
            value={1}
            {...register('rolId')}
            />

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
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
            Registrar Empleado
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
export default RegisterEmployeePage;