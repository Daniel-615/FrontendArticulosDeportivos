import axios from 'axios';

const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;

// Crear una relación rol-permiso
export const createRolPermiso = async (rolPermiso) => {
    try {
        const response = await axios.post(`${API_GATEWAY}rol-permiso/`, rolPermiso, {
            withCredentials: true,
        });
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Error del servidor',
        };
    }
};


// Obtener todas las relaciones rol-permiso
export const getRolPermisos = async (page = 1, limit = 10) => {
    try {
        const response = await axios.get(`${API_GATEWAY}rol-permiso/`, {
        params: { page, limit },
        withCredentials: true,
        });
        return { success: true, data: response.data };
    } catch (error) {
        return {
        success: false,
        error: error.response?.data?.message || 'Error del servidor',
        };
    }
};


// Obtener una relación específica por rolId y permisoId
export const getRolPermisoById = async (rolId, permisoId) => {
    try {
        const response = await axios.get(`${API_GATEWAY}rol-permiso/${rolId}/${permisoId}`, {
            withCredentials: true,
        });
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Error del servidor',
        };
    }
};

// Eliminar una relación específica por rolId y permisoId
export const deleteRolPermiso = async (rolId, permisoId) => {
    try {
        const response = await axios.delete(`${API_GATEWAY}rol-permiso/${rolId}/${permisoId}`, {
            withCredentials: true,
        });
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Error del servidor',
        };
    }
};

// Obtener permisos no asignados a un rol específico
export const getPermisosNoAsignados = async (rolId) => {
    try {
        const response = await axios.get(`${API_GATEWAY}rol-permiso/rol-no-asignado/${rolId}`, {
            withCredentials: true,
        });
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Error del servidor',
        };
    }
};
