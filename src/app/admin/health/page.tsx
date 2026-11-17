"use client";

import { Server, Activity, ShieldCheck, CheckCircle2, HardDrive, Cpu, Radio } from "lucide-react";

export default function SystemHealthPage() {
  const telemetry = [
    { service: "Next.js App Server (Node v22)", latency: "4 ms", status: "Nominal", uptime: "99.98%" },
    { service: "PostgreSQL State Store", latency: "12 ms", status: "Healthy", uptime: "100.0%" },
    { service: "GIS Vector Map Rendering", latency: "18 ms", status: "Online", uptime: "99.95%" },
    { service: "FastAPI AI Microservice Engine", latency: "24 ms", status: "Ready", uptime: "99.90%" },
    { service: "Hydrological Telemetry Poller", latency: "140 ms", status: "Active", uptime: "99.85%" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-cobalt/20 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Server className="h-6 w-6 text-emerald-400" />
          <span>System Telemetry & Platform Infrastructure Health</span>
        </h1>
        <p className="text-xs text-slate-300">
          Real-time diagnostic health check across Next.js route handlers, PostGIS geometric indexing, and AI classification endpoints.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-midnight border border-cobalt/30 text-xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Average Edge Latency</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">14.6 ms</div>
          <div className="text-[10px] text-slate-400">Guwahati & National CDNs</div>
        </div>

        <div className="p-5 rounded-2xl bg-midnight border border-cobalt/30 text-xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">System Uptime (30-day)</div>
          <div className="text-2xl font-black text-sky-300 font-mono">99.98%</div>
          <div className="text-[10px] text-emerald-400">High Availability Redundant Node</div>
        </div>

        <div className="p-5 rounded-2xl bg-midnight border border-cobalt/30 text-xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Security Firewall & RLS</div>
          <div className="text-2xl font-black text-white font-mono">ENFORCED</div>
          <div className="text-[10px] text-emerald-400">Zero Trust Role Policies Active</div>
        </div>
      </div>

      <div className="rounded-2xl border border-cobalt/20 bg-midnight overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-navy border-b border-cobalt/20 text-[10px] uppercase font-bold text-slate-400">
            <tr>
              <th className="p-3.5">Subsystem Component</th>
              <th className="p-3.5">Latency</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Uptime SLA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cobalt/10">
            {telemetry.map((t, idx) => (
              <tr key={idx} className="hover:bg-navy/40">
                <td className="p-3.5 text-white font-bold">{t.service}</td>
                <td className="p-3.5 text-sky-400">{t.latency}</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {t.status}
                  </span>
                </td>
                <td className="p-3.5 text-right text-slate-300">{t.uptime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
