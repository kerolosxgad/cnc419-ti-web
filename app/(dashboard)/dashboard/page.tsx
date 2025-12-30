"use client";

import { useEffect, useState } from "react";
import { KPICard } from "@/components/ui/KPICard";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { SeverityDistributionChart } from "@/components/charts/SeverityDistributionChart";
import { TypeBreakdownChart } from "@/components/charts/TypeBreakdownChart";
import { TimeSeriesChart } from "@/components/charts/TimeSeriesChart";
import { SkeletonCard, SkeletonChart, SkeletonTable } from "@/components/ui/Skeleton";
import { getReportSummary, getFetchStatus } from "@/services/iocs";
import { IngestReport } from "@/types";
import { Shield, AlertTriangle, Activity, Database, TrendingUp } from "lucide-react";
import { formatNumber, formatRelativeTime, getIOCTypeLabel } from "@/utils/helpers";
import Link from "next/link";

export default function DashboardPage() {
  const [report, setReport] = useState<IngestReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "90d">("7d");

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getReportSummary(timeRange);
      setReport(data);
    } catch (err: any) {
      console.error("📊 Dashboard error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Real-time threat intelligence monitoring</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
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
          <h2 className="text-xl font-bold text-white mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-400 mb-4">{error || "Unable to fetch dashboard data"}</p>
          <button onClick={loadDashboardData} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { summary, severity, types, sources, topThreats, feedStatus } = report.report;

  // Time range options
  const timeRangeOptions = [
    { value: "24h", label: "Last 24 Hours" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 90 Days" },
  ];

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
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Mock time series data (you can replace with actual API data)
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
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Real-time threat intelligence monitoring</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Time Range:</span>
          <div className="flex gap-2">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === option.value
                    ? "bg-accent-blue text-white"
                    : "bg-card text-gray-400 hover:text-white hover:bg-card-hover"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total IOCs"
          value={formatNumber(summary.totalIOCs)}
          icon={Database}
          color="blue"
        />
        <KPICard
          title="Critical Threats"
          value={formatNumber(severity.critical)}
          icon={AlertTriangle}
          color="red"
        />
        <KPICard
          title="High Severity"
          value={formatNumber(severity.high)}
          icon={Shield}
          color="orange"
        />
        <KPICard
          title="Active Sources"
          value={summary.activeSources}
          icon={Activity}
          color="green"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Severity Distribution</h3>
          <div className="h-80">
            <SeverityDistributionChart data={severityData} />
          </div>
        </div>

        {/* IOC Type Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">IOC Type Breakdown</h3>
          <div className="h-80">
            <TypeBreakdownChart data={typeData} />
          </div>
        </div>
      </div>

      {/* Time Series */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Threat Trends (Last 7 Days)</h3>
          <TrendingUp className="w-5 h-5 text-accent-blue" />
        </div>
        <div className="h-80">
          <TimeSeriesChart data={timeSeriesData} />
        </div>
      </div>

      {/* Recent Threats & Feed Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Critical Threats */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Top Critical Threats</h3>
          <div className="space-y-3">
            {topThreats.slice(0, 5).map((threat) => (
              <Link
                key={threat.id}
                href={`/iocs/${threat.id}`}
                className="block p-4 bg-background-secondary rounded-lg hover:bg-card-hover transition-all duration-200 border border-border hover:border-border-glow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <SeverityBadge severity={threat.severity} />
                      <span className="text-xs text-gray-500">{threat.type.toUpperCase()}</span>
                    </div>
                    <p className="text-sm font-mono text-white truncate">{threat.value}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{threat.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-500">{formatRelativeTime(threat.lastSeen)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/iocs" className="btn btn-secondary w-full mt-4 flex items-center justify-center">
            View All IOCs
          </Link>
        </div>

        {/* Feed Status */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Threat Feed Status</h3>
          <div className="space-y-3">
            {feedStatus.sources.slice(0, 8).map((source) => (
              <div
                key={source.name}
                className="flex items-center justify-between p-3 bg-background-secondary rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      source.status === "success" ? "bg-severity-low" : "bg-severity-critical"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{source.name}</p>
                    <p className="text-xs text-gray-500">{formatRelativeTime(source.lastFetch)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-accent-blue">{formatNumber(source.count)}</p>
                  <p className="text-xs text-gray-500">IOCs</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sources Overview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Source Contributions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(sources)
            .sort(([, a], [, b]) => b - a)
            .map(([source, count]) => (
              <div key={source} className="p-4 bg-background-secondary rounded-lg text-center">
                <p className="text-2xl font-bold text-accent-blue mb-1">{formatNumber(count)}</p>
                <p className="text-sm text-gray-400">{source}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
