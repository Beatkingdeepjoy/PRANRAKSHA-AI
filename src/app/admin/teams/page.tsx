"use client";

import { usePranrakshaStore } from "@/lib/store";
import { Users, PhoneCall, ShieldAlert, CheckCircle2, Navigation, LifeBuoy, Ambulance } from "lucide-react";

export default function AdminTeamsPage() {
  const { rescueTeams } = usePranrakshaStore();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-cobalt/20 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Users className="h-6 w-6 text-sky-400" />
          <span>Rescue Teams & Units Roster</span>
        </h1>
        <p className="text-xs text-slate-300">
          Command roster of active NDRF battalions, Assam SDRF columns, Civil Defence corps, and Red Cross first responders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rescueTeams.map((team) => (
          <div
            key={team.id}
            className="p-6 rounded-3xl bg-midnight border border-cobalt/30 shadow-xl space-y-4 text-xs"
          >
            <div className="flex items-start justify-between border-b border-cobalt/20 pb-3">
              <div>
                <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">
                  {team.organization}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{team.name}</h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  team.status === "available"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : team.status === "on_scene"
                    ? "bg-critical/20 text-critical border-critical/40 animate-pulse"
                    : "bg-warning/20 text-warning border-warning/40"
                }`}
              >
                {team.status.replace("_", " ")}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-navy/80 border border-cobalt/20 space-y-1">
              <div>Commander: <strong className="text-white">{team.teamLead.name}</strong></div>
              <div>Phone: <strong className="text-sky-300 font-mono">{team.teamLead.phone}</strong></div>
              <div>Personnel Strength: <strong className="text-white">{team.memberCount} Rescuers</strong></div>
            </div>

            {/* Equipment Inventory */}
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                Specialized Equipment Inventory
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-2 rounded-lg bg-navy/60 border border-cobalt/15">
                  Boats: <strong className="text-sky-300">{team.equipment.boats}</strong>
                </div>
                <div className="p-2 rounded-lg bg-navy/60 border border-cobalt/15">
                  Ambulances: <strong className="text-warning">{team.equipment.ambulances}</strong>
                </div>
                <div className="p-2 rounded-lg bg-navy/60 border border-cobalt/15">
                  Life Jackets: <strong className="text-emerald-400">{team.equipment.lifeJackets}</strong>
                </div>
                <div className="p-2 rounded-lg bg-navy/60 border border-cobalt/15">
                  Sat Comms: <strong className="text-white">{team.equipment.satelliteComms ? "YES" : "NO"}</strong>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Capabilities</div>
              <div className="flex flex-wrap gap-1">
                {team.capabilities.map((cap, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-cobalt/20 text-sky-300 border border-cobalt/30 text-[10px] capitalize font-medium"
                  >
                    {cap.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>

            {team.currentAssignmentTitle && (
              <div className="p-2.5 rounded-xl bg-navy border border-cobalt/20 text-xs text-sky-200">
                Assigned: <strong className="text-white">{team.currentAssignmentTitle}</strong>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
