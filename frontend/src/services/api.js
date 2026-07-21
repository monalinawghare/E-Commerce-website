import axios from "axios";

        const api = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL,
        });

        api.interceptors.request.use((config) => {
        if (!config.url.includes("login")) {
            const token = localStorage.getItem("access");

            if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
        });

export default api;