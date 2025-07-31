import axios from 'axios';
const API_GATEWAY = import.meta.env.VITE_API_GATEWAY;
export const registerRequest = async (user) => {
  try {
    const response = await axios.post(`${API_GATEWAY}usuario/register`, user, {
      withCredentials: true
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error: error.response.data.error|| 'Error del servidor'
      };
    }
    return { success: false, error: 'Error de red o del servidor' };
  }
};
export const registerRequestEmployee = async (user) => {
  try {
    const response = await axios.post(`${API_GATEWAY}usuario/register-admin`, user, {
      withCredentials: true
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error: error.response.data.message || 'Error del servidor'
      };
    }
    return { success: false, error: 'Error de red o del servidor' };
  }
};
export const resetPassword = async ({ token, newPassword }) => {
  try {
    const response = await axios.post(
      `${API_GATEWAY}usuario/reset-password?token=${encodeURIComponent(token)}`, //esto sirve para que no se corrompa el token
      { newPassword },
      { withCredentials: true } 
    );
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error: error.response.data.message || 'Error del servidor'
      };
    }
    return { success: false, error: 'Error de red o del servidor' };
  }
};


export const ForgotPassword=async(user)=>{
  try{
    const response=await axios.post(`${API_GATEWAY}usuario/forgot-password`,user,{
      withCredentials:true
    });
    return { success: true, data: response.data };
  }catch(error){
    if (error.response) {
      return {
        success: false,
        error: error.response.data.message || 'Error del servidor'
      };
    }
    return { success: false, error: 'Error de red o del servidor' };
  }
}
export const LoginRequest = async (credentials) => {
  try {
    const response = await axios.post(`${API_GATEWAY}usuario/login`, credentials, {
      withCredentials: true,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || 'Error al iniciar sesión.',
    };
  }
};

export const LoginGoogleRequest = () => {
  window.location.href = `${API_GATEWAY}usuario/auth/google`;
};

export const refreshTokenRequest= async ()=>{
  try{
    const response= await axios.get(`${API_GATEWAY}usuario/`,{
      withCredentials: true,
    });
    return {success: true, data: response.data};
  }catch(err){
    return {success: false, error: err.response?.data?.message|| "Error de token"}
  }
}

export const Logout = async () => {
  try {
    const response = await axios.post(`${API_GATEWAY}usuario/logout`, {}, {
      withCredentials: true,
    });
    return { success: true, data: response.data };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.message || "Error al cerrar sesión.",
    };
  }
};