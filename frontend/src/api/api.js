import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8001";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
});

export const getDashboard = () => api.get("/conversations/stats/dashboard").then((r) => r.data);
export const getConversations = () => api.get("/conversations").then((r) => r.data);
export const getConversation = (id) => api.get(`/conversations/${id}`).then((r) => r.data);
export const uploadRecording = (formData) => api.post("/recordings/upload", formData).then((r) => r.data);
export const searchMemory = (payload) => api.post("/memory/search", payload).then((r) => r.data);
export const askMemory = (question) => api.post("/questions/ask", { question }).then((r) => r.data);
export const getActions = () => api.get("/action-items").then((r) => r.data);
export const updateAction = (id, payload) => api.patch(`/action-items/${id}`, payload).then((r) => r.data);
export const generateReport = (payload) => api.post("/reports/generate", payload).then((r) => r.data);
export const getReports = () => api.get("/reports").then((r) => r.data);
export const getSettings = () => api.get("/settings").then((r) => r.data);
