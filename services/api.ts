import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

// Base URL from Postman collection
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor - Add API key for auth routes, Bearer token for others
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Auth routes that use API key (public authentication endpoints)
    const apiKeyRoutes = ["/auth/login", "/auth/register", "/auth/verify-otp", "/auth/resend-otp", "/auth/reset-password"];
    const usesApiKey = apiKeyRoutes.some(route => config.url?.startsWith(route));
    
    console.log("🚀 API Request:", config.method?.toUpperCase(), config.url);
    console.log("🚀 Uses API Key:", usesApiKey);
    
    // Set default Content-Type to application/json if not already set
    // This allows multipart/form-data and other content types to work
    if (config.headers && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    
    if (usesApiKey) {
      // Public auth routes use API key
      if (API_KEY && config.headers) {
        config.headers["api-key"] = API_KEY;
        console.log("✅ Added api-key header");
      } else {
        console.warn("⚠️ No API_KEY found!");
      }
    } else {
      // All other routes (including /auth/check, /auth/logout) use Bearer token
      const token = Cookies.get("token");
      console.log("🔑 Token from cookie:", token ? `${token.substring(0, 20)}...` : "NOT FOUND");
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
        console.log("✅ Added Bearer token");
      } else {
        console.warn("⚠️ No token found in cookies!");
      }
    }
    
    console.log("🚀 Final Headers:", config.headers);
    console.log("🚀 Request Data:", config.data);
    
    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", response.status, response.config.url);
    return response;
  },
  (error: AxiosError) => {
    console.error("❌ Response error:", error.response?.status, error.config?.url);
    console.error("❌ Error details:", error.response?.data);
    
    if (error.response?.status === 401) {
      console.warn("⚠️ 401 Unauthorized - clearing token");
      // Only redirect if not already on login page
      const isLoginPage = typeof window !== "undefined" && window.location.pathname.startsWith("/login");
      if (!isLoginPage) {
        Cookies.remove("token");
        if (typeof window !== "undefined") {
          console.log("⚠️ Redirecting to login...");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

/**
 * Handle API errors consistently
 */
export function handleAPIError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    return (
      axiosError.response?.data?.message_en ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      "An unexpected error occurred"
    );
  }
  return "An unexpected error occurred";
}
