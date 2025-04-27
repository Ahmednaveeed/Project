import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Ensure token is properly formatted with Bearer prefix
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },
};

// User services
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
};

// Instructor services
export const instructorService = {
  getProfile: () => api.get('/instructors/profile'),
  updateProfile: (data) => api.put('/instructors/profile', data),
  addVehicle: (data) => api.post('/instructors/vehicles', data),
  updateVehicle: (vehicleId, data) => api.put(`/instructors/vehicles/${vehicleId}`, data),
  removeVehicle: (vehicleId) => api.delete(`/instructors/vehicles/${vehicleId}`),
  updateAvailability: (data) => api.put('/instructors/availability', data),
  getEarnings: () => api.get('/instructors/Earnings'),
  getRatings: () => api.get('/instructors/Ratings'),
  search: (params) => api.get('/instructors/search', { params }),
};

// Learner services
export const learnerService = {
  getProfile: () => api.get('/learners/profile'),
  updateProfile: (profileData) => api.put('/learners/profile', profileData),
  getProgress: () => api.get('/learners/progress'),
  updateProgress: (progressData) => api.put('/learners/progress', progressData),
  uploadProfilePicture: (formData) => {
    return api.post('/users/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

// Booking services
export const bookingService = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getLearnerBookings: () => api.get('/bookings/learner'),
  getInstructorBookings: () => api.get('/bookings/instructor'),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  cancel: (id) => api.delete(`/bookings/${id}`),
};

// Learning services
export const learningService = {
  getMaterials: (params) => api.get('/learning/materials', { params }),
  getMaterialById: (id) => api.get(`/learning/materials/${id}`),
  getQuizzes: (params) => api.get('/learning/quizzes', { params }),
  getQuizById: (id) => api.get(`/learning/quizzes/${id}`),
  submitQuiz: (id, answers) => api.post(`/learning/quizzes/${id}/submit`, { answers }),
};

// Payment services
export const paymentService = {
  createPaymentIntent: (bookingId) => api.post('/payments/create-payment-intent', { bookingId }),
  handleSuccess: (paymentIntentId) => api.post('/payments/success', { paymentIntentId }),
  getLearnerHistory: () => api.get('/payments/history/learner'),
  getInstructorHistory: () => api.get('/payments/history/instructor'),
  requestRefund: (paymentId) => api.post(`/payments/${paymentId}/refund`),
};

// Admin services
export const adminService = {
  getUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  verifyInstructor: (id) => api.put(`/admin/instructors/${id}/verify`),
  getBookings: () => api.get('/admin/bookings'),
  getPayments: () => api.get('/admin/payments'),
  processRefund: (id, reason) => api.post(`/admin/payments/${id}/refund`, { reason }),
  getStatistics: () => api.get('/admin/statistics'),
};

export default api; 