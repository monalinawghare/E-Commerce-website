        import axios from "axios";

        const api = axios.create({
            baseURL: "https://e-commerce-website-omik.onrender.com/",
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