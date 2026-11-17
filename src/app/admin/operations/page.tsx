"use client";

import { usePranrakshaStore } from "@/lib/store";
import { Activity, ShieldAlert, Users, Navigation, CheckCircle2, Clock } from "lucide-react";
import { getSeverityBadgeClass, getStatusBadgeClass } from "@/lib/utils";

export default function RescueOperationsPage() {
  const { incidents, rescueTeams } = usePranrakshaStore();

  const activeOps = incidents.filter(
    (i) => i.status === "assigned" || i.status === "en_route" || i.status === "in_progress"
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-cobalt/20 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Activity className="h-6 w-6 text-sky-400" />
          <span>Active Field Rescue Operations</span>
        </h1>
        <p className="text-xs text-slate-300">
          Tracking live operations currently in transit, on-scene evacuation, and medical triage.
        </p>
      </div>

      <div className="space-y-4">
        {activeOps.map((op) => (
          <div
            key={op.id}
            className="p-6 rounded-3xl bg-midnight border border-cobalt/30 shadow-xl space-y-4 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cobalt/20 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-sky-400">{op.trackingCode}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityBadgeClass(op.severity)}`}>
                    {op.severity}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">{op.title}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase border ${getStatusBadgeClass(op.status)}`}>
                {op.status.replace("_", " ")}
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed">{op.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-navy/80 border border-cobalt/20">
              <div>
                <div className="text-[10px] text-slate-400">Assigned Column</div>
                <div className="font-bold text-sky-300">{op.assignedTeamName || "Rescue Unit"}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Target Location</div>
                <div className="font-bold text-white">{op.location.address}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Total Evacuees</div>
                <div className="font-bold text-warning">{op.affectedCount} Persons</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
