"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/helpers";
import {
  LayoutDashboard,
  Search,
  FileText,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  AlertTriangle,
} from "lucide-react";
import { logout, getCurrentUser } from "@/services/auth";
import { User } from "@/types";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "IOC Search", href: "/iocs", icon: Search },
    { name: "Reports", href: "/reports", icon: FileText },
    ...(user?.role === "admin" ? [{ name: "Admin", href: "/admin", icon: Shield }] : []),
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-card border-r border-border z-50 transition-all duration-300",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-accent-blue/20 rounded-lg glow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://www.codextech.org/favicon.svg" alt="Logo" className="w-5 h-5" />
              </div>
              <span className="font-bold text-white">ThreatIntel</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-card-hover rounded-lg transition-colors"
          >
            {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-accent-blue/20 text-accent-blue shadow-glow-sm"
                    : "text-gray-400 hover:bg-card-hover hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border space-y-2">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full",
              "text-severity-critical hover:bg-severity-critical/10"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Spacer */}
      <div className={cn("transition-all duration-300", collapsed ? "w-20" : "w-64")} />
    </>
  );
}
