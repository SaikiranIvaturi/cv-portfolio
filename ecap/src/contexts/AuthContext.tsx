import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  OKTA_CONFIG,
  OKTA_METADATA,
  TOKEN_STORAGE_KEYS,
  IDLE_TIMEOUT_MS,
  storeAuthTokens,
  clearAuthData,
  isAuthenticated as checkIsAuthenticated,
  getAccessToken,
  getUserInfo as getStoredUserInfo,
} from "../config/okta";
import { UserRole } from "../types/user";

// ============================================================================
// TYPES
// ============================================================================

interface AuthUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  groups: string[];
  department?: string;
  accessToken: string;
  idToken: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
  getToken: () => string | null;
  handleCallback: (code: string, state: string) => Promise<void>;
}

// ============================================================================
// OKTA GROUP TO ROLE MAPPING
// ============================================================================

// Map OKTA groups (from filteredgroups claim) to app roles
const mapGroupsToRole = (
  groups: string[],
): { role: UserRole; hasValidGroup: boolean } => {
  // Check groups in order of priority (highest first)
  const groupLower = groups.map((g) => g.toLowerCase());

  console.log("[Auth] User groups:", groups);
  console.log("[Auth] Groups (lowercase):", groupLower);

  // COC ECAP DevOps Groups (highest priority)
  if (groupLower.some((g) => g.includes("coc_ecap_devops_nogbd"))) {
    console.log("[Auth] Matched COC_ECAP_DEVOPS_NOGBD - assigning DevOps role");
    return { role: "DevOps", hasValidGroup: true };
  }
  if (groupLower.some((g) => g.includes("coc_ecap_devops"))) {
    console.log("[Auth] Matched COC_ECAP_DEVOPS - assigning DevOps role");
    return { role: "DevOps", hasValidGroup: true };
  }

  // COC ECAP App Admin Groups
  if (groupLower.some((g) => g.includes("coc_ecap_app_admin"))) {
    console.log("[Auth] Matched COC_ECAP_APP_ADMIN - assigning App Admin role");
    return { role: "App Admin", hasValidGroup: true };
  }

  // COC PBI User Groups (Analysts)
  if (groupLower.some((g) => g.includes("coc_pbi_user_xm"))) {
    console.log("[Auth] Matched COC_PBI_USER_XM - assigning Analyst role");
    return { role: "Analyst", hasValidGroup: true };
  }
  if (groupLower.some((g) => g.includes("coc_pbi_user"))) {
    console.log("[Auth] Matched COC_PBI_USER - assigning Analyst role");
    return { role: "Analyst", hasValidGroup: true };
  }

  // COC ECAP Standard Users
  if (groupLower.some((g) => g.includes("coc_ecap_app_users"))) {
    console.log(
      "[Auth] Matched COC_ECAP_APP_USERS - assigning Standard User role",
    );
    return { role: "Standard User", hasValidGroup: true };
  }

  // No valid group found
  console.log("[Auth] No valid group match found - user not authorized");
  return { role: "Standard User", hasValidGroup: false };
};

// Map UserRole to RoleContext role (for UI permissions)
export const mapToUIRole = (
  role: UserRole,
): "business" | "developer" | "admin" | "architect" => {
  switch (role) {
    case "Executive Leadership":
    case "Senior Leadership":
    case "Management":
      return "business";
    case "Developer":
      return "developer";
    case "DevOps":
    case "App Admin":
    case "IT Team":
      return "admin";
    case "Analyst":
    case "Power User":
    case "Standard User":
    case "Viewer":
    case "Support":
    default:
      return "business";
  }
};

// ============================================================================
// PKCE HELPERS
// ============================================================================

// Generate random string for state/nonce
const generateRandomString = (length: number): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
};

// Generate PKCE code verifier
const generateCodeVerifier = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
};

// Generate PKCE code challenge from verifier
const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(digest));
};

// Base64 URL encode
const base64UrlEncode = (array: Uint8Array): string => {
  const base64 = btoa(String.fromCharCode(...array));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

// ============================================================================
// AUTH CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("[Auth] Initializing authentication...");
        const isAuth = checkIsAuthenticated();
        console.log("[Auth] Is authenticated:", isAuth);

        if (isAuth) {
          // Check last activity time - if user was idle for too long, don't restore session
          const lastActivityStr = sessionStorage.getItem("lastActivity");
          if (lastActivityStr) {
            const lastActivity = parseInt(lastActivityStr, 10);
            const timeSinceActivity = Date.now() - lastActivity;
            if (timeSinceActivity > IDLE_TIMEOUT_MS) {
              console.log(
                "[Auth] Session expired due to inactivity - clearing auth data",
              );
              clearAuthData();
              sessionStorage.removeItem("lastActivity");
              setIsLoading(false);
              return;
            }
          }

          const accessToken = getAccessToken();
          const storedUser = getStoredUserInfo();

          console.log("[Auth] Access token found:", !!accessToken);
          console.log("[Auth] Stored user found:", !!storedUser);

          if (accessToken && storedUser) {
            console.log("[Auth] Setting user from stored data:", storedUser);
            // Update lastActivity on session restore
            sessionStorage.setItem("lastActivity", Date.now().toString());
            setUser({
              id: (storedUser.sub as string) || "",
              email:
                (storedUser.email as string) ||
                (storedUser.mail as string) ||
                "",
              name:
                (storedUser.displayName as string) ||
                (storedUser.name as string) ||
                "",
              firstName:
                (storedUser.firstname as string) ||
                (storedUser.given_name as string) ||
                "",
              lastName:
                (storedUser.lastname as string) ||
                (storedUser.family_name as string) ||
                "",
              role: (storedUser.role as UserRole) || "Standard User",
              groups: (storedUser.groups as string[]) || [],
              department: storedUser.department as string,
              accessToken: accessToken,
              idToken: localStorage.getItem(TOKEN_STORAGE_KEYS.idToken) || "",
            });
          } else {
            console.log("[Auth] No valid authentication found");
          }
        } else {
          console.log("[Auth] No authentication detected");
        }
      } catch (err) {
        console.error("[Auth] Error initializing auth:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Logout
  const logout = useCallback(() => {
    try {
      console.log("[Auth] Logout initiated");

      // Clear all auth data
      clearAuthData();
      setUser(null);

      // Clear UI role
      localStorage.removeItem("userRole");

      // Clear OAuth parameters
      sessionStorage.removeItem("okta_code_verifier");
      sessionStorage.removeItem("okta_state");
      sessionStorage.removeItem("okta_nonce");

      // Clear any stored callback errors
      sessionStorage.removeItem("oktaCallbackError");

      // Clear lastActivity timestamp
      sessionStorage.removeItem("lastActivity");

      console.log("[Auth] All session data cleared, redirecting to login page");

      // Note: OKTA logout endpoint is blocked by network firewall
      // Performing local logout only - user session is cleared from app
      window.location.replace("/");
    } catch (error) {
      console.error("[Auth] Error during logout:", error);
      // Force redirect even on error
      window.location.replace("/");
    }
  }, []);

  // Token expiry polling - check every 60 seconds if token is still valid
  useEffect(() => {
    if (!user) return;

    console.log("[Auth] Starting token expiry polling");

    const checkTokenExpiry = () => {
      const isValid = checkIsAuthenticated();
      if (!isValid) {
        console.log("[Auth] Token expired - automatically logging out");
        logout();
      }
    };

    // Check every 60 seconds
    const intervalId = setInterval(checkTokenExpiry, 60000);

    // Cleanup on unmount or when user changes
    return () => {
      console.log("[Auth] Stopping token expiry polling");
      clearInterval(intervalId);
    };
  }, [user, logout]);

  // Initiate OKTA login
  const login = useCallback(async () => {
    try {
      setError(null);

      console.log("[Auth] Starting login flow...");
      console.log("[Auth] Current hostname:", window.location.hostname);
      console.log("[Auth] Redirect URI from config:", OKTA_CONFIG.redirectUri);

      // Clear any existing local auth data to ensure fresh login
      clearAuthData();
      sessionStorage.removeItem("okta_code_verifier");
      sessionStorage.removeItem("okta_state");
      sessionStorage.removeItem("okta_nonce");

      // Generate PKCE values
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const state = generateRandomString(16);
      const nonce = generateRandomString(16);

      // Store PKCE verifier and state for callback (using sessionStorage for better security)
      sessionStorage.setItem("okta_code_verifier", codeVerifier);
      sessionStorage.setItem("okta_state", state);
      sessionStorage.setItem("okta_nonce", nonce);

      // Build authorization URL
      const params = new URLSearchParams({
        client_id: OKTA_CONFIG.clientId,
        redirect_uri: OKTA_CONFIG.redirectUri,
        response_type: OKTA_CONFIG.responseType,
        scope: OKTA_CONFIG.scopes.join(" "),
        state: state,
        nonce: nonce,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
      });

      const authUrl = `${OKTA_METADATA.authorization_endpoint}?${params.toString()}`;

      // Redirect to OKTA - use replace to prevent back button navigation
      window.location.replace(authUrl);
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to initiate login");
    }
  }, []);

  // Handle OKTA callback
  const handleCallback = useCallback(async (code: string, state: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Verify state
      const storedState = sessionStorage.getItem("okta_state");
      console.log("[Auth] State validation:");
      console.log("[Auth] - Received state:", state);
      console.log("[Auth] - Stored state:", storedState);
      console.log("[Auth] - Match:", state === storedState);

      // Only validate state if it exists in storage
      // In development, React Strict Mode can cause sessionStorage to be cleared
      if (storedState && state !== storedState) {
        console.error("[Auth] State mismatch detected!");
        throw new Error("Invalid state parameter");
      } else if (!storedState) {
        console.warn(
          "[Auth] State not found in sessionStorage - proceeding anyway (dev mode)",
        );
      } else {
        console.log("[Auth] State validation passed");
      }

      // Get PKCE verifier
      const codeVerifier = sessionStorage.getItem("okta_code_verifier");
      if (!codeVerifier) {
        console.error("[Auth] Code verifier not found in sessionStorage");
        throw new Error("Missing code verifier");
      }

      console.log("[Auth] Token exchange request:");
      console.log("[Auth] - Using backend proxy endpoint");
      console.log("[Auth] - Redirect URI:", OKTA_CONFIG.redirectUri);
      console.log("[Auth] - Code:", code.substring(0, 20) + "...");
      console.log(
        "[Auth] - Code verifier:",
        codeVerifier.substring(0, 20) + "...",
      );

      // Exchange code for tokens via backend proxy (securely handles client secret)
      const { API_BASE_URL } = await import("../config/api");
      console.log("[Auth] - Backend URL:", API_BASE_URL);
      const tokenResponse = await fetch(`${API_BASE_URL}/api/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          redirect_uri: OKTA_CONFIG.redirectUri,
          code_verifier: codeVerifier,
        }),
      });

      console.log("[Auth] Token response status:", tokenResponse.status);

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData.error_description || "Token exchange failed");
      }

      const tokens = await tokenResponse.json();

      // Parse ID token to get user info
      const idTokenPayload = parseJwt(tokens.id_token);

      // Get groups from token (filteredgroups claim)
      const groups: string[] =
        (idTokenPayload.filteredgroups as string[]) ||
        (idTokenPayload.groups as string[]) ||
        [];
      const roleResult = mapGroupsToRole(groups);

      // Check if user has valid group membership
      if (!roleResult.hasValidGroup) {
        console.error(
          "[Auth] User not authorized - missing required AD group membership",
        );
        throw new Error(
          "Access denied: You are not a member of the required Active Directory groups for this application. Please contact your system administrator to request access to one of the following groups:\n\n• COC_ECAP_DEVOPS_NOGBD_DEV (Developer access)\n• COC_ECAP_DEVOPS_DEV (Developer access)\n• COC_ECAP_APP_USERS_DEV (Business User access)",
        );
      }

      // Build user object
      const authUser: AuthUser = {
        id: String(idTokenPayload.sub || ""),
        email: String(
          idTokenPayload.email ||
            idTokenPayload.mail ||
            idTokenPayload.preferred_username ||
            "",
        ),
        name: String(
          idTokenPayload.displayName ||
            idTokenPayload.name ||
            `${idTokenPayload.firstname || idTokenPayload.given_name || ""} ${idTokenPayload.lastname || idTokenPayload.family_name || ""}`.trim(),
        ),
        firstName: String(
          idTokenPayload.firstname || idTokenPayload.given_name || "",
        ),
        lastName: String(
          idTokenPayload.lastname || idTokenPayload.family_name || "",
        ),
        role: roleResult.role,
        groups: groups,
        department: idTokenPayload.department as string | undefined,
        accessToken: tokens.access_token,
        idToken: tokens.id_token,
      };

      // Store tokens
      storeAuthTokens(
        tokens.access_token,
        tokens.id_token,
        tokens.expires_in,
        tokens.refresh_token,
        {
          ...idTokenPayload,
          role: roleResult.role,
          groups: groups,
        },
      );

      // Update UI role in localStorage (for RoleContext)
      const uiRole = mapToUIRole(roleResult.role);
      localStorage.setItem("userRole", uiRole);

      // Initialize lastActivity timestamp for idle timeout tracking
      sessionStorage.setItem("lastActivity", Date.now().toString());

      // Clean up PKCE storage
      sessionStorage.removeItem("okta_code_verifier");
      sessionStorage.removeItem("okta_state");
      sessionStorage.removeItem("okta_nonce");

      setUser(authUser);

      console.log(
        "[Auth] Login successful:",
        authUser.email,
        "Role:",
        roleResult.role,
      );
    } catch (err) {
      console.error("Callback error:", err);
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get current access token
  const getToken = useCallback(() => {
    return user?.accessToken || getAccessToken();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        getToken,
        handleCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Parse JWT token
function parseJwt(token: string): Record<string, unknown> {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
