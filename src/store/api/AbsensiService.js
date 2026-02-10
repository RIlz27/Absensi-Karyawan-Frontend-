import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Interceptor buat nempelin Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Pastikan key-nya 'token'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Service functions
export const getKantors = async () => {
  const response = await API.get("/kantor");
  return response.data;
};

export const generateQr = async (payload) => {
  const response = await API.post("/generate-qr", payload);
  return response.data;
};

export const scanQr = async (payload) => {
  const response = await API.post("/scan", payload);
  return response.data;
};

export const addKantor = async (newData) => {
  const response = await API.post("/kantor", newData);
  return response.data;
};

// Simpan user baru
export const createUser = async (payload) => {
  const res = await API.post("/users", payload);
  return res.data;
};

// Update user
export const updateUser = async (id, payload) => {
  const res = await API.put(`/users/${id}`, payload);
  return res.data;
};

export default API;