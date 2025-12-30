import apiClient, { handleAPIError } from "./api";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  CheckAuthResponse,
  User,
} from "@/types";
import Cookies from "js-cookie";

/**
 * Login user
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<LoginResponse>("/auth/login", data);
    
    // Store token in cookie (7 days) - ensure it's accessible by the server
    Cookies.set("token", response.data.token, { 
      expires: 7, 
      path: '/',
      sameSite: 'lax' 
    });
    
    return response.data;
  } catch (error) {
    console.error("🔑 Auth service - error:", error);
    throw new Error(handleAPIError(error));
  }
}

/**
 * Register new user
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await apiClient.post<RegisterResponse>("/auth/register", data);
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error));
  }
}

/**
 * Verify OTP
 */
export async function verifyOTP(data: VerifyOTPRequest): Promise<VerifyOTPResponse> {
  try {
    const response = await apiClient.post<VerifyOTPResponse>("/auth/verify-otp", data);
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error));
  }
}

/**
 * Resend OTP
 */
export async function resendOTP(email: string): Promise<{ message: string }> {
  try {
    const response = await apiClient.post("/auth/resend-otp", { email });
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error));
  }
}

/**
 * Reset password
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  try {
    const response = await apiClient.post<ResetPasswordResponse>("/auth/reset-password", data);
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error));
  }
}

/**
 * Check authentication status
 */
export async function checkAuth(): Promise<CheckAuthResponse | null> {
  try {
    const token = Cookies.get("token");
    if (!token) return null;

    const response = await apiClient.get<CheckAuthResponse>("/auth/check");
    return response.data;
  } catch (error) {
    Cookies.remove("token");
    return null;
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    Cookies.remove("token");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
}

/**
 * Get current user from cookie/storage
 */
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Save user to local storage
 */
export function saveUser(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
}

/**
 * Clear user from local storage
 */
export function clearUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!Cookies.get("token");
}
