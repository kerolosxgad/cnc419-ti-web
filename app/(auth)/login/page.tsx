"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login, saveUser } from "@/services/auth";
import { Shield, Mail, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(formData);
      saveUser(response.user);
      
      // Small delay to ensure cookie is set, then redirect
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Authentication failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background-secondary to-background">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-blue/20 rounded-2xl mb-4 glow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://www.codextech.org/favicon.svg" alt="Logo" className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Threat Intelligence Platform</h1>
          <p className="text-gray-400">Sign in to access the SOC dashboard</p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-severity-critical/10 border border-severity-critical/50 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-severity-critical flex-shrink-0 mt-0.5" />
                <p className="text-sm text-severity-critical">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  required
                  className="input pl-10"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="password"
                  type="password"
                  required
                  className="input pl-10"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <Link href="/reset-password" className="text-sm text-accent-blue hover:text-blue-400 transition-colors">
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-gray-400">Don't have an account?</span>
              </div>
            </div>

            <Link href="/register" className="btn btn-secondary w-full text-center block">
              Create Account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Protected by enterprise-grade security
        </p>
      </div>
    </div>
  );
}
