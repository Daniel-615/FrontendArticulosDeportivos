import {useForm} from 'react-hook-form';
import {useState} from 'react';
import {ForgotPassword} from '../../../api-gateway/auth.js'
function ForgotPasswordPage(){
    const {register, handleSubmit,reset}= useForm();
    const [serverMessage, setServerMessage]= useState(null);
    const [success, setSucess]= useState(null);
    const onSubmit=async(values)=>{
        const response=await ForgotPassword(values);
        if(response.success){
            setSucess('Revisa tu bandeja de correo.')
            setServerMessage(null);
            reset();
        }else{
            setServerMessage(response.error);
            setSucess(null);
        }
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
                <button
                    type="submit"
                    className='w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
                >
                    Enviar Correo
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
export default ForgotPasswordPage;