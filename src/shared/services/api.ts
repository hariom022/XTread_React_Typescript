import axios from "axios";

console.log(
    "api_url",
    import.meta.env.VITE_APP_API_URL
);

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
});

// Add JWT token to every Axios request
api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);
// Handle expired/invalid session
api.interceptors.response.use(
    
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {

            // Remove expired token
            localStorage.removeItem("token");

            // Remove user information if you store it
            localStorage.removeItem("user");

            // Redirect to login page
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);
export default api;