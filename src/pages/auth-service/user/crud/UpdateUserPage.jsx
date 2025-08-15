import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { updateUser, deactivateAccount } from '../../../../api-gateway/user.crud.js';
import { useNavigate } from 'react-router-dom';
import { Logout } from '../../../../api-gateway/auth.js';
import { toast } from 'react-toastify';

function UpdateUserPage() {
  const { register, handleSubmit, setValue } = useForm();
  const [serverMessage, setServerMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
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
      setServerMessage('ID de usuario no encontrado.');
      toast.error('ID de usuario no encontrado.');
      return;
    }

    setSaving(true);
    try {
      const response = await updateUser(data, userId);

      if (response.success) {
        const msg = response.data?.message || 'Usuario actualizado correctamente.';
        toast.success(msg);
        setSuccessMessage(msg);
        setServerMessage(null);

        const updatedUser = { ...storedUser, ...data };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // refrescar inputs por si el backend normaliza nombres/emails
        setValue('nombre', data.nombre);
        setValue('apellido', data.apellido);
        setValue('email', data.email);

        setTimeout(() => navigate('/'), 1200);
      } else {
        const errMsg = response.error || 'No se pudo actualizar el usuario.';
        toast.error(errMsg);
        setServerMessage(errMsg);
        setSuccessMessage(null);
      }
    } catch {
      toast.error('Error inesperado al actualizar.');
      setServerMessage('Error inesperado al actualizar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!userId) {
      toast.error('ID de usuario no encontrado.');
      return;
    }

    const confirm = window.confirm('¿Estás seguro de que deseas desactivar tu cuenta?');
    if (!confirm) return;

    setDeactivating(true);
    try {
      const result = await deactivateAccount(userId);

      if (result.success) {
        const msg = result.data?.message || 'Cuenta desactivada exitosamente.';
        toast.success(msg);
        // cerrar sesión y redirigir
        try {
          await Logout();
        } catch {
          /* si falla el logout no bloqueamos la salida */
        } finally {
          localStorage.removeItem('user');
          navigate('/login');
        }
      } else {
        toast.error(result.error || 'No se pudo desactivar la cuenta.');
        setServerMessage(result.error || 'No se pudo desactivar la cuenta.');
      }
    } catch {
      toast.error('Error inesperado al desactivar la cuenta.');
    } finally {
      setDeactivating(false);
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
          disabled={saving}
        />
        <input
          type="text"
          {...register('apellido', { required: true })}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-2"
          placeholder="Apellido"
          disabled={saving}
        />
        <input
          type="email"
          {...register('email')}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md mb-2"
          placeholder="Correo electrónico"
          disabled={saving}
        />

        <button
          type="submit"
          disabled={saving}
          className={`w-full text-white px-4 py-2 rounded-md transition-colors ${
            saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>

        {serverMessage && (
          <p className="text-red-400 text-sm mt-4 text-center">{serverMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-400 text-sm mt-4 text-center">{successMessage}</p>
        )}
      </form>

      <button
        className={`w-full mt-4 text-white px-4 py-2 rounded-md transition-colors ${
          deactivating ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
        }`}
        onClick={handleDeactivate}
        disabled={deactivating}
      >
        {deactivating ? 'Desactivando…' : 'Desactivar cuenta'}
      </button>
    </div>
  );
}

export default UpdateUserPage;
