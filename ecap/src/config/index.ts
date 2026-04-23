/**
 * CoC Platform - Centralized Configuration
 * All environment variables and app configuration in one place
 * Easy to modify for different deployment environments
 * 
 * Configuration Priority:
 * 1. window.__VITE_ENV__ (preferred runtime config from ConfigMap)
 * 2. window.common (legacy runtime config from ConfigMap in ROSA/OpenShift)
 * 3. import.meta.env (build-time Vite environment variables)
 * 4. Default fallback values (localhost for development)
 */

// Extend Window interface for runtime config
declare global {
  interface Window {
    __VITE_ENV__?: {
      VITE_API_URL?: string;
      VITE_BACKEND_URL?: string;
      VITE_APP_VERSION?: string;
    };
    common?: {
      authBaseAPI?: string;
      appIdentityClientId?: string;
      appRedirecturi?: string;
      ideationAPI?: string;
      VITE_BACKEND_URL?: string;
      VITE_API_URL?: string;
    };
  }
}

// Helper to get config value with priority: window.__VITE_ENV__ > window.common > import.meta.env > default
const getEnv = (key: string, defaultValue: string): string => {
  // Check window.__VITE_ENV__ first (preferred runtime config)
  if (typeof window !== 'undefined' && window.__VITE_ENV__?.[key as keyof Window['__VITE_ENV__']]) {
    return window.__VITE_ENV__[key as keyof Window['__VITE_ENV__']] as string;
  }
  // Check window.common (legacy runtime config from existing ConfigMap)
  if (typeof window !== 'undefined' && window.common?.[key as keyof Window['common']]) {
    return window.common[key as keyof Window['common']] as string;
  }
  // Then check Vite env variables (build-time)
  const envValue = import.meta.env[key];
  if (envValue) {
    return envValue;
  }
  // Fallback to default
  return defaultValue;
};

// API Configuration
export const API_CONFIG = {
  // Base URL for backend API - change this for different environments
  BASE_URL: getEnv('VITE_API_URL', 'http://localhost:8001/api'),
  
  // Backend server URL (without /api path) - used for Swagger docs
  BACKEND_URL: getEnv('VITE_BACKEND_URL', 'http://localhost:8001'),
  
  // Health check endpoint
  HEALTH_ENDPOINT: '/health',
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Health check interval in milliseconds
  HEALTH_CHECK_INTERVAL: 30000,
};

// App Configuration
export const APP_CONFIG = {
  // Application name
  NAME: 'CoC Platform',
  
  // Application version
  VERSION: '1.4.3',
  
  // Environment
  ENV: import.meta.env.MODE || 'development',
  
  // Is development mode
  IS_DEV: import.meta.env.DEV,
  
  // Is production mode
  IS_PROD: import.meta.env.PROD,
};

// Feature Flags
export const FEATURES = {
  // Enable/disable features based on environment
  SHOW_DEV_TOOLS: import.meta.env.DEV,
  ENABLE_ANALYTICS: import.meta.env.PROD,
};

// Swagger/API Documentation URLs
export const DOCS_CONFIG = {
  SWAGGER_URL: `${API_CONFIG.BACKEND_URL}/docs`,
  REDOC_URL: `${API_CONFIG.BACKEND_URL}/redoc`,
  OPENAPI_URL: `${API_CONFIG.BACKEND_URL}/openapi.json`,
};

// Export all configs as default
export default {
  api: API_CONFIG,
  app: APP_CONFIG,
  features: FEATURES,
  docs: DOCS_CONFIG,
};
