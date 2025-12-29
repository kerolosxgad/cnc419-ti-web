// ============================================
// IOC (Indicator of Compromise) Types
// ============================================

export type IOCType = "ipv4" | "domain" | "url" | "md5" | "sha256" | "email" | "hostname" | "yara" | "cve";

export type SeverityLevel = "critical" | "high" | "medium" | "low" | "info";

export interface IOC {
  id: number;
  type: IOCType;
  value: string;
  description: string;
  source: string;
  fingerprint: string;
  observedCount: number;
  firstSeen: string;
  lastSeen: string;
  raw: {
    type: IOCType;
    value: string;
    source: string;
    description: string;
    firstSeen: string;
    lastSeen: string;
    confidence: number;
    tags: string[];
  };
  severity: SeverityLevel;
  confidence: number;
  tags: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// User Types
// ============================================

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  dialCode: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female";
  role: "user" | "admin";
  image: string | null;
  status: "active" | "inactive";
  isBanned: boolean;
  createdAt: string;
}

// ============================================
// Auth Types
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message_en: string;
  message_ar: string;
  user: User;
  token: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  countryCode: string;
  dialCode: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female";
}

export interface RegisterResponse {
  message_en: string;
  message_ar: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  message_en: string;
  message_ar: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message_en: string;
  message_ar: string;
}

export interface CheckAuthResponse {
  authorized: boolean;
  user: User;
}

// ============================================
// User Management Types
// ============================================

export interface UpdateUserRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  dialCode: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female";
}

export interface UpdateUserResponse {
  message_en: string;
  message_ar: string;
}

export interface UpdateImageRequest {
  username: string;
  image: File;
}

export interface UpdateImageResponse {
  message_en: string;
  message_ar: string;
}

export interface DeleteUserRequest {
  username: string;
}

export interface DeleteUserResponse {
  message: string;
}

export interface GetUserRequest {
  username: string;
}

export interface GetUserResponse {
  message_en: string;
  message_ar: string;
  userData: User;
}

// ============================================
// Threat Intelligence Types
// ============================================

export interface SearchIOCRequest {
  query?: string;
  type?: IOCType;
  severity?: SeverityLevel;
  source?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface SearchIOCResponse {
  success: boolean;
  total: number;
  limit: number;
  offset: number;
  results: IOC[];
}

export interface FetchIOCRequest {
  id: number;
}

export interface FetchIOCResponse {
  success: boolean;
  ioc: IOC;
}

export interface CorrelateRequest {
  iocId: number;
  lookbackDays?: number;
}

export interface CorrelationResult {
  relatedIOCs: IOC[];
  commonSources: string[];
  temporalProximity: number;
}

// ============================================
// Reports & Statistics Types
// ============================================

export interface IngestReport {
  success: boolean;
  report: {
    metadata: {
      generatedAt: string;
      startDate: string;
      endDate: string;
    };
    summary: {
      totalIOCs: number;
      newInPeriod: number;
      highRiskPercentage: number;
      activeSources: number;
    };
    severity: {
      breakdown: {
        critical: number;
        high: number;
        medium: number;
        low: number;
        info: number;
      };
      critical: number;
      high: number;
      medium: number;
      low: number;
      info: number;
    };
    types: Record<IOCType, number>;
    sources: Record<string, number>;
    topThreats: IOC[];
    dataQuality: {
      averageConfidence: number;
      multiSourceIOCs: number;
    };
    feedStatus: {
      sources: FeedSource[];
    };
  };
}

export interface FeedSource {
  name: string;
  key?: string;
  enabled?: boolean;
  lastFetch: string;
  status: string;
  count: number;
  error?: string | null;
  ttl?: number;
  nextFetch?: string;
}

export interface FetchStatusResponse {
  success: boolean;
  fetchStatus: {
    lastUpdate: string;
    sources: FeedSource[];
  };
}

export interface StatisticsResponse {
  success: boolean;
  statistics: {
    totalIOCs: number;
    severityBreakdown: Record<SeverityLevel, number>;
    typeBreakdown: Record<IOCType, number>;
    sourceBreakdown: Record<string, number>;
    timeSeriesData: {
      date: string;
      count: number;
    }[];
  };
}

// ============================================
// UI Component Types
// ============================================

export interface DashboardKPIs {
  totalIOCs: number;
  criticalThreats: number;
  highSeverityThreats: number;
  activeFeeds: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  count: number;
  critical?: number;
  high?: number;
  medium?: number;
  low?: number;
}

// ============================================
// API Response Wrapper
// ============================================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message_en?: string;
  message_ar?: string;
  error?: string;
}
