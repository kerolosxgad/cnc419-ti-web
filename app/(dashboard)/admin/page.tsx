"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/services/auth";
import { triggerIngest, getFetchStatus } from "@/services/iocs";
import { FeedSource } from "@/types";
import { Shield, RefreshCw, Database, CheckCircle, XCircle, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(getCurrentUser());
  const [feeds, setFeeds] = useState<FeedSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [ingesting, setIngesting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    loadFeedStatus();
  }, [user, router]);

  const loadFeedStatus = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getFetchStatus();
      setFeeds(response.fetchStatus.sources);
      setLastUpdate(response.fetchStatus.lastUpdate);
    } catch (err: any) {
      setError(err.message || "Failed to load feed status");
    } finally {
      setLoading(false);
    }
  };

  const handleIngest = async () => {
    try {
      setIngesting(true);
      setError("");
      setSuccess("");
      await triggerIngest();
      setSuccess("Ingestion triggered successfully! Feeds are being updated.");
      // Reload status after 3 seconds
      setTimeout(() => {
        loadFeedStatus();
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to trigger ingestion");
    } finally {
      setIngesting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "text-green-500";
      case "error":
      case "failed":
        return "text-severity-critical";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
      case "failed":
        return <XCircle className="w-5 h-5 text-severity-critical" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const totalFeeds = feeds.length;
  const activeFeeds = feeds.filter((f) => f.status === "success").length;
  const totalIOCs = feeds.reduce((sum, f) => sum + (f.count || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-2 bg-accent-blue/20 rounded-lg">
              <Shield className="w-8 h-8 text-accent-blue" />
            </div>
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Manage threat intelligence feeds and ingestion</p>
        </div>
        <button
          onClick={handleIngest}
          disabled={ingesting}
          className="relative inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-accent-blue/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-accent-purple to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative flex items-center gap-2">
            {ingesting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Ingesting...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Trigger Ingestion
              </>
            )}
          </span>
        </button>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="bg-severity-critical/10 border border-severity-critical/50 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top duration-300">
          <AlertTriangle className="w-5 h-5 text-severity-critical flex-shrink-0 mt-0.5" />
          <p className="text-sm text-severity-critical">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top duration-300">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-500">{success}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card hover:shadow-xl hover:shadow-accent-blue/5 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Total Feeds</p>
            <Database className="w-5 h-5 text-accent-blue" />
          </div>
          <p className="text-3xl font-bold text-white">{totalFeeds}</p>
          <p className="text-sm text-green-500 mt-1">{activeFeeds} active</p>
        </div>

        <div className="card hover:shadow-xl hover:shadow-accent-blue/5 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Total IOCs</p>
            <TrendingUp className="w-5 h-5 text-accent-purple" />
          </div>
          <p className="text-3xl font-bold text-white">{totalIOCs.toLocaleString()}</p>
          <p className="text-sm text-gray-400 mt-1">Across all feeds</p>
        </div>

        <div className="card hover:shadow-xl hover:shadow-accent-blue/5 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Last Update</p>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-white">{lastUpdate ? formatDate(lastUpdate) : "N/A"}</p>
          <button
            onClick={loadFeedStatus}
            className="text-sm text-accent-blue hover:text-accent-purple mt-1 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>
      </div>

      {/* Feed Status Table */}
      <div className="card hover:shadow-xl hover:shadow-accent-blue/5 transition-all duration-300">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <div className="p-2 bg-accent-blue/20 rounded-lg">
            <Database className="w-5 h-5 text-accent-blue" />
          </div>
          Threat Intelligence Feeds
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Feed Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">IOC Count</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Last Fetch</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Next Fetch</th>
              </tr>
            </thead>
            <tbody>
              {feeds.map((feed, index) => (
                <tr
                  key={index}
                  className="border-b border-border/50 hover:bg-card-hover transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {feed.enabled ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-500" />
                      )}
                      <span className="text-white font-medium">{feed.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(feed.status)}
                      <span className={`text-sm font-medium ${getStatusColor(feed.status)}`}>
                        {feed.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-white font-medium">{feed.count?.toLocaleString() || 0}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-400 text-sm">{formatDate(feed.lastFetch)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-400 text-sm">
                      {feed.nextFetch ? formatDate(feed.nextFetch) : "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
