import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const API = axios.create({ baseURL: API_BASE_URL });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('bn_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A 401 means the session token is missing, expired, or revoked —
// clear it so the user is sent back to the login screen.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.hash.startsWith('#/login')) {
      localStorage.removeItem('bn_token');
      window.location.hash = '#/login';
    }
    return Promise.reject(error);
  }
);

const extractMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// Account
export const getAccountDetails = () => API.get('/account/details');
export const getBalance = () => API.get('/account/balance');
export const deposit = (data) => API.post('/account/deposit', data);
export const withdraw = (data) => API.post('/account/withdraw', data);
export const transfer = (data) => API.post('/account/transfer', data);

// Transactions
export const getHistory = () => API.get('/transactions/history');

// Beneficiaries
export const getBeneficiaries = () => API.get('/beneficiaries');
export const addBeneficiary = (data) => API.post('/beneficiaries', data);
export const deleteBeneficiary = (id) => API.delete(`/beneficiaries/${id}`);

export { API_BASE_URL, extractMessage };
