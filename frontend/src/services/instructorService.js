import axios from 'axios';

const API_URL = 'http://localhost:5000/api/instructors';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
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

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const instructorService = {
  getProfile: async () => {
    try {
      const response = await api.get('/InstructorProfile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/InstructorProfile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updatePricing: async (pricingData) => {
    try {
      const response = await api.put('/Pricing', pricingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAvailability: async (availability) => {
    try {
      const response = await api.put('/Availability', { availability });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default instructorService; 