"use client";

import { useEffect, useState } from "react";
import { getReportSummary, getFetchStatus } from "@/services/iocs";
import { IngestReport } from "@/types";
import { SeverityDistributionChart } from "@/components/charts/SeverityDistributionChart";
import { TypeBreakdownChart } from "@/components/charts/TypeBreakdownChart";
import { TimeSeriesChart } from "@/components/charts/TimeSeriesChart";
import { SkeletonChart } from "@/components/ui/Skeleton";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Shield,
  Activity,
  Database,
  AlertTriangle,
} from "lucide-react";
import { formatNumber, formatDate, getIOCTypeLabel, exportToCSV, exportToJSON } from "@/utils/helpers";

export default function ReportsPage() {
  const [report, setReport] = useState<IngestReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await getReportSummary();
      setReport(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    if (report) {
      exportToJSON(report.report, `threat-report-${Date.now()}`);
    }
  };

  const handleExportTopThreats = () => {
    if (report) {
      const data = report.report.topThreats.map((threat) => ({
        id: threat.id,
        type: threat.type,
        value: threat.value,
        severity: threat.severity,
        confidence: threat.confidence,
        source: threat.source,
        description: threat.description,
        observedCount: threat.observedCount,
        lastSeen: threat.lastSeen,
      }));
      exportToCSV(data, `top-threats-${Date.now()}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Threat Intelligence Reports</h1>
          <p className="text-gray-400">Comprehensive threat analysis and statistics</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-severity-high mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Failed to Load Report</h2>
          <p className="text-gray-400 mb-4">{error || "Unable to fetch report data"}</p>
          <button onClick={loadReport} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { metadata, summary, severity, types, sources, topThreats, dataQuality, feedStatus } = report.report;

  // Prepare chart data
  const severityData = [
    { name: "Critical", value: severity.critical, severity: "critical" as const },
    { name: "High", value: severity.high, severity: "high" as const },
    { name: "Medium", value: severity.medium, severity: "medium" as const },
    { name: "Low", value: severity.low, severity: "low" as const },
    { name: "Info", value: severity.info, severity: "info" as const },
  ].filter((item) => item.value > 0);

  const typeData = Object.entries(types)
    .map(([name, value]) => ({
      name: getIOCTypeLabel(name as any),
      value,
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const sourceData = Object.entries(sources)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Mock time series for demonstration
  const timeSeriesData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
    count: Math.floor(Math.random() * 500) + 100,
    critical: Math.floor(Math.random() * 50),
    high: Math.floor(Math.random() * 100),
    medium: Math.floor(Math.random() * 200),
    low: Math.floor(Math.random() * 150),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Threat Intelligence Reports</h1>
          <p className="text-gray-400">Comprehensive threat analysis and statistics</p>
        </div>
        <button onClick={handleExportReport} className="btn btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Full Report
        </button>
      </div>

      {/* Report Metadata */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent-blue/20 rounded-lg">
              <FileText className="w-6 h-6 text-accent-blue" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Weekly Threat Report</h2>
              <p className="text-sm text-gray-400">Generated: {formatDate(metadata.generatedAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {formatDate(metadata.startDate)} - {formatDate(metadata.endDate)}
            </span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-background-secondary rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Database className="w-4 h-4" />
              <p className="text-sm">Total IOCs</p>
            </div>
            <p className="text-3xl font-bold text-white">{formatNumber(summary.totalIOCs)}</p>
            <p className="text-xs text-severity-low mt-1">+{formatNumber(summary.newInPeriod)} new</p>
          </div>

          <div className="p-4 bg-background-secondary rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <p className="text-sm">High Risk</p>
            </div>
            <p className="text-3xl font-bold text-severity-critical">{summary.highRiskPercentage}%</p>
            <p className="text-xs text-gray-500 mt-1">Critical + High</p>
          </div>

          <div className="p-4 bg-background-secondary rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Activity className="w-4 h-4" />
              <p className="text-sm">Active Sources</p>
            </div>
            <p className="text-3xl font-bold text-accent-blue">{summary.activeSources}</p>
            <p className="text-xs text-gray-500 mt-1">Threat feeds</p>
          </div>

          <div className="p-4 bg-background-secondary rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Shield className="w-4 h-4" />
              <p className="text-sm">Avg Confidence</p>
            </div>
            <p className="text-3xl font-bold text-severity-low">{dataQuality.averageConfidence}%</p>
            <p className="text-xs text-gray-500 mt-1">Data quality</p>
          </div>
        </div>
      </div>

      {/* Time Range Filter */}
      <div className="card">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Threat Trends</h3>
          <div className="flex gap-2">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? "bg-accent-blue text-white"
                    : "bg-card-hover text-gray-400 hover:text-white"
                }`}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>
        </div>
        <div className="h-80 mt-6">
          <TimeSeriesChart data={timeSeriesData} />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Severity Distribution</h3>
          <div className="h-80">
            <SeverityDistributionChart data={severityData} />
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2 text-center">
            {severityData.map((item) => (
              <div key={item.name} className="p-2 bg-background-secondary rounded">
                <p className="text-xs text-gray-400">{item.name}</p>
                <p className="text-lg font-bold text-white">{formatNumber(item.value)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* IOC Type Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">IOC Type Distribution</h3>
          <div className="h-80">
            <TypeBreakdownChart data={typeData} />
          </div>
        </div>
      </div>

      {/* Source Contributions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Threat Feed Contributions</h3>
          <TrendingUp className="w-5 h-5 text-accent-blue" />
        </div>
        <div className="space-y-3">
          {sourceData.map((source, index) => {
            const percentage = (source.value / summary.totalIOCs) * 100;
            return (
              <div key={source.name} className="p-4 bg-background-secondary rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-accent-blue">#{index + 1}</span>
                    <span className="text-white font-medium">{source.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{formatNumber(source.value)}</p>
                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="w-full bg-card-hover rounded-full h-2">
                  <div
                    className="bg-accent-blue h-full rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Threats Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Top Critical Threats</h3>
          <button onClick={handleExportTopThreats} className="btn btn-secondary flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-sm font-semibold text-gray-400">Type</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-400">Value</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-400">Severity</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-400">Source</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-400">Confidence</th>
                <th className="text-left p-3 text-sm font-semibold text-gray-400">Description</th>
              </tr>
            </thead>
            <tbody>
              {topThreats.slice(0, 15).map((threat) => (
                <tr key={threat.id} className="border-b border-border hover:bg-card-hover">
                  <td className="p-3">
                    <span className="text-xs px-2 py-1 bg-accent-blue/20 text-accent-blue rounded">
                      {getIOCTypeLabel(threat.type)}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-sm text-white truncate max-w-xs">{threat.value}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        threat.severity === "critical"
                          ? "bg-severity-critical/20 text-severity-critical"
                          : "bg-severity-high/20 text-severity-high"
                      }`}
                    >
                      {threat.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-400">{threat.source}</td>
                  <td className="p-3 text-sm text-gray-400">{threat.confidence}%</td>
                  <td className="p-3 text-sm text-gray-400 truncate max-w-md">{threat.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feed Status */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Threat Feed Health Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feedStatus.sources.map((source) => (
            <div key={source.name} className="p-4 bg-background-secondary rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      source.status === "success" ? "bg-severity-low animate-pulse-slow" : "bg-severity-critical"
                    }`}
                  />
                  <p className="font-medium text-white">{source.name}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    source.status === "success"
                      ? "bg-severity-low/20 text-severity-low"
                      : "bg-severity-critical/20 text-severity-critical"
                  }`}
                >
                  {source.status}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">IOCs:</span>
                  <span className="text-white font-semibold">{formatNumber(source.count)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Fetch:</span>
                  <span className="text-white text-xs">{formatDate(source.lastFetch)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
