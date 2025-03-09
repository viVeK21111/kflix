import axios from "axios";

// Set the backend URL based on environment
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
