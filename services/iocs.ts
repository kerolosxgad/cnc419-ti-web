import apiClient, { handleAPIError } from "./api";
import {
  SearchIOCRequest,
  SearchIOCResponse,
  FetchIOCRequest,
  FetchIOCResponse,
  IngestReport,
  FetchStatusResponse,
  StatisticsResponse,
} from "@/types";

/**
 * Search IOCs with filters
 */
export async function searchIOCs(params: SearchIOCRequest = {}): Promise<SearchIOCResponse> {
  try {
    const response = await apiClient.post<SearchIOCResponse>("/threat-intel/search", params);
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error));
  }
}

/**
 * Fetch specific IOC by ID
 */
export async function fetchIOC(id: number): Promise<FetchIOCResponse> {
  try {
    const response = await apiClient.post<FetchIOCResponse>("/threat-intel/ioc", { id });
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error));
  }
}

/**
 * Correlate IOC with related indicators
 */
export async function correlateIOC(iocId: number, lookbackDays: number = 7): Promise<any> {
  try {
    const response = await apiClient.post("/threat-intel/correlate", {
      iocId,
      lookbackDays,
    });
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error));
  }
}

/**
 * Get report summary (admin only)
 */
export async function getReportSummary(timeRange: string = "7d"): Promise<IngestReport> {
  try {
    const response = await apiClient.post<IngestReport>("/threat-intel/report-summary", {
      timeRange
    });
    return response.data;
  } catch (error) {
    console.error("📊 Report error:", error);
    throw new Error(handleAPIError(error));
  }
}

/**
 * Get statistics
 */
export async function getStatistics(): Promise<StatisticsResponse> {
  try {
    const response = await apiClient.get<StatisticsResponse>("/threat-intel/statistics");
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error));
  }
}

/**
 * Trigger IOC ingestion (admin only)
 */
export async function triggerIngest(): Promise<IngestReport> {
  try {
    const response = await apiClient.post<IngestReport>("/threat-intel/ingest");
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error));
  }
}

/**
 * Get feed status (admin only)
 */
export async function getFetchStatus(): Promise<FetchStatusResponse> {
  try {
    const response = await apiClient.get<FetchStatusResponse>("/threat-intel/fetch-status");
    return response.data;
  } catch (error) {
    throw new Error(handleAPIError(error));
  }
}
