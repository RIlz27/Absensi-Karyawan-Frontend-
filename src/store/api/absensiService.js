import axios from "axios";
import store from "@/store";
import { startLoading, stopLoading } from "./loadingSlice";

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
    // store.dispatch(startLoading()); // Disabled global loader
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    // store.dispatch(stopLoading());
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Handler
API.interceptors.response.use(
  (response) => {
    store.dispatch(stopLoading()); // Keep this just in case, or disable it
    return response;
  },
  (error) => {
    store.dispatch(stopLoading()); // Keep this so it clears any stuck loading
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
export const updateUserRole = async (id, role) => (await API.patch(`/users/${id}/role`, { role })).data;
export const deleteUser = async (id) => (await API.delete(`/users/${id}`)).data;

// USER SHIFTS
export const postShiftBiasa = async (payload) => (await API.post("/user-shifts/biasa", payload)).data;
export const postShiftTambahan = async (payload) => (await API.post("/user-shifts/tambahan", payload)).data;
export const deleteUserShift = async (id) => (await API.delete(`/user-shifts/${id}`)).data;


// PENILAIAN / KPI (Assessment Categories)
export const getAssessmentCategories = async () => (await API.get("/assessment-categories")).data;
export const getAssessmentCategoryById = async (id) => (await API.get(`/assessment-categories/${id}`)).data;
export const createAssessmentCategory = async (data) => (await API.post("/assessment-categories", data)).data;
export const updateAssessmentCategory = async (id, data) => (await API.put(`/assessment-categories/${id}`, data)).data;
export const deleteAssessmentCategory = async (id) => (await API.delete(`/assessment-categories/${id}`)).data;

// PENILAIAN / KPI (Transactions & Subordinates)
export const getSubordinates = async () => (await API.get("/assessments/subordinates")).data;
export const getAssessments = async (periodType = "") => (await API.get(periodType ? `/assessments?period_type=${periodType}` : "/assessments")).data;
export const getAssessmentById = async (id) => (await API.get(`/assessments/${id}`)).data;
export const submitAssessment = async (data) => (await API.post("/assessments", data)).data;

//PENILAIAN QUESTION
export const getQuestionsByCategory = async (categoryId) =>
  (await API.get(`/assessment-questions/category/${categoryId}`)).data;

export const createQuestion = async (data) =>
  (await API.post("/assessment-questions", data)).data;

export const updateQuestion = async (id, data) =>
  (await API.put(`/assessment-questions/${id}`, data)).data;

export const deleteQuestion = async (id) =>
  (await API.delete(`/assessment-questions/${id}`)).data;


export default API;