// OKTA Configuration for CoC Platform
// Using shared credentials with Ideation Engine app

// Environment detection - returns current environment dynamically
const getEnvironment = () => {
  if (typeof window === 'undefined') return 'local';
  const hostname = window.location.hostname;
  if (hostname.includes('dev.coc.ecap.elevate.elevancehealth.com')) return 'dev';
  return 'local';
};

// Environment-specific configuration
const ENV_CONFIG = {
  local: {
    baseUrl: 'http://localhost:9001'
  },
  dev: {
    baseUrl: 'https://dev.coc.ecap.elevate.elevancehealth.com'
  }
};

// Get current environment config dynamically
const getCurrentEnvConfig = () => {
  const env = getEnvironment();
  console.log('[OKTA Config] Detected environment:', env);
  console.log('[OKTA Config] Using base URL:', ENV_CONFIG[env].baseUrl);
  return ENV_CONFIG[env];
};

export const OKTA_CONFIG = {
  // OKTA Authorization Server for Ecap-Elevate _DEV_AWSAPM1010032
  issuer: 'https://portalssoqa.elevancehealth.com/oauth2/ausefjy7k3J5S1AXz297',
  
  // Client ID for Ecap-Elevate _DEV_AWSAPM1010032
  clientId: '0oa122kkw5hvILCuV298',
  
  
  // Redirect URI - automatically switches based on environment
  get redirectUri() {
    return `${getCurrentEnvConfig().baseUrl}/callback`;
  },
  
  // Post-logout redirect (computed at runtime)
  get postLogoutRedirectUri() {
    return typeof window !== 'undefined' ? window.location.origin : getCurrentEnvConfig().baseUrl;
  },
  
  // OAuth scopes
  scopes: ['openid', 'ehprofile', 'filteredgroups', 'department'],
  
  // Use PKCE (required for SPAs)
  pkce: true,
  
  // Response type
  responseType: 'code',
  
  // Token storage location
  tokenManager: {
    storage: 'sessionStorage', // Using sessionStorage for better security
    autoRenew: true,
    expireEarlySeconds: 120 // Renew 2 minutes before expiry
  }
};

// OIDC Metadata endpoints (for manual token operations if needed)
export const OKTA_METADATA = {
  issuer: OKTA_CONFIG.issuer,
  jwks_uri: `${OKTA_CONFIG.issuer}/v1/keys`,
  authorization_endpoint: `${OKTA_CONFIG.issuer}/v1/authorize`,
  token_endpoint: `${OKTA_CONFIG.issuer}/v1/token`,
  userinfo_endpoint: `${OKTA_CONFIG.issuer}/v1/userinfo`,
  end_session_endpoint: `${OKTA_CONFIG.issuer}/v1/logout`,
  revocation_endpoint: `${OKTA_CONFIG.issuer}/v1/revoke`,
  introspection_endpoint: `${OKTA_CONFIG.issuer}/v1/introspect`
};

// Session timeout constants (reduced for testing)
export const IDLE_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes of inactivity (testing: was 15 min)
export const IDLE_WARNING_MS = 1.5 * 60 * 1000; // Warn at 1.5 min, giving 30 sec to respond (testing: was 13 min)

// Token storage keys
export const TOKEN_STORAGE_KEYS = {
  accessToken: 'coc-okta-access-token',
  idToken: 'coc-okta-id-token',
  refreshToken: 'coc-okta-refresh-token',
  tokenExpiry: 'coc-okta-token-expiry',
  userInfo: 'coc-okta-user-info'
};

// Helper to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = sessionStorage.getItem(TOKEN_STORAGE_KEYS.accessToken);
  const expiry = sessionStorage.getItem(TOKEN_STORAGE_KEYS.tokenExpiry);
  
  if (!token || !expiry) return false;
  
  // Check if token is expired
  const expiryTime = parseInt(expiry, 10);
  return Date.now() < expiryTime;
};

// Helper to get current access token
export const getAccessToken = (): string | null => {
  if (!isAuthenticated()) return null;
  return sessionStorage.getItem(TOKEN_STORAGE_KEYS.accessToken);
};

// Helper to get current user info
export const getUserInfo = (): Record<string, unknown> | null => {
  const userInfo = sessionStorage.getItem(TOKEN_STORAGE_KEYS.userInfo);
  if (!userInfo) return null;
  try {
    return JSON.parse(userInfo);
  } catch {
    return null;
  }
};

// Helper to clear all auth data (logout)
export const clearAuthData = (): void => {
  Object.values(TOKEN_STORAGE_KEYS).forEach(key => {
    sessionStorage.removeItem(key);
  });
};

// Helper to store auth tokens after login
export const storeAuthTokens = (
  accessToken: string,
  idToken: string,
  expiresIn: number,
  refreshToken?: string,
  userInfo?: Record<string, unknown>
): void => {
  console.log('[Storage] Storing auth tokens...');
  console.log('[Storage] Access token:', accessToken?.substring(0, 20) + '...');
  console.log('[Storage] ID token:', idToken?.substring(0, 20) + '...');
  console.log('[Storage] Expires in:', expiresIn);
  
  sessionStorage.setItem(TOKEN_STORAGE_KEYS.accessToken, accessToken);
  sessionStorage.setItem(TOKEN_STORAGE_KEYS.idToken, idToken);
  sessionStorage.setItem(TOKEN_STORAGE_KEYS.tokenExpiry, String(Date.now() + expiresIn * 1000));
  
  if (refreshToken) {
    sessionStorage.setItem(TOKEN_STORAGE_KEYS.refreshToken, refreshToken);
  }
  
  if (userInfo) {
    sessionStorage.setItem(TOKEN_STORAGE_KEYS.userInfo, JSON.stringify(userInfo));
  }
  
  console.log('[Storage] Tokens stored successfully');
  console.log('[Storage] sessionStorage keys:', Object.keys(sessionStorage));
};
