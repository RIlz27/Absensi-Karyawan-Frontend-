import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const API = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "ngrok-skip-browser-warning": "69420"
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handler
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      if (!window.location.pathname.includes("/login")) window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getKantors = async () => {
  const response = await API.get("/kantors");
  if (!response.data) {
    return [];
  }
  return response.data;
};
export const addKantor = async (data) => (await API.post("/kantor", data)).data;
export const deleteKantor = async (id) => (await API.delete(`/kantor/${id}`)).data;

// ABSENSI & QR
export const generateQr = async (payload) => (await API.post("/generate-qr", payload)).data;
export const scanQr = async (payload) => (await API.post("/scan", payload)).data;
export const scanSelfie = async (payload) => (await API.post("/scan-selfie", payload)).data;

// USER
export const getUsers = async () => (await API.get("/users")).data;
export const createUser = async (data) => (await API.post("/users", data)).data;
export const updateUser = async (id, data) => (await API.put(`/users/${id}`, data)).data;
export const deleteUser = async (id) => (await API.delete(`/users/${id}`)).data;

// USER SHIFTS
export const postShiftBiasa = async (payload) => (await API.post("/user-shifts/biasa", payload)).data;
export const postShiftTambahan = async (payload) => (await API.post("/user-shifts/tambahan", payload)).data;
export const deleteUserShift = async (id) => (await API.delete(`/user-shifts/${id}`)).data;

export default API;
