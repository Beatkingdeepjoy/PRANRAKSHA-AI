"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePranrakshaStore } from "@/lib/store";
import { UserProfile } from "@/types";
import {
  ShieldAlert,
  Lock,
  Mail,
  User,
  HeartPulse,
  Users,
  Radio,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = usePranrakshaStore();

  const [selectedRole, setSelectedRole] = useState<UserProfile["role"]>("citizen");
  const [email, setEmail] = useState("ram.chandra@citizen.tripura.in");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const demoAccounts: {
    role: UserProfile["role"];
    title: string;
    name: string;
    email: string;
    org: string;
    icon: any;
    targetRoute: string;
  }[] = [
    {
      role: "citizen",
      title: "Citizen",
      name: "Ram Chandra Debbarma",
      email: "ram.chandra@citizen.tripura.in",
      org: "Tripura Citizen Protection Portal",
      icon: HeartPulse,
      targetRoute: "/citizen/dashboard",
    },
    {
      role: "volunteer",
      title: "Volunteer",
      name: "Laxman Chandra Roy",
      email: "laxman.chandra@aapdamitra.tripura.org",
      org: "Aapda Mitra Community Disaster Task Force",
      icon: Users,
      targetRoute: "/team/dashboard",
    },
    {
      role: "team_member",
      title: "Rescue Lead",
      name: "Inspector Dasharath Kumar",
      email: "dasharath.kumar@ndrf.gov.in",
      org: "NDRF 1st Battalion Detachment Agartala",
      icon: Users,
      targetRoute: "/team/dashboard",
    },
    {
      role: "operator",
      title: "Dispatcher",
      name: "Ram Chandra Bhattacharjee",
      email: "ram.chandra@pranraksha.gov.in",
      org: "State Emergency Operations Centre (SEOC) Agartala",
      icon: Radio,
      targetRoute: "/admin/command-center",
    },
    {
      role: "admin",
      title: "Administrator",
      name: "Bharat Chandra Paul",
      email: "bharat.paul@tripura.gov.in",
      org: "District Emergency Operations Centre (DEOC)",
      icon: ShieldCheck,
      targetRoute: "/admin",
    },
  ];

  const handleSelectRole = (acc: (typeof demoAccounts)[0]) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const activeAcc = demoAccounts.find((a) => a.role === selectedRole);
    const targetRoute = activeAcc ? activeAcc.targetRoute : "/citizen/dashboard";

    setTimeout(() => {
      loginUser(email, selectedRole, activeAcc?.name);
      setLoading(false);
      setSuccessNotice(`Authenticated as ${activeAcc?.name || email}! Redirecting...`);
      setTimeout(() => {
        router.push(targetRoute);
      }, 700);
    }, 400);
  };

  const handleQuickOneClickLogin = (acc: (typeof demoAccounts)[0]) => {
    setLoading(true);
    setSelectedRole(acc.role);
    setEmail(acc.email);

    setTimeout(() => {
      loginUser(acc.email, acc.role, acc.name);
      setLoading(false);
      setSuccessNotice(`Instant Sign-In: Welcome ${acc.name}! Redirecting...`);
      setTimeout(() => {
        router.push(acc.targetRoute);
      }, 500);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-navy text-foreground flex flex-col relative overflow-hidden">
      {/* Background Liquid Ambient Light Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-cobalt/20 via-electric/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 pb-24 lg:pb-12 flex flex-col items-center justify-center relative z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Header Branding */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cobalt/20 text-sky-300 text-xs font-bold uppercase tracking-wider border border-sky-400/30 backdrop-blur-md">
              <ShieldAlert className="h-4 w-4 text-sky-400" />
              <span>Tripura Emergency Network Portal</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Sign In to PRANRAKSHA AI
            </h1>
            <p className="text-xs text-slate-300">
              Access Citizen SOS, Volunteer Dispatch, or State Command Centre.
            </p>
          </div>

          {/* Quick Demo One-Click Access Cards */}
          <div className="glass-liquid rounded-3xl p-4 border border-cobalt/30 space-y-3">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>1-Click Fast Access (Select Role)</span>
              </span>
              <span className="text-[10px] text-sky-400 font-semibold">Demo Ready</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {demoAccounts.map((acc) => {
                const isSelected = selectedRole === acc.role;
                const IconComponent = acc.icon;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleQuickOneClickLogin(acc)}
                    className={`p-2.5 rounded-2xl text-left border transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? "bg-cobalt/30 border-sky-400 text-white shadow-lg shadow-cobalt/20 ring-1 ring-sky-300"
                        : "bg-navy/60 hover:bg-navy border-cobalt/20 text-slate-300 hover:border-cobalt/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <IconComponent className="h-4 w-4 text-sky-400" />
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-mono uppercase bg-navy/80 text-slate-400">
                        {acc.title}
                      </span>
                    </div>
                    <div className="font-bold text-[11px] truncate">{acc.name}</div>
                    <div className="text-[9px] text-slate-400 truncate">{acc.org}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Liquid Glass Login Form */}
          <div className="glass-liquid rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-5">
            {successNotice && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{successNotice}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Email Address or Badge ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-sky-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter registered email"
                    className="w-full rounded-xl glass-liquid-input p-3 pl-9 text-white placeholder-slate-500 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">Security Password</label>
                  <span className="text-[10px] text-slate-400">Any password in demo mode</span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-sky-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full rounded-xl glass-liquid-input p-3 pl-9 text-white placeholder-slate-500 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cobalt to-electric hover:from-cobalt hover:to-sky-400 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-cobalt/30 border border-sky-400/40 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Authenticating Credentials...</span>
                  ) : (
                    <>
                      <span>Sign In as {selectedRole.toUpperCase()}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-cobalt/20 text-center text-xs text-slate-300">
              New citizen or volunteer?{" "}
              <Link href="/auth/register" className="text-sky-400 hover:text-white font-bold underline">
                Create a Free Account
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
