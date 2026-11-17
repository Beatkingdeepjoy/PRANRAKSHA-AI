"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  LayoutDashboard,
  Radio,
  MapPin,
  AlertTriangle,
  CheckCircle,
  BrainCircuit,
  TrendingUp,
  Users,
  HeartHandshake,
  Box,
  Building,
  Home,
  Route,
  Waves,
  Activity,
  FileCheck,
  BarChart3,
  Bell,
  UserCheck,
  Building2,
  FileText,
  Plug,
  Server,
  Settings,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileAdminNavOpen, setMobileAdminNavOpen] = useState(false);

  const adminNav = [
    { href: "/admin", label: "1. Overview", icon: LayoutDashboard },
    { href: "/admin/command-center", label: "2. Command Centre", icon: Radio, highlight: true },
    { href: "/map", label: "3. Live GIS Map", icon: MapPin },
    { href: "/admin/incidents", label: "4. All Incidents", icon: AlertTriangle },
    { href: "/admin/verification", label: "5. Incident Verification", icon: CheckCircle },
    { href: "/admin/intelligence", label: "6. AI Intelligence", icon: BrainCircuit, highlight: true },
    { href: "/admin/risk-prediction", label: "7. Risk Prediction", icon: TrendingUp },
    { href: "/admin/teams", label: "8. Rescue Teams", icon: Users },
    { href: "/admin/volunteers", label: "9. Volunteer Management", icon: HeartHandshake },
    { href: "/admin/resources", label: "10. Resource Management", icon: Box },
    { href: "/admin/hospitals", label: "11. Hospitals Network", icon: Building },
    { href: "/admin/shelters", label: "12. Shelters & Camps", icon: Home },
    { href: "/admin/roads", label: "13. Road Management", icon: Route },
    { href: "/admin/hazards", label: "14. Hazard Monitoring", icon: Waves },
    { href: "/admin/operations", label: "15. Rescue Operations", icon: Activity },
    { href: "/admin/resolution", label: "16. Resolution Audit", icon: FileCheck },
    { href: "/admin/analytics", label: "17. Analytics & Reports", icon: BarChart3 },
    { href: "/admin/notifications", label: "18. Emergency Alerts", icon: Bell },
    { href: "/admin/users", label: "19. User Management", icon: UserCheck },
    { href: "/admin/organizations", label: "20. Organizations", icon: Building2 },
    { href: "/admin/audit", label: "21. Audit Trail Logs", icon: FileText },
    { href: "/admin/integrations", label: "22. API Integrations", icon: Plug },
    { href: "/admin/health", label: "23. System Health", icon: Server },
    { href: "/admin/settings", label: "24. Platform Settings", icon: Settings },
  ];

  // If viewing the command center, the command center page provides its own full-screen layout
  if (pathname === "/admin/command-center") {
    return <>{children}</>;
  }

  const currentNavItem = adminNav.find((n) => n.href === pathname);

  return (
    <div className="min-h-screen bg-navy text-foreground flex flex-col">
      <Navbar />

      {/* Mobile Top Navigation Toggle (< md) */}
      <div className="md:hidden flex items-center justify-between px-4 py-2.5 bg-midnight border-b border-cobalt/30 text-xs">
        <div className="flex items-center gap-2">
          {currentNavItem?.icon && <currentNavItem.icon className="h-4 w-4 text-sky-400" />}
          <span className="font-bold text-white truncate">{currentNavItem?.label || "Admin Console"}</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileAdminNavOpen(!mobileAdminNavOpen)}
          className="px-3 py-1.5 rounded-xl bg-cobalt/30 hover:bg-cobalt text-sky-300 hover:text-white border border-cobalt/40 font-bold transition-colors"
        >
          {mobileAdminNavOpen ? "Close Menu ✕" : "Admin Menu ▾"}
        </button>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileAdminNavOpen && (
        <div className="md:hidden bg-midnight/95 border-b border-cobalt/30 p-2 max-h-72 overflow-y-auto space-y-1">
          {adminNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileAdminNavOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-cobalt text-white font-bold shadow-md shadow-cobalt/30"
                    : "text-slate-300 hover:text-white hover:bg-navy/70"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Left Comprehensive 24-Item Navigation Sidebar */}
        <aside className="hidden md:flex w-64 border-r border-cobalt/20 bg-midnight/90 flex-col shrink-0 overflow-y-auto">
          <div className="p-3 border-b border-cobalt/20">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-400">
              Tripura Emergency Admin Console
            </span>
          </div>

          <nav className="p-2 space-y-0.5">
            {adminNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    item.highlight && !isActive
                      ? "text-sky-300 hover:bg-cobalt/20 font-bold"
                      : isActive
                      ? "bg-cobalt text-white font-bold shadow-md shadow-cobalt/30"
                      : "text-slate-300 hover:text-white hover:bg-navy/70"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">{children}</main>
      </div>
    </div>
  );
}
