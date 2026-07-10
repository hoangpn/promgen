/**
 * Promgen API Client
 * 
 * Centralized API client for making requests to Promgen REST API v2
 */

import axios from 'axios';

// Create axios instance with defaults
const api = axios.create({
  baseURL: '/rest/v2',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for CSRF token
api.interceptors.request.use(
  (config) => {
    // Get CSRF token from cookie or meta tag
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value 
      || getCookie('csrftoken');
    
    if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login page
      window.location.href = '/login/';
    } else if (error.response?.status === 403) {
      console.error('Permission denied:', error.response.data);
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Helper function to get cookie value
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Helper function to build query string from params
function buildQueryString(params) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
}

export { api, buildQueryString };
export default api;

