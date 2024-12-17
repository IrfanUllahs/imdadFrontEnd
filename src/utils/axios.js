// utils/axiosConfig.js
import axios from 'axios';

// Create an Axios instance
 
const baseURL=process.env.REACT_APP_BASE_URL

console.log(baseURL,"%%%%%%%%%%%%%%%%%%%");

const axiosInstance = axios.create({
    baseURL: baseURL, // Replace with your base URL
    timeout: 10000, // Request timeout in milliseconds
});

// Add headers to every request
axiosInstance.defaults.headers.common['Authorization'] = 'Bearer your-token'; // Replace with your token logic
axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';

// Interceptors for additional processing (optional)
axiosInstance.interceptors.request.use(
    (config) => {
        // You can dynamically set headers here, e.g., from localStorage
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        // Handle successful responses
        return response;
    },
    (error) => {
        // Handle errors globally
        if (error.response?.status === 401) {
            console.error('Unauthorized! Redirecting to login...');
            // Redirect to login or handle session expiry
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
