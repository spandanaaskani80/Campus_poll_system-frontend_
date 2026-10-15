import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth failures
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthRoute = window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/register');
      if (!isAuthRoute) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Admin endpoints
export const adminApi = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllUsers: () => api.get('/admin/users'),
  getAllPolls: () => api.get('/admin/polls'),
  getPollById: (pollId) => api.get(`/admin/polls/${pollId}`),
  createPoll: (pollData) => api.post('/admin/polls', pollData),
  updatePoll: (pollId, pollData) => api.put(`/admin/polls/${pollId}`, pollData),
  publishPoll: (pollId) => api.post(`/admin/polls/${pollId}/publish`),
  closePoll: (pollId) => api.post(`/admin/polls/${pollId}/close`),
  getPollResults: (pollId) => api.get(`/admin/polls/${pollId}/results`),
};

// Student endpoints
export const studentApi = {
  getDashboard: () => api.get('/student/dashboard'),
  getAllPolls: () => api.get('/student/polls'),
  getActivePolls: () => api.get('/student/polls/active'),
  getUpcomingPolls: () => api.get('/student/polls/upcoming'),
  getClosedPolls: () => api.get('/student/polls/closed'),
  getPollById: (pollId) => api.get(`/student/polls/${pollId}`),
  submitVote: (pollId, optionId) => api.post(`/student/polls/${pollId}/vote`, { optionId }),
  getPollResults: (pollId) => api.get(`/student/polls/${pollId}/results`),
  getVotingHistory: () => api.get('/student/voting-history'),
};

export default api;
