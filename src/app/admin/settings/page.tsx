"use client";

import { usePranrakshaStore } from "@/lib/store";
import { Settings, RefreshCw, ToggleLeft, ToggleRight, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function PlatformSettingsPage() {
  const { isDemoMode, toggleDemoMode, resetDemoData } = usePranrakshaStore();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-cobalt/20 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-slate-400" />
          <span>Platform Operational Settings</span>
        </h1>
        <p className="text-xs text-slate-300">
          Configure runtime environment modes, simulated scenarios, notification thresholds, and telemetry preferences.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-midnight border border-cobalt/30 shadow-xl space-y-6 text-xs">
        {/* Demo Mode Toggle Section */}
        <div className="flex items-center justify-between pb-6 border-b border-cobalt/20">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Operational Mode (DEMO vs REAL)</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  isDemoMode
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                }`}
              >
                {isDemoMode ? "DEMO MODE (Assam Crisis)" : "REAL MODE"}
              </span>
            </h2>
            <p className="text-slate-400 max-w-lg leading-relaxed">
              In <strong>DEMO MODE</strong>, preloaded realistic Brahmaputra flood and Northeast India disaster scenarios are used so all features are interactive immediately. In <strong>REAL MODE</strong>, live PostGIS records and Supabase authenticated credentials are required.
            </p>
          </div>

          <button
            onClick={toggleDemoMode}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy border border-cobalt/30 hover:border-cobalt text-xs font-bold text-sky-300 transition-colors"
          >
            {isDemoMode ? <ToggleRight className="h-6 w-6 text-amber-400" /> : <ToggleLeft className="h-6 w-6 text-emerald-400" />}
            <span>Switch Mode</span>
          </button>
        </div>

        {/* Reset Demo Data */}
        <div className="flex items-center justify-between pb-6 border-b border-cobalt/20">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Reset Demo Scenario Records</h3>
            <p className="text-slate-400 max-w-lg leading-relaxed">
              Restore initial incidents, rescue team dispatch statuses, and shelter occupancy values to clean baseline state.
            </p>
          </div>

          <button
            onClick={() => {
              resetDemoData();
              alert("All demo records have been restored to initial disaster crisis scenario!");
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy border border-cobalt/30 hover:border-cobalt text-xs font-bold text-slate-300 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset Demo Records</span>
          </button>
        </div>

        {/* Region & Default Thresholds */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">Regional Defaults</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Primary Operational Focus</label>
              <input
                disabled
                type="text"
                value="Northeast India (Assam / Brahmaputra Basin)"
                className="w-full rounded-xl bg-navy border border-cobalt/20 p-2 text-slate-300"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">DBSCAN Clustering Distance</label>
              <input
                disabled
                type="text"
                value="500 Meters Epsilon"
                className="w-full rounded-xl bg-navy border border-cobalt/20 p-2 text-slate-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
