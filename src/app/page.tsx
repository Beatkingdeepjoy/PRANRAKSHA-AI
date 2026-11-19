"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MapComponent from "@/components/MapComponent";
import { usePranrakshaStore } from "@/lib/store";
import {
  ShieldAlert,
  Radio,
  MapPin,
  Route,
  Cpu,
  Users,
  Compass,
  ArrowRight,
  LifeBuoy,
  Activity,
  AlertTriangle,
  Waves,
  Building2,
  Ambulance,
  PhoneCall,
  CheckCircle2,
  BrainCircuit,
  Eye,
  FileCheck,
  Sparkles,
  LogIn,
  UserPlus,
  Satellite,
  Gauge,
  Signal,
  ShieldCheck,
  Layers,
  HeartHandshake,
  Clock,
} from "lucide-react";

export default function HomePage() {
  const { incidents, rescueTeams, shelters, hospitals, hazardZones, roadReports } =
    usePranrakshaStore();

  const [activeHudTab, setActiveHudTab] = useState<"hydro" | "sar" | "teams" | "ai">("hydro");

  const activeIncidents = incidents.filter(
    (i) => i.status !== "resolved" && i.status !== "closed" && i.status !== "rejected"
  );
  const criticalCount = activeIncidents.filter((i) => i.severity === "critical").length;
  const totalAffected = incidents.reduce((acc, i) => acc + (i.affectedCount || 0), 0);

  return (
    <div className="min-h-screen bg-navy text-foreground flex flex-col relative overflow-hidden">
      {/* Background Liquid Ambient Light Orbs with Organic Morphing */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-cobalt/25 via-electric/20 to-sky-400/10 rounded-full blur-[140px] pointer-events-none animate-liquid-morph" />
      <div className="absolute top-3/4 right-0 w-[550px] h-[450px] bg-gradient-to-br from-purple-600/15 via-sky-400/15 to-transparent rounded-full blur-[130px] pointer-events-none animate-liquid-morph-fast" />

      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-14 pb-20 border-b border-cobalt/20 tactical-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Top Operational Pill styled like an Apple Dynamic Island */}
            <div className="dynamic-island inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 text-sky-200 text-xs font-semibold tracking-wide shadow-2xl animate-float cursor-default">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-critical opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-critical"></span>
              </span>
              <span className="tracking-wider uppercase font-mono text-[11px] text-sky-200">
                TRIPURA STATE DISASTER NETWORK • LIVE SEOC AGARTALA RADAR
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight font-sans">
              Every Second Matters. <br />
              <span className="bg-gradient-to-r from-sky-300 via-electric to-cobalt bg-clip-text text-transparent">
                Every Life Counts.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              An intelligent emergency response network connecting citizens across Tripura with AI hazard prediction, GIS flood mapping, and rapid rescue team coordination.
            </p>

            {/* Action Buttons (iOS Spring Tap Physics) */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
              <Link
                href="/citizen/dashboard#sos"
                className="ios-spring btn-shimmer-sweep flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-critical to-red-700 hover:from-red-600 hover:to-red-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-2xl shadow-critical/40 border border-red-400/40"
              >
                <ShieldAlert className="h-5 w-5" />
                <span>Report Emergency SOS</span>
              </Link>

              <Link
                href="/admin/command-center"
                className="ios-spring btn-shimmer-sweep flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-cobalt via-electric to-sky-500 hover:from-cobalt hover:to-sky-400 text-white font-bold text-sm tracking-wide shadow-xl shadow-cobalt/30 border border-sky-400/40"
              >
                <Radio className="h-5 w-5" />
                <span>Explore Command Centre</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/auth/register"
                className="ios-spring flex items-center gap-2.5 px-6 py-4 rounded-2xl dynamic-island hover:bg-white/10 text-sky-200 text-sm font-semibold"
              >
                <UserPlus className="h-4 w-4 text-sky-400" />
                <span>Sign Up / Volunteer</span>
              </Link>
            </div>

            {/* Live Metrics Quick Strip (iPhone Liquid Glass Widgets) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-8 max-w-4xl mx-auto text-left">
              <div className="liquid-card ios-spring p-5 rounded-[2rem] border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Emergencies</div>
                <div className="text-3xl font-black text-white mt-1.5 font-mono">{activeIncidents.length}</div>
                <div className="text-[10px] text-amber-400 font-medium mt-1">Tripura Basin Alert</div>
              </div>

              <div className="liquid-card ios-spring p-5 rounded-[2rem] border border-critical/30 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-critical to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Critical Priority</div>
                <div className="text-3xl font-black text-critical mt-1.5 font-mono">{criticalCount}</div>
                <div className="text-[10px] text-red-300 font-medium mt-1">NDRF / TSR Active</div>
              </div>

              <div className="liquid-card ios-spring p-5 rounded-[2rem] border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">People Affected</div>
                <div className="text-3xl font-black text-sky-300 mt-1.5 font-mono">{totalAffected}</div>
                <div className="text-[10px] text-slate-400 font-medium mt-1">Shelter Assisted</div>
              </div>

              <div className="liquid-card ios-spring p-5 rounded-[2rem] border border-emerald-500/30 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Rescue Units Ready</div>
                <div className="text-3xl font-black text-emerald-400 mt-1.5 font-mono">{rescueTeams.length}</div>
                <div className="text-[10px] text-emerald-300 font-medium mt-1">NDRF / TSR / Fire Units</div>
              </div>
            </div>

            {/* ==============================================================================
                INTERACTIVE SEOC MISSION TELEMETRY CONSOLE (APPLE LIQUID UI & RADAR)
                ============================================================================== */}
            <div className="pt-8 max-w-4xl mx-auto text-left w-full">
              <div className="p-6 sm:p-8 rounded-[2.5rem] glass-specular-pro space-y-6 relative overflow-hidden group">
                {/* Holographic Laser Scanline */}
                <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-holo-scan pointer-events-none" />

                {/* Header with Live Indicator & iOS Segmented Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                          SEOC AGARTALA :: LIVE MISSION RADAR
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30 font-bold">
                          ONLINE
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Interactive state telemetry: river gauges, satellite SAR radar, dispatched squads & AI neural triage
                      </p>
                    </div>
                  </div>

                  {/* iOS Segmented Selector */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-2xl ios-segmented">
                    <button
                      type="button"
                      onClick={() => setActiveHudTab("hydro")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ios-spring flex items-center justify-center gap-1.5 ${
                        activeHudTab === "hydro"
                          ? "ios-segmented-active text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Waves className="h-3.5 w-3.5" />
                      <span>Hydro Radar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHudTab("sar")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ios-spring flex items-center justify-center gap-1.5 ${
                        activeHudTab === "sar"
                          ? "ios-segmented-active text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Satellite className="h-3.5 w-3.5" />
                      <span>Satellite SAR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHudTab("teams")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ios-spring flex items-center justify-center gap-1.5 ${
                        activeHudTab === "teams"
                          ? "ios-segmented-active text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Users className="h-3.5 w-3.5" />
                      <span>Rescue Units</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHudTab("ai")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ios-spring flex items-center justify-center gap-1.5 ${
                        activeHudTab === "ai"
                          ? "ios-segmented-active text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <BrainCircuit className="h-3.5 w-3.5" />
                      <span>AI Triage</span>
                    </button>
                  </div>
                </div>

                {/* ==================== TAB 1: HYDRO RADAR ==================== */}
                {activeHudTab === "hydro" && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Howrah River Gauge with Animated Liquid Vessel */}
                      <div className="p-4 rounded-2xl bg-midnight/90 border border-critical/30 space-y-3 relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-critical animate-ping" />
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              Howrah River (Agartala)
                            </span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-critical/20 text-red-300 border border-critical/40 font-bold uppercase">
                            DANGER MARK EXCEEDED
                          </span>
                        </div>

                        {/* Liquid Fluid Wave Vessel */}
                        <div className="relative h-20 rounded-xl overflow-hidden bg-navy/90 border border-cobalt/40 flex items-end">
                          <div
                            className="absolute inset-0 bg-gradient-to-t from-cobalt via-electric/40 to-sky-400/20 opacity-80"
                            style={{ height: "78%" }}
                          />
                          <div className="relative z-10 p-3 w-full flex items-center justify-between text-xs">
                            <div>
                              <div className="text-[10px] text-slate-300 font-mono uppercase">Current Gauge Level</div>
                              <div className="text-2xl font-black text-white font-mono">11.24 m</div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] text-amber-300 font-mono uppercase">Extreme Mark</div>
                              <div className="text-xs font-bold text-red-300 font-mono">+74 cm Overflow</div>
                            </div>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-300 leading-relaxed">
                          <strong>Active Inundation Threat:</strong> Baldakhal, Pratapgarh, and Ramnagar lowlands. 85 households advised immediate vertical evacuation.
                        </div>
                      </div>

                      {/* Gomati River Gauge */}
                      <div className="p-4 rounded-2xl bg-midnight/90 border border-amber-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-amber-400" />
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              Gomati River (Udaipur & Sonamura)
                            </span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase">
                            MONITORING
                          </span>
                        </div>

                        {/* Liquid Fluid Wave Vessel */}
                        <div className="relative h-20 rounded-xl overflow-hidden bg-navy/90 border border-cobalt/40 flex items-end">
                          <div
                            className="absolute inset-0 bg-gradient-to-t from-teal-600/70 via-emerald-500/40 to-sky-400/20 opacity-70"
                            style={{ height: "55%" }}
                          />
                          <div className="relative z-10 p-3 w-full flex items-center justify-between text-xs">
                            <div>
                              <div className="text-[10px] text-slate-300 font-mono uppercase">Current Gauge Level</div>
                              <div className="text-2xl font-black text-white font-mono">9.80 m</div>
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] text-slate-300 font-mono uppercase">Warning Mark</div>
                              <div className="text-xs font-bold text-emerald-300 font-mono">-15 cm Below Crest</div>
                            </div>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-300 leading-relaxed">
                          <strong>24h Basin Precipitation:</strong> 168.4 mm recorded at Baramura ridge stations. Maharani lowlands on standby alert.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-sky-400" />
                        <span>Telemetry updated via Central Water Commission gauges</span>
                      </span>
                      <Link
                        href="/admin/hazards"
                        className="text-sky-300 hover:text-white font-bold flex items-center gap-1 underline"
                      >
                        <span>View All 8 Tripura River Gauges</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* ==================== TAB 2: SATELLITE SAR ==================== */}
                {activeHudTab === "sar" && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      {/* Rotating Radar Screen */}
                      <div className="relative h-48 rounded-2xl bg-navy/90 border border-emerald-500/30 overflow-hidden flex items-center justify-center p-3">
                        {/* Concentric Radar Grid Rings */}
                        <div className="absolute h-36 w-36 rounded-full border border-emerald-500/20" />
                        <div className="absolute h-24 w-24 rounded-full border border-emerald-500/30" />
                        <div className="absolute h-12 w-12 rounded-full border border-emerald-500/40" />
                        <div className="absolute w-full h-[1px] bg-emerald-500/20" />
                        <div className="absolute h-full w-[1px] bg-emerald-500/20" />

                        {/* Rotating Radar Sweep Cone */}
                        <div className="absolute h-40 w-40 rounded-full animate-radar-spin pointer-events-none">
                          <div className="h-1/2 w-1/2 bg-gradient-to-br from-emerald-400/40 to-transparent rounded-tl-full origin-bottom-right" />
                        </div>

                        {/* Crisis Targets on Radar */}
                        <div className="absolute top-10 left-16 flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-critical animate-ping" />
                          <span className="text-[9px] font-mono text-red-300 font-bold">AGARTALA</span>
                        </div>
                        <div className="absolute bottom-12 right-20 flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                          <span className="text-[9px] font-mono text-amber-200 font-bold">UDAIPUR</span>
                        </div>
                        <div className="absolute top-14 right-16 flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                          <span className="text-[9px] font-mono text-purple-200 font-bold">BARAMURA</span>
                        </div>
                      </div>

                      {/* SAR Constellation Details */}
                      <div className="space-y-2.5 text-xs">
                        <div className="p-3 rounded-xl bg-midnight/80 border border-white/10 space-y-1">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Satellite Sensor Array</div>
                          <div className="font-bold text-white">Copernicus Sentinel-1 SAR (C-Band)</div>
                          <div className="text-[11px] text-slate-400">Ground Resolution: 10m • Cloud-penetrating radar</div>
                        </div>

                        <div className="p-3 rounded-xl bg-midnight/80 border border-white/10 space-y-1">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Total Inundated Surface Detected</div>
                          <div className="text-lg font-black text-sky-300 font-mono">14.8 sq km</div>
                          <div className="text-[11px] text-red-300 font-medium">3 Critical Highway Corridors Submerged</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-mono">
                      <span>Pass Time: Sentinel-1 Pass 14:22 UTC over Tripura Quadrant</span>
                      <Link
                        href="/routes"
                        className="text-sky-300 hover:text-white font-bold flex items-center gap-1 underline"
                      >
                        <span>Calculate Detour around Flooded Roads</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* ==================== TAB 3: RESCUE SQUADS ==================== */}
                {activeHudTab === "teams" && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      {/* NDRF 1st Bn */}
                      <div className="p-4 rounded-2xl bg-midnight/90 border border-sky-400/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-sky-400 font-bold">SQUAD #1</span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold uppercase">
                            EN ROUTE
                          </span>
                        </div>
                        <div className="font-bold text-white text-sm">NDRF 1st Bn Alpha Boat Unit</div>
                        <div className="text-[11px] text-slate-400">Base: Arundhutinagar Agartala</div>
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                          <span className="text-sky-300 font-mono font-bold">4 Inflatable Gemini IRBs</span>
                          <span className="text-white font-bold">18 Rescuers</span>
                        </div>
                      </div>

                      {/* TSR 2nd Bn */}
                      <div className="p-4 rounded-2xl bg-midnight/90 border border-emerald-500/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">SQUAD #2</span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                            ON SCENE
                          </span>
                        </div>
                        <div className="font-bold text-white text-sm">Tripura State Rifles (TSR) Task Force</div>
                        <div className="text-[11px] text-slate-400">Sector: Ramnagar & Pratapgarh</div>
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                          <span className="text-emerald-300 font-mono font-bold">3 High-Axle 4x4s</span>
                          <span className="text-white font-bold">24 Officers</span>
                        </div>
                      </div>

                      {/* Aapda Mitra */}
                      <div className="p-4 rounded-2xl bg-midnight/90 border border-purple-500/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-purple-400 font-bold">SQUAD #3</span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase">
                            STANDBY
                          </span>
                        </div>
                        <div className="font-bold text-white text-sm">West Tripura Aapda Mitra Volunteers</div>
                        <div className="text-[11px] text-slate-400">Hub: Dasarath Deb Relief Camp</div>
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                          <span className="text-purple-300 font-mono font-bold">First Aid & Food Kits</span>
                          <span className="text-white font-bold">16 Volunteers</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-mono">
                      <span>Satellite Encrypted Uplink: ACTIVE (0 Packet Loss)</span>
                      <Link
                        href="/team/dashboard"
                        className="text-sky-300 hover:text-white font-bold flex items-center gap-1 underline"
                      >
                        <span>Open Field Commander Terminal</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* ==================== TAB 4: AI TRIAGE ==================== */}
                {activeHudTab === "ai" && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="p-4 rounded-2xl bg-midnight/90 border border-purple-500/40 space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping" />
                          <span className="font-bold text-white uppercase">
                            LIVE NLP INGESTION STREAM :: CITIZEN DISTRESS #TRP-8821
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                          PROCESSED IN 410ms
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-navy/90 border border-white/10 text-slate-300 leading-relaxed font-sans text-xs">
                        <strong>Transcribed Audio Distress Call:</strong> "We are 4 family members including an 82-year-old grandmother stranded on the tin roof in Baldakhal near the culvert. Water has entered the first floor and is rising rapidly. Please send a boat."
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                        <div className="p-2.5 rounded-xl bg-navy/80 border border-white/10">
                          <div className="text-slate-400 text-[9px] uppercase">DBSCAN Duplicate Match</div>
                          <div className="text-emerald-400 font-bold mt-0.5">Auto-Grouped (Cluster 01)</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-navy/80 border border-white/10">
                          <div className="text-slate-400 text-[9px] uppercase">Calculated Severity Score</div>
                          <div className="text-critical font-bold mt-0.5">98/100 CRITICAL PRIORITY</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-navy/80 border border-white/10">
                          <div className="text-slate-400 text-[9px] uppercase">Auto-Assigned Resource</div>
                          <div className="text-sky-300 font-bold mt-0.5">Inflatable Gemini Boat Squad</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 font-mono">
                      <span>Triage Model: Fine-tuned DistilBERT + DBSCAN Geospatial Clustering</span>
                      <Link
                        href="/admin/intelligence"
                        className="text-sky-300 hover:text-white font-bold flex items-center gap-1 underline"
                      >
                        <span>Inspect AI Benchmark Metrics</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Emergency Map Preview Section (Tripura GIS) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-cobalt/20 relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                <MapPin className="h-4 w-4" />
                <span>Tripura GIS Operational Intelligence</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Live Interactive Emergency GIS Radar
              </h2>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Real-time spatial visualization displaying active rescue incidents across Agartala, Howrah river flood inundation polygons, emergency hospital ICU bed telemetry, and passable road networks.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/map"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cobalt hover:bg-cobalt/90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cobalt/30 transition-all hover:scale-105"
              >
                <span>Open Fullscreen Map</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Embedded Live Map with Guaranteed Dimensions */}
          <div className="h-[520px] w-full rounded-3xl overflow-hidden border border-cobalt/30 shadow-2xl relative">
            <MapComponent
              incidents={incidents}
              rescueTeams={rescueTeams}
              hospitals={hospitals}
              shelters={shelters}
              hazardZones={hazardZones}
              roadReports={roadReports}
              centerLat={23.8315}
              centerLng={91.2868}
              zoomLevel={12}
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* End-to-End Rescue Workflow Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-cobalt/20 bg-navy/90">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="text-xs font-bold text-sky-400 uppercase tracking-widest">Accountability & Verification</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              The 8-Stage Life-Saving Workflow
            </h2>
            <p className="text-sm text-slate-300">
              Every emergency follows an auditable, trackable lifecycle from the initial citizen SOS to supervisor verification, eliminating duplicate reports and ensuring complete closure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "Reported & Geotagged",
                desc: "Citizen presses SOS or submits emergency report. Device GPS accuracy radius & vulnerable count captured instantly.",
                icon: ShieldAlert,
                color: "text-amber-400 border-amber-500/30",
              },
              {
                step: "02",
                title: "AI NLP Triage & Duplicate Check",
                desc: "Embeddings model flags duplicate reports in the same radius. AI prioritizes based on medical need & trapped victims.",
                icon: BrainCircuit,
                color: "text-purple-400 border-purple-500/30",
              },
              {
                step: "03",
                title: "Operator Telephonic Verification",
                desc: "SEOC Agartala Dispatcher reviews citizen report, confirms severity, examines photos, and validates geographic location.",
                icon: FileCheck,
                color: "text-sky-400 border-sky-500/30",
              },
              {
                step: "04",
                title: "Rescue Team Dispatched",
                desc: "Nearest available NDRF 1st Bn / TSR squad with matching capabilities (e.g., Gemini boat, high-axle ambulance) dispatched.",
                icon: Users,
                color: "text-cyan-400 border-cyan-500/30",
              },
              {
                step: "05",
                title: "Team En Route with Live Routing",
                desc: "Rescue commanders receive dynamic turn-by-turn routing avoiding flooded Howrah culverts and Baramura landslides.",
                icon: Route,
                color: "text-orange-400 border-orange-500/30",
              },
              {
                step: "06",
                title: "Assistance in Progress",
                desc: "On-site evacuation begins. Live telemetry communicates remaining rooftop victims and medical transfers to HQ.",
                icon: Activity,
                color: "text-yellow-400 border-yellow-500/30",
              },
              {
                step: "07",
                title: "Assistance Completed",
                desc: "Field commander uploads photo evidence and marks victims transferred to safe relief camp or hospital.",
                icon: CheckCircle2,
                color: "text-emerald-400 border-emerald-500/30",
              },
              {
                step: "08",
                title: "Supervisor Audit & Closure",
                desc: "District Emergency Officer conducts closing review and logs incident into immutable audit registry.",
                icon: ShieldAlert,
                color: "text-blue-400 border-blue-500/30",
              },
            ].map((st) => (
              <div
                key={st.step}
                className="p-5 rounded-3xl glass-liquid-card card-tactical-interactive border border-cobalt/25 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black font-mono text-slate-500 group-hover:text-sky-400 transition-colors">
                    {st.step}
                  </span>
                  <div className={`p-2 rounded-xl bg-navy/80 border ${st.color}`}>
                    <st.icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{st.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Intelligence Engine Explanation (Tripura Hydro-Predictor) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-cobalt/20 bg-midnight/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                <BrainCircuit className="h-4 w-4" />
                <span>AI DISASTER INTELLIGENCE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Predictive Hazard Analytics & Neural Dispatch
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                PRANRAKSHA AI synthesizes live hydrological telemetry from the Central Water Commission, Open-Meteo precipitation models, and crowdsourced field reports across Tripura to forecast danger before it escalates.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0 text-purple-300">
                    <Waves className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Howrah & Gomati Flood Crest Modeling</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Monitors river gauge markers against danger marks in Agartala, Udaipur, and Kailashahar with 6 to 12 hour inundation forecast warnings.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-8 w-8 rounded-lg bg-cobalt/20 border border-cobalt/40 flex items-center justify-center shrink-0 text-sky-300">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">DBSCAN Spatial Incident Clustering</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Automatically clusters multiple distress calls within 500m into single operational rescue zones, preventing duplicated resource dispatch.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-300">
                    <Route className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Hazard-Aware Road Intelligence</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Evaluates OpenStreetMap road vectors against flooded road segments and Baramura hill landslides, warning rescue columns before they enter trapped corridors.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/admin/intelligence"
                  className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 uppercase tracking-wider"
                >
                  <span>Explore AI Engine Benchmarks</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* AI Engine Interactive Telemetry Panel (Liquid Glass) */}
            <div className="rounded-3xl glass-liquid p-6 sm:p-8 border border-white/10 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-white">
                    AI_ANALYSIS_STREAM :: TRIPURA_BASIN_01
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  CONFIDENCE: 97.4%
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-midnight/90 border border-cobalt/20 font-mono text-xs space-y-2">
                <div className="text-sky-300 font-bold">» HYDROLOGICAL MODEL OUTPUT:</div>
                <div className="text-slate-300 text-[11px] leading-relaxed">
                  "Station Howrah (Agartala) gauge reached 11.24m (74cm ABOVE extreme danger mark). Inundation risk critical for Baldakhal, Radhanagar, and Pratapgarh lowlands. Recommended immediate preventive evacuation for 85 households."
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-navy/80 border border-cobalt/20">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Rainfall 24h Gauge</div>
                  <div className="text-lg font-black text-warning mt-1">168.4 mm</div>
                  <div className="text-[10px] text-red-400">Baramura Monsoon Alert</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-navy/80 border border-cobalt/20">
                  <div className="text-[10px] uppercase font-bold text-slate-400">DBSCAN Incident Cluster</div>
                  <div className="text-lg font-black text-sky-300 mt-1">6 Reports Grouped</div>
                  <div className="text-[10px] text-emerald-400">Radius: 400m around Baldakhal</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-xs space-y-1.5">
                <div className="text-purple-300 font-bold flex items-center justify-between">
                  <span>AI Recommended Dispatch:</span>
                  <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded-full text-purple-200 border border-purple-400/30">
                    Optimal Match
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Dispatch NDRF 1st Bn Detachment Agartala (Equipped with 4 Inflatable Gemini Boats) due to 1.3m water depth preventing wheeled vehicle transit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Quick Access CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 glass-liquid border-b border-cobalt/20 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Need Immediate Emergency Rescue in Tripura?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Report directly from your phone with precise GPS coordinates, request immediate boat or medical support, and notify your emergency contacts in one click.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/citizen/dashboard#sos"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-critical hover:from-red-600 hover:to-red-500 text-white font-black text-sm uppercase tracking-wider shadow-2xl shadow-critical/50 transition-all hover:scale-105 active:scale-95"
            >
              TRIGGER CITIZEN SOS NOW
            </Link>
            <Link
              href="/citizen/journey"
              className="px-6 py-4 rounded-2xl glass-liquid hover:bg-white/10 text-sky-200 font-bold text-sm transition-all hover:scale-105"
            >
              Start Monitored Journey Guardian
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
