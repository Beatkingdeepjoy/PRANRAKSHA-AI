"use client";

import { usePranrakshaStore } from "@/lib/store";
import {
  Waves,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Droplets,
  CloudRain,
  MapPin,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export default function RiskPredictionPage() {
  const { hazardZones } = usePranrakshaStore();

  const stations = [
    {
      station: "Guwahati (Saraighat Bridge)",
      river: "Brahmaputra",
      currentLevelM: 50.84,
      dangerLevelM: 49.68,
      trend: "Rising (+4 cm/hr)",
      status: "EXTREME_FLOOD",
      forecastPeak: "51.15m within 14 hours",
    },
    {
      station: "Dibrugarh (DC Court Ghat)",
      river: "Brahmaputra",
      currentLevelM: 105.92,
      dangerLevelM: 105.70,
      trend: "Rising (+2 cm/hr)",
      status: "HIGH_FLOOD",
      forecastPeak: "106.10m within 18 hours",
    },
    {
      station: "Silchar (Annapurna Ghat)",
      river: "Barak",
      currentLevelM: 20.48,
      dangerLevelM: 19.83,
      trend: "Rapidly Rising (+7 cm/hr)",
      status: "EXTREME_FLOOD",
      forecastPeak: "21.05m within 8 hours",
    },
    {
      station: "Jia Bharali (NT Crossing)",
      river: "Jia Bharali",
      currentLevelM: 77.10,
      dangerLevelM: 77.00,
      trend: "Stable",
      status: "WARNING_ALERT",
      forecastPeak: "Near Danger Mark",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-cobalt/20 pb-4">
        <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
          <Waves className="h-4 w-4" />
          <span>Hydrological River Basin & Terrain Risk Telemetry</span>
        </div>
        <h1 className="text-2xl font-black text-white mt-1">Disaster Risk & Inundation Forecasting</h1>
        <p className="text-xs text-slate-300">
          Integrated river gauge telemetry against Central Water Commission (CWC) danger thresholds and Open-Meteo precipitation models for Northeast India.
        </p>
      </div>

      {/* River Gauges Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stations.map((st, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-midnight border border-cobalt/30 shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">{st.river}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  st.status === "EXTREME_FLOOD"
                    ? "bg-critical/20 text-critical border-critical/40"
                    : "bg-warning/20 text-warning border-warning/40"
                }`}
              >
                {st.status.replace("_", " ")}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white">{st.station}</h3>

            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-navy/80 border border-cobalt/20 text-xs font-mono">
              <div>
                <div className="text-[10px] text-slate-400">Current Level</div>
                <div className="text-base font-black text-critical">{st.currentLevelM}m</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Danger Mark</div>
                <div className="text-base font-bold text-white">{st.dangerLevelM}m</div>
              </div>
            </div>

            <div className="text-[11px] text-slate-300">
              Trend: <strong className="text-warning">{st.trend}</strong>
            </div>

            <div className="p-2 rounded-lg bg-navy/60 border border-cobalt/15 text-[11px] text-sky-300">
              Forecast Peak: <strong>{st.forecastPeak}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Hazard Zones Overview */}
      <div className="p-6 rounded-3xl bg-midnight border border-cobalt/20 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <span>Active Inundation Zones & Evacuation Directives</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {hazardZones.map((hz) => (
            <div
              key={hz.id}
              className="p-4 rounded-2xl bg-navy/80 border border-cobalt/20 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{hz.name}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    hz.riskLevel === "extreme"
                      ? "bg-critical/20 text-critical border-critical/30"
                      : "bg-warning/20 text-warning border-warning/30"
                  }`}
                >
                  {hz.riskLevel}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-midnight border border-cobalt/20 font-mono text-[11px]">
                <div>
                  <div className="text-[10px] text-slate-400">24h Rain</div>
                  <div className="text-white font-bold">{hz.rainfall24hMm} mm</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Water Level</div>
                  <div className="text-critical font-bold">{hz.currentWaterLevelM || "Runoff"}m</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Trend</div>
                  <div className="text-warning font-bold capitalize">{hz.trend.replace("_", " ")}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Basin: {hz.riverBasin}</span>
                <span
                  className={`font-bold ${
                    hz.evacuationRecommended ? "text-critical animate-pulse" : "text-emerald-400"
                  }`}
                >
                  {hz.evacuationRecommended ? "EVACUATION RECOMMENDED" : "Alert Monitoring"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
