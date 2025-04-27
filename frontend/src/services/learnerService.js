import axios from 'axios';

const API_URL = 'http://localhost:5000/api/learners';

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
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (token && user.role === 'learner') {
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
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'learner') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const learnerService = {
  getProfile: async () => {
    try {
      const response = await api.get('/LearnerProfile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/LearnerProfile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProgress: async () => {
    try {
      const response = await api.get('/LearningProgress');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProgress: async (progressData) => {
    try {
      const response = await api.put('/LearningProgress', progressData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  checkProfile: async () => {
    try {
      console.log('Checking profile with token:', localStorage.getItem('authToken'));
      const response = await api.get('/CheckLearner');
      console.log('Check response:', response);
      return response.data;
    } catch (error) {
      console.error('Error checking profile:', error);
      throw error;
    }
  }
};

export default learnerService; 