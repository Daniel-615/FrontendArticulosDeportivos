import axios from 'axios';

const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;

// Crear un nuevo permiso
export const createPermiso = async (permiso) => {
    try {
        const response = await axios.post(
            `${API_GATEWAY}permiso/`,
            permiso,
            {
                withCredentials: true,
            }
        );
        return { success: true, data: response.data };
    } catch (error) {
        if (error.response) {
            return {
                success: false,
                error: error.response.data.error || "Error del servidor",
            };
        }
        return { success: false, error: "Error de red o del servidor" };
    }
};

// Obtener permisos con paginación
export const getPermisos = async (page = 1, limit = 10) => {
    try {
        const response = await axios.get(
            `${API_GATEWAY}permiso?page=${page}&limit=${limit}/`,
            {
                withCredentials: true,
            }
        );
        return {
            success: true,
            data: response.data.data, //contiene un arreglo de los permisos
            total: response.data.total,
            page: response.data.page,
            totalPages: response.data.totalPages,
        };
    } catch (error) {
        if (error.response) {
            return {
                success: false,
                error: error.response.data?.error || "Error del servidor",
            };
        }
        return { success: false, error: "Error de red o del servidor" };
    }
};

// Obtener un permiso por ID
export const getPermisoId = async (id) => {
    try {
        const response = await axios.get(`${API_GATEWAY}permiso/${id}`, {
            withCredentials: true,
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        if (error.response) {
            return {
                success: false,
                error: error.response?.data?.error || "Error del servidor",
            };
        }
        return { success: false, error: "Error de red o del servidor" };
    }
};

// Actualizar un permiso
export const updatePermiso = async (id, permiso) => {
    try {
        const response = await axios.put(
            `${API_GATEWAY}permiso/${id}`,
            permiso,
            {
                withCredentials: true,
            }
        );
        return { success: true, data: response.data };
    } catch (error) {
        if (error.response) {
            return {
                success: false,
                error: error.response?.data?.error || "Error del servidor",
            };
        }
        return { success: false, error: "Error de red o del servidor" };
    }
};

// Eliminar un permiso
export const deletePermiso = async (id) => {
    try {
        const response = await axios.delete(`${API_GATEWAY}permiso/${id}`, {
            withCredentials: true,
        });
        return { success: true, data: response.data };
    } catch (error) {
        if (error.response) {
            return {
                success: false,
                error: error.response.data.error || "Error del servidor",
            };
        }
        return { success: false, error: "Error de red o del servidor" };
    }
};
