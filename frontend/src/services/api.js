        import axios from "axios";

        const api = axios.create({
        baseURL: "http://127.0.0.1:8000/",
        });

        api.interceptors.request.use((config) => {
        // Don't send token while logging in
        if (!config.url.includes("login")) {
            const token = localStorage.getItem("access");

            if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
        });

        export default api;