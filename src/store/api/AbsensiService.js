import axios from "axios";

// 1. Inisialisasi Instance
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});


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

// 3. Service Functions
export const login = async (credentials) => {
  const response = await API.post("/login", credentials);
  return response.data;
};

export const generateQr = async (payload) => {
  const response = await API.post("/generate-qr", payload);
  return response.data;
};

export const scanQr = async (payload) => {
  // Langsung return API.post, catch-nya biar dihandle useMutation (onError)
  // Tapi kalau mau log tambahan di sini juga boleh
  const response = await API.post("/scan-qr", payload);
  return response.data;
};

export default API;