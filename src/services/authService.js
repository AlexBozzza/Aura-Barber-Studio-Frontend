
import api from "./api";

// ==========================================
// LOGIN
// ==========================================

export const login = async (email, password) => {
  
  const response = await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  const { user, token, expiresIn } = response.data.data;


  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return {
    user,
    token,
    expiresIn,
  };

};


// ==========================================
// REGISTRO
// ==========================================

export const register = async (
  first_name,
  last_name,
  email,
  phone,
  password
) => {

  const response = await api.post(
    "/auth/register",
    {
      first_name,
      last_name,
      email,
      phone,
      password,
    }
  );

  return response.data;
};

// ==========================================
// VERIFICAR CORREO ELECTRÓNICO
// ==========================================

export const verifyEmail = async (token) => {
  const response = await api.post(
    "/auth/verify-email",
    {
      token,
    }
  );

  return response.data;
};

// ==========================================
// REENVIAR CORREO DE VERIFICACIÓN
// ==========================================

export const resendVerification = async (email) => {
  const response = await api.post(
    "/auth/resend-verification",
    {
      email,
    }
  );

  return response.data;
};

// ==========================================
// RECUPERAR CONTRASEÑA
// ==========================================

export const forgotPassword = async (email) => {
  const response = await api.post(
    "/auth/forgot-password",
    {
      email,
    }
  );

  return response.data;
};

// ==========================================
// RESTABLECER CONTRASEÑA
// ==========================================

export const resetPassword = async (token, password) => {
  const response = await api.post(
    "/auth/reset-password",
    {
      token,
      password,
    }
  );

  return response.data;
};

// ==========================================
// LOGOUT
// ==========================================

export const logout = () => {

  localStorage.removeItem("token");

  localStorage.removeItem("user");

};


// ==========================================
// OBTENER USUARIO ACTUAL
// ==========================================

export const getCurrentUser = () => {

  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {

    return JSON.parse(user);

  } catch (error) {
    console.error("Error leyendo usuario:", error);
    return null;

  }

};


// ==========================================
// OBTENER TOKEN
// ==========================================

export const getToken = () => {

  return localStorage.getItem("token");

};


// ==========================================
// COMPROBAR SI HAY SESIÓN
// ==========================================

export const isAuthenticated = () => {

  return !!localStorage.getItem("token");
  
};
