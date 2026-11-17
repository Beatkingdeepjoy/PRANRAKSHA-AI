"use client";

import { usePranrakshaStore } from "@/lib/store";
import { FileCheck, CheckCircle2, RotateCcw, ShieldCheck, Clock, UserCheck } from "lucide-react";

export default function ResolutionVerificationPage() {
  const { incidents, updateIncidentStatus } = usePranrakshaStore();

  const resolvedIncidents = incidents.filter(
    (i) => i.status === "resolved" || i.status === "closed"
  );

  const handleCloseAudit = (id: string) => {
    updateIncidentStatus(id, "closed", "Supervising officer approved final closure.");
    alert("Incident audited & officially archived in closed status.");
  };

  const handleReopen = (id: string) => {
    updateIncidentStatus(id, "in_progress", "Incident reopened by supervisor for follow-up verification.");
    alert("Incident reopened for additional field assistance!");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-cobalt/20 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <FileCheck className="h-6 w-6 text-emerald-400" />
          <span>Rescue Resolution & Supervisor Sign-Off</span>
        </h1>
        <p className="text-xs text-slate-300">
          Supervisory quality assurance to audit completed rescue missions, review relief camp transfers, and verify official closure.
        </p>
      </div>

      <div className="space-y-4">
        {resolvedIncidents.map((inc) => (
          <div
            key={inc.id}
            className="p-6 rounded-3xl bg-midnight border border-cobalt/30 shadow-xl space-y-4 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cobalt/20 pb-3">
              <div>
                <span className="text-[10px] font-mono text-sky-400 font-bold">{inc.trackingCode}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{inc.title}</h3>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {inc.status.toUpperCase()}
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed">{inc.description}</p>

            <div className="p-3 rounded-xl bg-navy/80 border border-cobalt/20 space-y-1.5 font-mono text-[11px]">
              <div className="text-slate-400">Audit Timeline:</div>
              <div>Reported: {new Date(inc.createdAt).toLocaleString()}</div>
              <div>Resolved: {inc.resolvedAt ? new Date(inc.resolvedAt).toLocaleString() : "Confirmed"}</div>
              <div>Assigned Rescue Column: {inc.assignedTeamName || "Field Unit"}</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleReopen(inc.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy border border-cobalt/30 hover:border-cobalt text-slate-300 hover:text-white font-bold"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reopen Incident</span>
              </button>

              <button
                onClick={() => handleCloseAudit(inc.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Approve Official Closure</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
