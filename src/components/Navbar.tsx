"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ShieldAlert,
  MapPin,
  Route,
  Users,
  Compass,
  LayoutDashboard,
  Radio,
  RefreshCw,
  UserCheck,
  ChevronDown,
  Menu,
  X,
  HeartPulse,
  LogIn,
  UserPlus,
  LogOut,
  Shield,
  Activity,
  Sparkles,
  Lock,
} from "lucide-react";
import { usePranrakshaStore } from "@/lib/store";
import { UserProfile } from "@/types";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const {
    isDemoMode,
    toggleDemoMode,
    currentUser,
    switchUserRole,
    logoutUser,
    resetDemoData,
    incidents,
  } = usePranrakshaStore();

  const activeIncidentsCount = incidents.filter(
    (i) => i.status !== "resolved" && i.status !== "closed" && i.status !== "rejected"
  ).length;

  const roles: {
    role: UserProfile["role"];
    label: string;
    person: string;
    badge: string;
    route: string;
  }[] = [
    {
      role: "citizen",
      label: "Citizen",
      person: "Ram Chandra Debbarma",
      badge: "Agartala Ward 5",
      route: "/citizen/dashboard",
    },
    {
      role: "volunteer",
      label: "Aapda Mitra Volunteer",
      person: "Laxman Chandra Roy",
      badge: "West Tripura Task Force",
      route: "/team/dashboard",
    },
    {
      role: "team_member",
      label: "NDRF Rescue Lead",
      person: "Insp. Dasharath Kumar",
      badge: "1st Bn Detachment Agartala",
      route: "/team/dashboard",
    },
    {
      role: "operator",
      label: "Emergency Dispatcher",
      person: "Ram Chandra Bhattacharjee",
      badge: "SEOC Agartala Control",
      route: "/admin/command-center",
    },
    {
      role: "admin",
      label: "Disaster Admin",
      person: "Bharat Chandra Paul",
      badge: "District HQ Tripura",
      route: "/admin",
    },
    {
      role: "super_admin",
      label: "State Super Admin",
      person: "Dr. Shatrughan Chandra Debbarma",
      badge: "Tripura SDMA Director",
      route: "/admin",
    },
  ];

  const isAdmin =
    currentUser.isVerified &&
    (currentUser.role === "operator" ||
      currentUser.role === "admin" ||
      currentUser.role === "super_admin");

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/map", label: "Live GIS Map", icon: MapPin },
    { href: "/routes", label: "Road Detours", icon: Route },
    { href: "/citizen/dashboard", label: "Citizen SOS", icon: HeartPulse },
    { href: "/team/dashboard", label: "Rescue Teams", icon: Users },
    {
      href: "/admin/command-center",
      label: "Command Centre",
      icon: Radio,
      highlight: true,
      restricted: !isAdmin,
    },
    {
      href: "/admin",
      label: "Admin Hub",
      icon: LayoutDashboard,
      restricted: !isAdmin,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-liquid-nav">
      {/* Top Telemetry / Status Bar */}
      <div className="flex h-8 items-center justify-between px-4 text-xs font-medium border-b border-white/5 bg-navy/90 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wider uppercase font-bold text-[10px] sm:text-xs">
              SEOC Agartala Operational
            </span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden sm:inline">
            Active Incidents: <span className="text-warning font-bold">{activeIncidentsCount}</span>
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-slate-400 hidden md:inline">
            Telemetry: <span className="text-sky-300 font-semibold">Tripura (Howrah & Gomati Basins)</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Demo Mode Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleDemoMode}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${
                isDemoMode
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              }`}
              title="Toggle between Simulated Tripura Demo Mode and Real Operational Mode"
            >
              {isDemoMode ? "DEMO MODE (Tripura Crisis)" : "REAL OPERATIONAL"}
            </button>
            {isDemoMode && (
              <button
                onClick={() => {
                  resetDemoData();
                }}
                className="text-slate-400 hover:text-white p-1"
                title="Reset Demo Records to Fresh Tripura Scenario"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
            )}
          </div>

          <span className="text-slate-600">|</span>

          {/* Profile & Role Management Pill */}
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cobalt/20 hover:bg-cobalt/30 border border-cobalt/40 text-sky-200 text-[11px] transition-all hover:scale-105"
          >
            <div className="h-4 w-4 rounded-full bg-gradient-to-tr from-cobalt to-sky-400 flex items-center justify-center text-[9px] font-bold text-white uppercase">
              {currentUser.fullName.charAt(0)}
            </div>
            <span className="max-w-[120px] truncate font-semibold text-white">
              {currentUser.fullName.split(" ")[0]}
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded font-mono uppercase bg-navy/80 text-sky-300 border border-cobalt/30">
              {currentUser.role.replace("_", " ")}
            </span>
            <ChevronDown className="h-3 w-3 text-sky-400" />
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cobalt via-electric to-sky-400 shadow-xl shadow-cobalt/40 border border-sky-300/40 group-hover:scale-105 transition-all">
              <ShieldAlert className="h-6 w-6 text-white" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-critical animate-ping" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-critical border border-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white font-mono">
                  PRANRAKSHA
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-md font-black bg-cobalt text-white tracking-widest shadow-md shadow-cobalt/50 border border-sky-400/40">
                  AI
                </span>
                <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase font-mono">
                  TRIPURA
                </span>
              </div>
              <p className="text-[10px] tracking-wider text-sky-300 uppercase font-medium">
                Predict Danger • Connect Help • Save Lives
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    item.highlight
                      ? "bg-gradient-to-r from-critical/80 to-cobalt text-white border border-critical/50 shadow-md shadow-critical/20 hover:scale-105"
                      : isActive
                      ? "bg-cobalt/25 text-sky-200 border border-cobalt/40 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-midnight/70"
                  }`}
                >
                  {item.icon && <item.icon className="h-3.5 w-3.5" />}
                  <span>{item.label}</span>
                  {item.restricted && (
                    <Lock className="h-3 w-3 text-slate-400 shrink-0 ml-0.5" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Sign In Pill & Instant SOS Quick Access */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-liquid hover:bg-white/10 text-sky-300 hover:text-white text-xs font-semibold border border-cobalt/30 transition-all hover:scale-105"
            >
              <LogIn className="h-3.5 w-3.5 text-sky-400" />
              <span>Sign In</span>
            </Link>

            <Link
              href="/citizen/dashboard#sos"
              className="btn-shimmer-sweep flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-critical hover:from-red-600 hover:to-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-critical/40 border border-red-400/40 transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>EMERGENCY SOS</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="p-2 rounded-lg text-sky-300 hover:bg-midnight border border-cobalt/20"
              title="User Account"
            >
              <UserCheck className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-midnight"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-cobalt/20 bg-midnight/95 backdrop-blur-xl px-4 pt-2 pb-5 space-y-1.5">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                pathname === item.href
                  ? "bg-cobalt text-white shadow-lg"
                  : "text-slate-300 hover:bg-navy hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </div>
              {item.restricted && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-navy text-slate-400 border border-cobalt/20 font-mono flex items-center gap-1">
                  <Lock className="h-2.5 w-2.5" /> Admin Only
                </span>
              )}
            </Link>
          ))}

          <div className="pt-2 grid grid-cols-2 gap-2">
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl glass-liquid text-sky-300 font-bold text-xs"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cobalt text-white font-bold text-xs"
            >
              <UserPlus className="h-4 w-4" />
              <span>Register</span>
            </Link>
          </div>

          <div className="pt-1">
            <Link
              href="/citizen/dashboard#sos"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-critical text-white font-bold text-sm tracking-wider uppercase text-center shadow-lg shadow-critical/40"
            >
              EMERGENCY SOS BUTTON
            </Link>
          </div>
        </div>
      )}

      {/* ==============================================================================
          LIQUID GLASS PROFILE & ROLE MANAGEMENT MODAL
          ============================================================================== */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/85 backdrop-blur-md animate-in fade-in">
          <div className="max-w-md w-full rounded-3xl glass-liquid p-6 border border-white/20 shadow-2xl space-y-5 text-xs animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cobalt to-electric flex items-center justify-center text-white font-bold shadow-md">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Active User Profile</h3>
                  <p className="text-[10px] text-sky-300">Tripura Emergency Network</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAuthModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-base px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Current Profile Card */}
            <div className="p-3.5 rounded-2xl bg-midnight/80 border border-cobalt/30 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{currentUser.fullName}</div>
                  <div className="text-[11px] text-slate-300">{currentUser.email}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-cobalt/30 text-sky-300 border border-sky-400/40">
                  {currentUser.role.replace("_", " ")}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-cobalt/20 flex items-center justify-between">
                <span>{currentUser.organization}</span>
                <span className="text-sky-300 font-semibold">{currentUser.district}</span>
              </div>
            </div>

            {/* Switch Active Role Experience */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  1-Click Switch Role Experience
                </span>
                <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Instant</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => {
                  const isCurrent = currentUser.role === r.role;
                  return (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => {
                        switchUserRole(r.role);
                        setAuthModalOpen(false);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isCurrent
                          ? "bg-cobalt/30 border-sky-400 text-white shadow-md ring-1 ring-sky-300"
                          : "bg-navy/70 hover:bg-navy border-cobalt/20 text-slate-300 hover:border-cobalt/40"
                      }`}
                    >
                      <div className="font-bold text-[11px] truncate">{r.label}</div>
                      <div className="text-[10px] text-sky-300 truncate">{r.person}</div>
                      <div className="text-[9px] text-slate-400 truncate">{r.badge}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions (Sign In / Register / Log Out) */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <Link
                href="/auth/login"
                onClick={() => setAuthModalOpen(false)}
                className="flex-1 py-2 rounded-xl glass-liquid hover:bg-white/10 text-sky-300 text-center font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In Page</span>
              </Link>

              {currentUser.id !== "usr-guest" ? (
                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    setAuthModalOpen(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-center font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  href="/auth/register"
                  onClick={() => setAuthModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-cobalt hover:bg-cobalt/90 text-white text-center font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Register User</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
