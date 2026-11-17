"use client";

import Link from "next/link";
import { usePranrakshaStore } from "@/lib/store";
import {
  ShieldAlert,
  Users,
  Building,
  Home,
  CheckCircle2,
  Clock,
  Radio,
  BrainCircuit,
  ArrowRight,
  TrendingUp,
  Activity,
  AlertTriangle,
  Server,
  Layers,
} from "lucide-react";
import { getSeverityBadgeClass, getStatusBadgeClass } from "@/lib/utils";

export default function AdminOverviewPage() {
  const {
    incidents,
    rescueTeams,
    shelters,
    hospitals,
    hazardZones,
    roadReports,
    auditLogs,
  } = usePranrakshaStore();

  const activeIncidents = incidents.filter(
    (i) => i.status !== "resolved" && i.status !== "closed" && i.status !== "rejected"
  );
  const criticalIncidents = activeIncidents.filter((i) => i.severity === "critical");
  const awaitingVerification = incidents.filter(
    (i) => i.status === "reported" || i.status === "under_verification"
  );
  const availableTeams = rescueTeams.filter((t) => t.status === "available");
  const totalVictims = incidents.reduce((acc, i) => acc + (i.affectedCount || 0), 0);
  const resolvedCount = incidents.filter((i) => i.status === "resolved" || i.status === "closed").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-midnight border border-cobalt/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <Radio className="h-4 w-4 animate-pulse text-emerald-400" />
            <span>State Operations Command Overview • Assam State Disaster Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Emergency Overview Dashboard</h1>
          <p className="text-xs text-slate-300">
            Real-time multi-agency coordination feed for NDRF, SDRF, ASDMA, and District Crisis Centres.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/command-center"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cobalt hover:bg-cobalt/90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cobalt/30 transition-all hover:scale-105"
          >
            <Radio className="h-4 w-4" />
            <span>Open Command Centre</span>
          </Link>
        </div>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-midnight border border-cobalt/20 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Incidents</div>
          <div className="text-2xl font-black text-white">{incidents.length}</div>
          <div className="text-[10px] text-slate-400 font-medium">Logged Since Inception</div>
        </div>

        <div className="p-4 rounded-2xl bg-midnight border border-warning/30 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Active Emergencies</div>
          <div className="text-2xl font-black text-warning">{activeIncidents.length}</div>
          <div className="text-[10px] text-amber-300 font-medium">Requires Response</div>
        </div>

        <div className="p-4 rounded-2xl bg-midnight border border-critical/30 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Critical Priority</div>
          <div className="text-2xl font-black text-critical">{criticalIncidents.length}</div>
          <div className="text-[10px] text-red-300 font-medium">Immediate Threat to Life</div>
        </div>

        <div className="p-4 rounded-2xl bg-midnight border border-purple-500/30 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Pending Verification</div>
          <div className="text-2xl font-black text-purple-400">{awaitingVerification.length}</div>
          <div className="text-[10px] text-purple-300 font-medium">Desk Triage Queue</div>
        </div>

        <div className="p-4 rounded-2xl bg-midnight border border-emerald-500/30 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Rescue Units Ready</div>
          <div className="text-2xl font-black text-emerald-400">{availableTeams.length} / {rescueTeams.length}</div>
          <div className="text-[10px] text-emerald-300 font-medium">Columns in Staging</div>
        </div>

        <div className="p-4 rounded-2xl bg-midnight border border-cobalt/20 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Resolved Cases</div>
          <div className="text-2xl font-black text-sky-300">{resolvedCount}</div>
          <div className="text-[10px] text-sky-400 font-medium">Supervised Closure</div>
        </div>
      </div>

      {/* 2-Column Split: Critical Queue vs System & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 Columns): Critical Incident Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-critical" />
              <span>Critical Incidents Requiring Dispatch</span>
            </h2>
            <Link href="/admin/incidents" className="text-xs text-sky-400 hover:text-sky-300">
              View All ({incidents.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {criticalIncidents.map((inc) => (
              <div
                key={inc.id}
                className="p-4 rounded-2xl bg-midnight border border-critical/30 space-y-2 hover:border-critical/60 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-sky-400">{inc.trackingCode}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityBadgeClass(inc.severity)}`}>
                        {inc.severity}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1">{inc.title}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadgeClass(inc.status)}`}>
                    {inc.status.replace("_", " ")}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">{inc.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-cobalt/10 text-xs text-slate-400">
                  <div>Location: <strong className="text-white">{inc.location.address}</strong></div>
                  <div>Assigned: <strong className="text-sky-300">{inc.assignedTeamName || "Unassigned"}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right (1 Column): Telemetry, AI Health & Recent Activity */}
        <div className="space-y-6">
          {/* AI Intelligence Status */}
          <div className="p-5 rounded-2xl bg-midnight border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <BrainCircuit className="h-4 w-4" />
                AI Inference Engines
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                ONLINE
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-cobalt/10 text-slate-300">
                <span>NLP Classification Engine:</span>
                <span className="text-emerald-400 font-mono">HuggingFace / Fallback active</span>
              </div>
              <div className="flex justify-between py-1 border-b border-cobalt/10 text-slate-300">
                <span>DBSCAN Spatial Clustering:</span>
                <span className="text-emerald-400 font-mono">Radius 500m / Min 2</span>
              </div>
              <div className="flex justify-between py-1 border-b border-cobalt/10 text-slate-300">
                <span>Hydrological Flood Predictor:</span>
                <span className="text-emerald-400 font-mono">CWC Telemetry Sync</span>
              </div>
            </div>
          </div>

          {/* System Audit Activity */}
          <div className="p-5 rounded-2xl bg-midnight border border-cobalt/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-sky-400" />
                Recent Audit Trail
              </span>
              <Link href="/admin/audit" className="text-[10px] text-sky-400 hover:text-sky-300">
                Full Log →
              </Link>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="p-2 rounded-lg bg-navy/80 border border-cobalt/20 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="text-sky-300">{log.action}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-slate-300 truncate text-[11px]">{log.details}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
