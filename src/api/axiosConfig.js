import axios from "axios";
import API_BASE_URL from "../apiConfig";

const API = axios.create({
    baseURL: "${API_BASE_URL}", // Spring Boot backend URL
});

// Add JWT token automatically (after login)
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
