"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { usePranrakshaStore } from "@/lib/store";
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
  Lock,
  ShieldAlert,
  LogIn,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, loginUser } = usePranrakshaStore();

  const isAdminAuthorized =
    currentUser.isVerified &&
    (currentUser.role === "operator" ||
      currentUser.role === "admin" ||
      currentUser.role === "super_admin");

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

  // Access control gate: unauthenticated visitors or citizens cannot access admin works
  if (!isAdminAuthorized) {
    return (
      <div className="min-h-screen bg-navy text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
          <div className="max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-midnight border border-cobalt/40 shadow-2xl text-center space-y-6">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-critical/20 border border-critical/40 flex items-center justify-center text-critical shadow-lg shadow-critical/20">
              <Lock className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-critical/20 text-red-300 text-xs font-bold uppercase tracking-wider border border-critical/30">
                <ShieldAlert className="h-3.5 w-3.5 text-critical" />
                <span>Restricted Operational Area</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Admin Authentication Required
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                Access to the State Emergency Operations Centre (SEOC) command centre, incident triage, and rescue dispatch networks requires verified operator or administrative credentials.
              </p>
            </div>

            {/* Current Session Identity */}
            <div className="p-3.5 rounded-2xl bg-navy/80 border border-cobalt/20 text-xs text-left space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-slate-400">Current Session State:</div>
              <div className="font-bold text-white flex items-center justify-between">
                <span>{currentUser.fullName}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cobalt/30 text-sky-300 border border-cobalt/40 font-mono uppercase">
                  {currentUser.role}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <span>Access Status:</span>
                <span className="text-amber-400 font-semibold">Unverified Public Access</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-1">
              <Link
                href="/auth/login"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cobalt to-electric hover:from-cobalt/90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cobalt/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In with Admin Credentials</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              {/* Instant Demo Clearance for Evaluators */}
              <button
                type="button"
                onClick={() => {
                  loginUser(
                    "ram.chandra@pranraksha.gov.in",
                    "operator",
                    "Ram Chandra Bhattacharjee (Dispatcher)"
                  );
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-navy/90 hover:bg-navy border border-cobalt/40 text-sky-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all hover:border-sky-400"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Demo Bypass: Authenticate as SEOC Dispatcher</span>
              </button>

              <Link
                href="/citizen/dashboard"
                className="block text-xs text-slate-400 hover:text-white underline pt-1"
              >
                ← Return to Citizen Public Safety Portal
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If viewing the command center and authorized, command center renders its own dedicated full-height radar view
  if (pathname === "/admin/command-center") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-navy text-foreground flex flex-col">
      <Navbar />

      {/* Mobile Top Navigation Dropdown (Standard In-Flow, Never Overlays) */}
      <div className="md:hidden p-3 bg-midnight border-b border-cobalt/20">
        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
          Select Admin Console Section (24 Modules):
        </label>
        <select
          value={pathname}
          onChange={(e) => {
            router.push(e.target.value);
          }}
          className="w-full rounded-xl bg-navy border border-cobalt/30 p-2.5 text-xs text-white focus:outline-none focus:border-cobalt"
        >
          {adminNav.map((item) => (
            <option key={item.href} value={item.href}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Left Comprehensive 24-Item Navigation Sidebar */}
        <aside className="hidden md:flex w-64 border-r border-cobalt/20 bg-midnight/90 flex-col shrink-0 overflow-y-auto">
          <div className="p-3 border-b border-cobalt/20">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-400">
              Tripura SEOC Admin Console
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
