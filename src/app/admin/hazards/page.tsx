"use client";

import { usePranrakshaStore } from "@/lib/store";
import { Waves, CloudRain, Droplets, AlertTriangle, ShieldAlert } from "lucide-react";

export default function AdminHazardsPage() {
  const { hazardZones } = usePranrakshaStore();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-cobalt/20 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Waves className="h-6 w-6 text-sky-400" />
          <span>Regional Hazard & Basin Telemetry Monitoring</span>
        </h1>
        <p className="text-xs text-slate-300">
          Continuous flood hazard observations, 24-hour rainfall totals, river basin telemetry, and active alerts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hazardZones.map((hz) => (
          <div
            key={hz.id}
            className="p-6 rounded-3xl bg-midnight border border-cobalt/30 shadow-xl space-y-4 text-xs"
          >
            <div className="flex items-start justify-between border-b border-cobalt/20 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  {hz.riverBasin}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{hz.name}</h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  hz.riskLevel === "extreme"
                    ? "bg-critical/20 text-critical border-critical/40"
                    : "bg-warning/20 text-warning border-warning/40"
                }`}
              >
                {hz.riskLevel}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-navy/80 border border-cobalt/20 text-center font-mono">
              <div>
                <div className="text-[10px] text-slate-400">Current Water</div>
                <div className="text-base font-bold text-critical">{hz.currentWaterLevelM || "Surface"}m</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Danger Mark</div>
                <div className="text-base font-bold text-white">{hz.dangerMarkM || "N/A"}m</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">24h Rainfall</div>
                <div className="text-base font-bold text-warning">{hz.rainfall24hMm} mm</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400">Alert Trend: <strong className="text-warning capitalize">{hz.trend.replace("_", " ")}</strong></span>
              <span className="text-sky-300 font-bold">{hz.evacuationRecommended ? "EVACUATION ACTIVE" : "MONITORING"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
