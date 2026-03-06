import axios from "axios";

// Pake instance API yang udah dikonfigurasi
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// 1. Request Interceptor: Nempelin Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Global Error Handler
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

// --- SERVICE FUNCTIONS ---
// Dikelompokkan biar lebih rapi

// KANTOR
export const getKantors = async () => (await API.get("/kantor")).data;
export const addKantor = async (data) => (await API.post("/kantor", data)).data;
export const deleteKantor = async (id) => (await API.delete(`/kantor/${id}`)).data;

// ABSENSI & QR
export const generateQr = async (payload) => (await API.post("/generate-qr", payload)).data;
export const scanQr = async (payload) => (await API.post("/scan", payload)).data;

// USER
export const getUsers = async () => (await API.get("/users")).data;
export const createUser = async (data) => (await API.post("/users", data)).data;
export const updateUser = async (id, data) => (await API.put(`/users/${id}`, data)).data;
export const deleteUser = async (id) => (await API.delete(`/users/${id}`)).data;

// USER SHIFTS (PENTING: Samakan dengan route di api.php)
export const postShiftBiasa = async (payload) => (await API.post("/user-shifts/biasa", payload)).data;
export const postShiftTambahan = async (payload) => (await API.post("/user-shifts/tambahan", payload)).data;
export const deleteUserShift = async (id) => (await API.delete(`/user-shifts/${id}`)).data;

export default API;