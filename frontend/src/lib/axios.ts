import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Vite proxy handles the target to http://localhost:8080
    withCredentials: true, // Necessary for HttpOnly cookies
});

// Response interceptor to handle errors globally 
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // You could handle 401 (Unauthorized) here by redirecting to login 
        // or clearing local state if needed.
        if (error.response?.status === 401) {
             console.log("Unauthorized access - user might need to login");
        }
        return Promise.reject(error);
    }
);

export default api;
