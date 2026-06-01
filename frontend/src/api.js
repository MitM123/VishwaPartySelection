import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// ---- Clients (parties) ----
export const fetchClients   = (search = "") => API.get("/clients", { params: { search } });
export const fetchClient    = (id)          => API.get(`/clients/${id}`);
export const createClient   = (data)        => API.post("/clients", data);
export const updateClient   = (id, data)    => API.put(`/clients/${id}`, data);
export const deleteClient   = (id)          => API.delete(`/clients/${id}`);

// ---- Selections ----
export const fetchSelections = (clientId, search = "") =>
  API.get(`/clients/${clientId}/selections`, { params: { search } });
export const createSelection = (clientId, data) => API.post(`/clients/${clientId}/selections`, data);
export const updateSelection = (id, data)       => API.put(`/selections/${id}`, data);
export const deleteSelection = (id)             => API.delete(`/selections/${id}`);
export const searchAllSelections = (search = "") => API.get("/selections", { params: { search } });

export default API;
