console.log("Base URL de API:", import.meta.env.VITE_API_URL);

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

export async function getCSRFToken() {
  await api.get("/csrf-cookie");
}

export async function loginUser(credentials) {
  try {
    await getCSRFToken();
    const response = await api.post("/login", credentials);
    console.log("Inicio de sesión exitoso", response.data);
    localStorage.setItem("auth_token", response.data.token);
    localStorage.setItem("user_role", response.data.user.rol);
    return response.data;
  } catch (error) {
    console.error("Error en login:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Error al iniciar sesión");
  }
}

export async function logoutUser() {
  try {
    await api.post("/logout");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem("auth_token");
}

export function getUserRole() {
  return localStorage.getItem("user_role") || "user";
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
