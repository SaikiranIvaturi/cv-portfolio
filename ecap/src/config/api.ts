/**
 * Centralized API Configuration
 * 
 * Uses environment variables to determine the backend API URL.
 * In production, VITE_API_URL should be set to the deployed backend URL.
 * In development, defaults to http://localhost:8001/api
 */

// API Base URL - uses environment variable with fallback to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';
// Health check endpoint
export const HEALTH_ENDPOINT = `${API_BASE_URL}/health`;

// Export for convenience
export default {
  baseUrl: API_BASE_URL,
  healthEndpoint: HEALTH_ENDPOINT
};
