import {useForm} from 'react-hook-form';
import {useState} from 'react';
import {LoginGoogleRequest, LoginRequest} from '../../../api-gateway/auth.js'
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

function LoginPage(){
    const {register, handleSubmit,reset}= useForm();
    const [serverMessage, setServerMessage]= useState(null);
    const [success, setSucess]= useState(null);
    const navigate=useNavigate()
    const onSubmit=async(values)=>{
        const response=await LoginRequest(values);
        if(response.success){
            localStorage.setItem('user',JSON.stringify(response.data.user))
            navigate('/')
            setServerMessage(null);
            reset();
        } else{
            setServerMessage(response.error);
            setSucess(null);
        }
    };
    const handleGoogleLogin=()=>{
        //Esto redirige directamente al gateway para iniciar con google.
        LoginGoogleRequest();
    }
    return(
        <div className="bg-zinc-800 max-w-md p-10 rounded-md">
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="email" 
                    {...register('email',{required:true})}
                    className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-2'
                    placeholder='Correo electrónico'
                />
                <input
                    type='password'
                    {...register('password',{required:true})}
                    className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-2'
                    placeholder='Contraseña'
                />
                <button
                    type="submit"
                    className='w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
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
                
                {serverMessage &&(
                    <p className="text-red-400 text-sm mt-4">{serverMessage}</p>
                )}
                {success && (
                    <p className="text-green-400 text-sm mt-4">{success}</p>
                )}
            </form>

        </div>
    )
}
export default LoginPage;