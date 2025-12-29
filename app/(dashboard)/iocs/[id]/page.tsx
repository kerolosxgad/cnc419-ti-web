"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchIOC, correlateIOC } from "@/services/iocs";
import { IOC } from "@/types";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import {
  ArrowLeft,
  Shield,
  Database,
  Clock,
  Eye,
  Tag,
  AlertTriangle,
  Download,
  Link as LinkIcon,
} from "lucide-react";
import { formatDate, getIOCTypeLabel, parseTags, exportToJSON } from "@/utils/helpers";
import Link from "next/link";

export default function IOCDetailPage() {
  const params = useParams();
  const iocId = parseInt(params.id as string);

  const [ioc, setIOC] = useState<IOC | null>(null);
  const [relatedIOCs, setRelatedIOCs] = useState<IOC[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadIOC();
  }, [iocId]);

  const loadIOC = async () => {
    try {
      setLoading(true);
      const response = await fetchIOC(iocId);
      setIOC(response.ioc);
      loadRelated(response.ioc.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRelated = async (id: number) => {
    try {
      setLoadingRelated(true);
      const response = await correlateIOC(id, 7);
      if (response.relatedIOCs) {
        setRelatedIOCs(response.relatedIOCs);
      }
    } catch (err) {
      console.error("Failed to load related IOCs:", err);
    } finally {
      setLoadingRelated(false);
    }
  };

  const handleExport = () => {
    if (ioc) {
      exportToJSON(ioc, `ioc-${ioc.id}-${Date.now()}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error || !ioc) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-severity-high mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">IOC Not Found</h2>
          <p className="text-gray-400 mb-4">{error || "Unable to fetch IOC details"}</p>
          <Link href="/iocs" className="btn btn-primary">
            Back to IOC Search
          </Link>
        </div>
      </div>
    );
  }

  const tags = parseTags(ioc.tags);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/iocs" className="btn btn-secondary p-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">IOC Details</h1>
            <p className="text-gray-400">Indicator ID: {ioc.id}</p>
          </div>
        </div>
        <button onClick={handleExport} className="btn btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Main IOC Card */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-severity-critical/20 rounded-xl">
              <Shield className="w-8 h-8 text-severity-critical" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <SeverityBadge severity={ioc.severity} className="text-base px-3 py-1" />
                <span className="text-sm px-3 py-1 bg-accent-blue/20 text-accent-blue rounded-full">
                  {getIOCTypeLabel(ioc.type)}
                </span>
              </div>
              <h2 className="text-2xl font-bold font-mono text-white break-all">{ioc.value}</h2>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-background-secondary rounded-lg p-4 mb-6">
          <p className="text-gray-300">{ioc.description}</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-background-secondary rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Confidence</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-card-hover rounded-full h-2">
                <div
                  className="bg-accent-blue h-full rounded-full"
                  style={{ width: `${ioc.confidence}%` }}
                />
              </div>
              <p className="text-xl font-bold text-white">{ioc.confidence}%</p>
            </div>
          </div>

          <div className="p-4 bg-background-secondary rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Eye className="w-4 h-4" />
              <p className="text-sm">Observed</p>
            </div>
            <p className="text-2xl font-bold text-white">{ioc.observedCount}x</p>
          </div>

          <div className="p-4 bg-background-secondary rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Clock className="w-4 h-4" />
              <p className="text-sm">First Seen</p>
            </div>
            <p className="text-sm font-semibold text-white">{formatDate(ioc.firstSeen)}</p>
          </div>

          <div className="p-4 bg-background-secondary rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Clock className="w-4 h-4" />
              <p className="text-sm">Last Seen</p>
            </div>
            <p className="text-sm font-semibold text-white">{formatDate(ioc.lastSeen)}</p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Information */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-accent-blue" />
            <h3 className="text-lg font-semibold text-white">Source Information</h3>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-background-secondary rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Primary Source</p>
              <p className="text-lg font-semibold text-white">{ioc.source}</p>
            </div>
            <div className="p-4 bg-background-secondary rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Fingerprint</p>
              <p className="text-xs font-mono text-gray-300 break-all">{ioc.fingerprint}</p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-accent-blue" />
            <h3 className="text-lg font-semibold text-white">Tags & Classification</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-accent-purple/20 text-accent-purple rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Raw Data */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Raw Threat Intelligence Data</h3>
        <div className="bg-background-secondary rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-gray-300 font-mono">{JSON.stringify(ioc.raw, null, 2)}</pre>
        </div>
      </div>

      {/* Related IOCs */}
      {relatedIOCs.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <LinkIcon className="w-5 h-5 text-accent-blue" />
            <h3 className="text-lg font-semibold text-white">Related Indicators</h3>
            <span className="px-2 py-1 bg-accent-blue/20 text-accent-blue rounded text-sm">
              {relatedIOCs.length}
            </span>
          </div>
          <div className="space-y-3">
            {relatedIOCs.slice(0, 10).map((related) => (
              <Link
                key={related.id}
                href={`/iocs/${related.id}`}
                className="block p-4 bg-background-secondary rounded-lg hover:bg-card-hover transition-all duration-200 border border-border hover:border-border-glow"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <SeverityBadge severity={related.severity} />
                    <span className="text-xs px-2 py-1 bg-accent-blue/20 text-accent-blue rounded">
                      {getIOCTypeLabel(related.type)}
                    </span>
                    <p className="text-sm font-mono text-white truncate">{related.value}</p>
                  </div>
                  <p className="text-xs text-gray-500 flex-shrink-0">{related.source}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
