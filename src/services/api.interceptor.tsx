import axios from 'axios';

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Replace with your base URL
  // You can add other default configurations here
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Do something before the request is sent
    // For example, add an authorization token
    const token = localStorage.getItem('token'); // Or get the token from some other secure storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with the request error
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx will cause this function to trigger
    // Do something with the response data
    return response;
  },
  (error) => {
    // Any status codes that fall outside the range of 2xx will cause this function to trigger
    // Do something with the response error
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors
      // For example, redirect to the login page
      localStorage.removeItem("token");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
