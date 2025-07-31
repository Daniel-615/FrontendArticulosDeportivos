import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { updateUser,deactivateAccount } from '../../../../api-gateway/user.crud.js';
import { useNavigate } from 'react-router-dom';
import { Logout } from '../../../../api-gateway/auth.js';
function UpdateUserPage() {
  const { register, handleSubmit, setValue } = useForm();
  const [serverMessage, setServerMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?.id;
  useEffect(() => {
    if (storedUser) {
      if (storedUser.nombre) setValue('nombre', storedUser.nombre);
      if (storedUser.apellido) setValue('apellido', storedUser.apellido);
      if (storedUser.email) setValue('email', storedUser.email);
    }
  }, [storedUser, setValue]);

  const onSubmit = async (data) => {
    if (!userId) {
      setServerMessage("ID de usuario no encontrado.");
      return;
    }

    const response = await updateUser(data, userId);

    if (response.success) {
      setSuccessMessage("Usuario actualizado correctamente.");
      setServerMessage(null);
      const updatedUser = {
        ...storedUser,
        ...data
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setValue('nombre', data.nombre);
      setValue('apellido',data.apellido);
      setValue('email',data.email);
      setTimeout(() => navigate('/'), 1500);
    } else {
      setServerMessage(response.error);
      setSuccessMessage(null);
    }
  };

  return (
    <div className="bg-zinc-800 max-w-md p-10 rounded-md mx-auto mt-10">
      <h2 className="text-white text-2xl mb-4 text-center">Actualizar Usuario</h2>
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
          {...register('email')}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-2"
          placeholder="Correo electrónico"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Guardar cambios
        </button>

        {serverMessage && (
          <p className="text-red-400 text-sm mt-4 text-center">{serverMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-400 text-sm mt-4 text-center">{successMessage}</p>
        )}
      </form>
      <button
        className="w-full mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        onClick={async () => {
          const confirm = window.confirm("¿Estás seguro de que deseas desactivar tu cuenta?");
          if (!confirm) return;

          const result = await deactivateAccount(userId);

          if (result.success) {
            alert("Cuenta desactivada exitosamente.");
            await Logout();
          } else {
            setServerMessage(result.error || "No se pudo desactivar la cuenta.");
          }
        }}
      >
        Desactivar cuenta
      </button>

    </div>
  );
}

export default UpdateUserPage;
