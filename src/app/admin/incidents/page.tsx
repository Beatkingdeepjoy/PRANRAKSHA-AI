"use client";

import { useState } from "react";
import { usePranrakshaStore } from "@/lib/store";
import {
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  PhoneCall,
  ShieldAlert,
} from "lucide-react";
import { getSeverityBadgeClass, getStatusBadgeClass } from "@/lib/utils";
import { Incident } from "@/types";

export default function AllIncidentsPage() {
  const { incidents, verifyIncident, rejectIncident, assignRescueTeam, rescueTeams } =
    usePranrakshaStore();

  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [inspectIncident, setInspectIncident] = useState<Incident | null>(null);

  const filtered = incidents.filter((i) => {
    const matchSearch =
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase()) ||
      (i.location.address && i.location.address.toLowerCase().includes(search.toLowerCase()));

    const matchSeverity = filterSeverity === "all" || i.severity === filterSeverity;
    const matchStatus = filterStatus === "all" || i.status === filterStatus;
    return matchSearch && matchSeverity && matchStatus;
  });

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(incidents, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pranraksha_incidents_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cobalt/20 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-warning" />
            <span>All Emergency Incidents Directory</span>
          </h1>
          <p className="text-xs text-slate-300">
            Total {incidents.length} recorded emergency calls across Assam and regional disaster sectors.
          </p>
        </div>

        <button
          onClick={exportJSON}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-midnight border border-cobalt/30 hover:border-cobalt text-xs font-bold text-sky-200 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export JSON Audit</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-midnight border border-cobalt/20 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search code, district, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-navy border border-cobalt/30 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500"
          />
        </div>

        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="rounded-xl bg-navy border border-cobalt/30 p-2 text-xs text-white"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="moderate">Moderate</option>
          <option value="low">Low</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl bg-navy border border-cobalt/30 p-2 text-xs text-white"
        >
          <option value="all">All Statuses</option>
          <option value="reported">Reported</option>
          <option value="verified">Verified</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Incidents Table */}
      <div className="rounded-2xl border border-cobalt/20 bg-midnight overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy border-b border-cobalt/20 text-[10px] uppercase font-bold text-slate-400">
              <tr>
                <th className="p-3.5">Code</th>
                <th className="p-3.5">Title & Location</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Victims</th>
                <th className="p-3.5">Assigned Unit</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cobalt/10">
              {filtered.map((inc) => (
                <tr key={inc.id} className="hover:bg-navy/40 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-sky-400">{inc.trackingCode}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-white">{inc.title}</div>
                    <div className="text-[11px] text-slate-400">{inc.location.address}</div>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityBadgeClass(inc.severity)}`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadgeClass(inc.status)}`}>
                      {inc.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-white">{inc.affectedCount}</span>
                    {inc.vulnerableCount > 0 && (
                      <span className="text-[10px] text-warning ml-1">({inc.vulnerableCount} vuln)</span>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-300">{inc.assignedTeamName || "Unassigned"}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setInspectIncident(inc)}
                      className="px-2.5 py-1 rounded bg-cobalt/20 hover:bg-cobalt/30 text-sky-300 border border-cobalt/40 font-semibold"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {inspectIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/85 backdrop-blur-md">
          <div className="max-w-xl w-full rounded-3xl bg-midnight border border-cobalt/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-cobalt/20 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-sky-400">{inspectIncident.trackingCode}</span>
                <h3 className="text-lg font-bold text-white">{inspectIncident.title}</h3>
              </div>
              <button onClick={() => setInspectIncident(null)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">{inspectIncident.description}</p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-navy border border-cobalt/20">
                <div className="text-[10px] text-slate-400">Reporter</div>
                <div className="font-bold text-white">{inspectIncident.reporter.name} ({inspectIncident.reporter.phone})</div>
              </div>
              <div className="p-2.5 rounded-lg bg-navy border border-cobalt/20">
                <div className="text-[10px] text-slate-400">Coordinates</div>
                <div className="font-mono text-sky-300">{inspectIncident.location.lat.toFixed(4)}°N, {inspectIncident.location.lng.toFixed(4)}°E</div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-cobalt/20 text-xs">
              <div className="font-bold text-white">Assign Rescue Team:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {rescueTeams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => {
                      assignRescueTeam(inspectIncident.id, team.id);
                      setInspectIncident(null);
                    }}
                    className={`p-2 rounded-lg border text-left text-xs ${
                      inspectIncident.assignedTeamId === team.id
                        ? "bg-cobalt text-white border-cobalt"
                        : "bg-navy border-cobalt/30 text-slate-300 hover:text-white"
                    }`}
                  >
                    <div className="font-bold">{team.name}</div>
                    <div className="text-[10px] opacity-75">{team.capabilities.join(", ")}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
