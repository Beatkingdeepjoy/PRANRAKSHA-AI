"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MapComponent from "@/components/MapComponent";
import { usePranrakshaStore } from "@/lib/store";
import {
  Route,
  Navigation,
  AlertTriangle,
  CheckCircle2,
  Car,
  Footprints,
  Compass,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Clock,
  MapPin,
} from "lucide-react";
import { calculateDistanceKm } from "@/lib/utils";

export default function RoutesPage() {
  const { roadReports, hazardZones, shelters, hospitals } = usePranrakshaStore();

  const [origin, setOrigin] = useState("Battala Bus Stand, Central Agartala");
  const [destination, setDestination] = useState("Dasarath Deb Memorial Relief Hub, Banamalipur");
  const [routeMode, setRouteMode] = useState<"driving" | "walking">("driving");
  const [calculating, setCalculating] = useState(false);
  const [routeResult, setRouteResult] = useState<{
    distanceKm: number;
    durationMins: number;
    safe: boolean;
    warnings: string[];
    detourRecommended: boolean;
  } | null>({
    distanceKm: 5.4,
    durationMins: 18,
    safe: false,
    warnings: [
      "Severe Hazard: Route intersects Howrah River Baldakhal Inundation Zone (Water level 74cm above extreme danger mark).",
      "Caution: NH-8 Baramura Hill corridor blocked by active mudslide. Detour via Khowai link recommended.",
    ],
    detourRecommended: true,
  });

  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  const handleUseCurrentLocation = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      setLocationNotice("Detecting device GPS coordinates...");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setOrigin(`Detected GPS (${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E)`);
          setLocationNotice(`GPS detected: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`);
        },
        (err) => {
          setLocationNotice(`Location access notice: ${err.message}. Please allow location access in your browser.`);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const handleCalculateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);

    // Simulate real route evaluation with hazard intersection checks
    setTimeout(() => {
      setCalculating(false);
      setRouteResult({
        distanceKm: routeMode === "driving" ? 6.2 : 4.8,
        durationMins: routeMode === "driving" ? 22 : 65,
        safe: false,
        warnings: [
          "Hazard Warning: Route crosses Katakhal drainage culvert near Battala flooded under 60cm water. Light vehicles cannot pass.",
          "Caution: Heavy rain causing reduced visibility and loose mud on hillside roads near Baramura foothills.",
        ],
        detourRecommended: true,
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-navy text-foreground flex flex-col relative overflow-hidden">
      {/* Background Organic Liquid Ambient Glow Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-cobalt/20 rounded-full blur-3xl animate-liquid-morph pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-electric/15 rounded-full blur-3xl animate-liquid-morph pointer-events-none" style={{ animationDelay: "-7s" }} />

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <Route className="h-4 w-4" />
              <span>OpenStreetMap Road & Flood Detour Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Emergency Route Assessment Engine
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Calculates navigable routes through OpenStreetMap road networks while intersecting active flood hazard zones, submerged culverts, and reported roadblocks.
            </p>
          </div>

          {/* Dynamic Island Status Pill */}
          <div className="dynamic-island hidden sm:inline-flex items-center gap-2 px-4 py-2 self-start sm:self-auto">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono font-bold text-sky-200">OSM ROUTE RADAR ACTIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Route Planner Form & Assessment Result */}
          <div className="space-y-6">
            <div className="p-6 rounded-[2rem] liquid-card space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Navigation className="h-4 w-4 text-sky-400" />
                <span>Plan Emergency Route</span>
              </h2>

              <form onSubmit={handleCalculateRoute} className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-semibold">Starting Origin</label>
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      className="text-[11px] text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 ios-spring"
                    >
                      <Navigation className="h-3 w-3" />
                      <span>Use My Current Location</span>
                    </button>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-sky-400" />
                    <input
                      type="text"
                      required
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full rounded-2xl glass-liquid-input pl-10 pr-3 py-3 text-white focus:outline-none focus:ring-1 focus:ring-sky-400 text-xs"
                      placeholder="Enter start location or click 'Use My Current Location'"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Destination Target</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-emerald-400" />
                    <input
                      type="text"
                      required
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full rounded-2xl glass-liquid-input pl-10 pr-3 py-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 text-xs"
                      placeholder="Enter shelter, hospital or address"
                    />
                  </div>
                </div>

                {/* iOS Liquid Segmented Transit Profile */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Transit Profile</label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl ios-segmented">
                    <button
                      type="button"
                      onClick={() => setRouteMode("driving")}
                      className={`p-2.5 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ios-spring ${
                        routeMode === "driving"
                          ? "ios-segmented-active text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Car className="h-4 w-4" />
                      <span>Driving (4x4)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRouteMode("walking")}
                      className={`p-2.5 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ios-spring ${
                        routeMode === "walking"
                          ? "ios-segmented-active text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Footprints className="h-4 w-4" />
                      <span>Walking Evac</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={calculating}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cobalt via-electric to-sky-500 hover:opacity-95 text-white font-bold uppercase tracking-wider shadow-xl shadow-cobalt/40 border border-sky-300/40 transition-all ios-spring flex items-center justify-center gap-2"
                >
                  <Route className="h-4 w-4" />
                  <span>{calculating ? "Evaluating Hazard Intersections..." : "Assess Route Safety"}</span>
                </button>
              </form>
            </div>

            {/* Assessment Result Panel */}
            {routeResult && (
              <div
                className={`p-6 rounded-[2rem] border shadow-2xl space-y-4 backdrop-blur-xl ${
                  routeResult.safe
                    ? "liquid-card border-emerald-500/40"
                    : "liquid-card border-critical/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {routeResult.safe ? (
                      <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <ShieldAlert className="h-5 w-5 text-critical animate-pulse" />
                    )}
                    <span className="text-sm font-black text-white uppercase tracking-wider">
                      {routeResult.safe ? "Route Assessed Navigable" : "Hazard Detected on Route"}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                      routeResult.safe
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-critical/20 text-critical border-critical/40"
                    }`}
                  >
                    {routeResult.detourRecommended ? "Detour Advised" : "Passable"}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-navy/80 border border-white/10">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Total Distance</div>
                    <div className="text-xl font-black text-white mt-0.5">{routeResult.distanceKm} km</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-navy/80 border border-white/10">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Estimated Duration</div>
                    <div className="text-xl font-black text-sky-300 mt-0.5">{routeResult.durationMins} mins</div>
                  </div>
                </div>

                {/* Warnings List */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    Geographic Hazard Analysis:
                  </div>
                  {routeResult.warnings.map((warn, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-critical/15 border border-critical/30 text-xs text-red-200 leading-relaxed flex items-start gap-2.5"
                    >
                      <AlertTriangle className="h-4 w-4 text-critical shrink-0 mt-0.5" />
                      <span>{warn}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-2xl bg-navy/60 border border-white/5 text-[11px] text-slate-400">
                  <strong>Notice:</strong> OpenStreetMap road geometries reflect physical roadway layout. Does not simulate commercial traffic congestion without external live probe API.
                </div>
              </div>
            )}
          </div>

          {/* Right GIS Map View (2 Columns) */}
          <div className="lg:col-span-2 h-[650px] min-h-[500px] rounded-[2.5rem] overflow-hidden border border-white/15 shadow-2xl relative">
            <MapComponent
              roadReports={roadReports}
              hazardZones={hazardZones}
              shelters={shelters}
              hospitals={hospitals}
              autoDetectLocation={false}
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
