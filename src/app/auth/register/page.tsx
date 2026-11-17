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
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  HeartPulse,
  Users,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = usePranrakshaStore();

  const [role, setRole] = useState<"citizen" | "volunteer">("citizen");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [district, setDistrict] = useState("West Tripura");
  const [password, setPassword] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "First Aid Certified",
    "Community Logistics",
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const districtsOfTripura = [
    "West Tripura (Agartala)",
    "Gomati (Udaipur)",
    "Khowai (Teliamura)",
    "South Tripura (Belonia)",
    "Unakoti (Kailashahar)",
    "Dhalai (Ambassa)",
    "North Tripura (Dharmanagar)",
    "Sepahijala (Bishalgarh)",
  ];

  const availableSkills = [
    "First Aid Certified",
    "Swimmer & Deep Diver",
    "Boat Navigator",
    "Ham Radio Operator",
    "Medical / Nursing Assistance",
    "JCB / Heavy Vehicle Driver",
    "Local Language Translator (Kokborok & Bengali)",
    "Community Logistics",
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      registerUser({
        fullName: fullName || "Registered Citizen",
        email: email || "citizen@tripura.in",
        phone: phone || "+91 94361 00000",
        role,
        district: district.split(" ")[0],
      });

      setLoading(false);
      setSuccess("Account successfully registered and active in Tripura Emergency Network!");

      setTimeout(() => {
        router.push(role === "volunteer" ? "/team/dashboard" : "/citizen/dashboard");
      }, 800);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-navy text-foreground flex flex-col relative overflow-hidden">
      {/* Background Liquid Ambient Light Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-cobalt/20 via-electric/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12 flex flex-col items-center justify-center relative z-10">
        <div className="w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cobalt/20 text-sky-300 text-xs font-bold uppercase tracking-wider border border-sky-400/30 backdrop-blur-md">
              <ShieldAlert className="h-4 w-4 text-sky-400" />
              <span>Tripura Emergency Protection Network</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Create Your Emergency Account
            </h1>
            <p className="text-xs text-slate-300">
              Register as an alert Citizen or enlist as a Community Volunteer first responder.
            </p>
          </div>

          <div className="glass-liquid rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
            {success && (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{success}</span>
              </div>
            )}

            {/* Account Type Selector (Citizen vs Volunteer) */}
            <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-navy/80 border border-cobalt/30 text-xs">
              <button
                type="button"
                onClick={() => setRole("citizen")}
                className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  role === "citizen"
                    ? "bg-cobalt text-white shadow-lg shadow-cobalt/30 border border-sky-300/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <HeartPulse className="h-4 w-4" />
                <span>Citizen Account</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("volunteer")}
                className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  role === "volunteer"
                    ? "bg-cobalt text-white shadow-lg shadow-cobalt/30 border border-sky-300/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Aapda Mitra Volunteer</span>
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-sky-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Subrata Debbarma"
                      className="w-full rounded-xl glass-liquid-input p-2.5 pl-9 text-white placeholder-slate-500 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Mobile Number (SMS Alert Recipient)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-sky-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 94360 00000"
                      className="w-full rounded-xl glass-liquid-input p-2.5 pl-9 text-white placeholder-slate-500 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-sky-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@tripura.in"
                      className="w-full rounded-xl glass-liquid-input p-2.5 pl-9 text-white placeholder-slate-500 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tripura District</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-sky-400" />
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full rounded-xl glass-liquid-input p-2.5 pl-9 text-white text-xs focus:outline-none bg-midnight"
                    >
                      {districtsOfTripura.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Volunteer Specific Fields */}
              {role === "volunteer" && (
                <div className="p-4 rounded-2xl bg-midnight/80 border border-cobalt/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-300">Volunteer Disaster Skillset</span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <span>Blood Group:</span>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="rounded-lg bg-navy border border-cobalt/40 p-1 text-white text-xs font-mono"
                      >
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {availableSkills.map((sk) => {
                      const isSelected = selectedSkills.includes(sk);
                      return (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => toggleSkill(sk)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                            isSelected
                              ? "bg-cobalt text-white border-sky-400 shadow-md shadow-cobalt/20"
                              : "bg-navy/60 text-slate-300 border-cobalt/20 hover:border-cobalt/40"
                          }`}
                        >
                          {isSelected ? "✓ " : "+ "}
                          {sk}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-sky-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create security password"
                    className="w-full rounded-xl glass-liquid-input p-2.5 pl-9 text-white placeholder-slate-500 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cobalt to-electric hover:from-cobalt hover:to-sky-400 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-cobalt/30 border border-sky-400/40 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Registering Emergency Profile...</span>
                  ) : (
                    <>
                      <span>Complete Registration & Open Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-cobalt/20 text-center text-xs text-slate-300">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-sky-400 hover:text-white font-bold underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
