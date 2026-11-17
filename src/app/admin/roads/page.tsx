"use client";

import { usePranrakshaStore } from "@/lib/store";
import { Route, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

export default function AdminRoadsPage() {
  const { roadReports } = usePranrakshaStore();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-cobalt/20 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Route className="h-6 w-6 text-amber-400" />
          <span>Road Network Obstructions & Closures</span>
        </h1>
        <p className="text-xs text-slate-300">
          Official road closures, flooded highways, compromised bridges, and detour advisories across Assam disaster sectors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roadReports.map((road) => (
          <div
            key={road.id}
            className="p-5 rounded-2xl bg-midnight border border-cobalt/30 shadow-xl space-y-3 text-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">
                  {road.highwayNumber || "State Highway"}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{road.roadName}</h3>
                <div className="text-[11px] text-slate-400">{road.district}</div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  road.status === "open"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-critical/20 text-critical border-critical/40"
                }`}
              >
                {road.status.replace("_", " ")}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-navy/80 border border-cobalt/20 space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-slate-400">Detour Advisory:</div>
              <p className="text-slate-200 leading-relaxed">{road.detourAdvice}</p>
              {road.waterDepthCm ? (
                <div className="text-critical font-bold">Recorded Water Depth: {road.waterDepthCm} cm</div>
              ) : null}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Verified: {new Date(road.lastVerifiedAt).toLocaleTimeString()}</span>
              <span className="text-sky-300 font-mono">
                {road.lat.toFixed(4)}°N, {road.lng.toFixed(4)}°E
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
