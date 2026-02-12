import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// 1. Request Interceptor: Nempelin Token ke setiap request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Menangani error 401 (Unauthorized) secara global
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika server kirim 401, artinya token mati/user dihapus (efek migrate:fresh)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token"); // Hapus token sampah
      localStorage.removeItem("user");
      
      // Redirect ke login jika bukan di halaman login
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login"; 
      }
    }
    return Promise.reject(error);
  }
);

// --- SERVICE FUNCTIONS ---

export const getKantors = async () => {
  const response = await API.get("/kantor");
  return response.data;
};

export const addKantor = async (newData) => {
  const response = await API.post("/kantor", newData);
  return response.data;
};

// Pastikan endpoint di backend Laravel lo adalah /generate-qr
export const generateQr = async (payload) => {
  const response = await API.post("/generate-qr", payload);
  return response.data;
};

export const scanQr = async (payload) => {
  const response = await API.post("/scan", payload);
  return response.data;
};

export const getUsers = async () => {
  const response = await API.get("/users");
  return response.data;
};

export const createUser = async (payload) => {
  const res = await API.post("/users", payload);
  return res.data;
};

export const updateUser = async (id, payload) => {
  const res = await API.put(`/users/${id}`, payload);
  return res.data;
};

export default API;