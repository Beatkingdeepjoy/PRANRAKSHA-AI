"use client";

import { usePranrakshaStore } from "@/lib/store";
import { HeartHandshake, CheckCircle2, ShieldCheck, Mail, PhoneCall } from "lucide-react";

export default function VolunteerManagementPage() {
  const { volunteers } = usePranrakshaStore();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-cobalt/20 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <HeartHandshake className="h-6 w-6 text-emerald-400" />
          <span>Volunteer Field Management</span>
        </h1>
        <p className="text-xs text-slate-300">
          Verified civic volunteers, HAM radio operators, first-aid certified responders, and community boatmen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {volunteers.map((vol) => (
          <div
            key={vol.id}
            className="p-6 rounded-3xl bg-midnight border border-cobalt/30 shadow-xl space-y-4 text-xs"
          >
            <div className="flex items-start justify-between border-b border-cobalt/20 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{vol.fullName}</h3>
                <div className="text-[11px] text-slate-400">{vol.district}</div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  vol.status === "active_deployed"
                    ? "bg-warning/20 text-warning border-warning/40"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                }`}
              >
                {vol.status.replace("_", " ")}
              </span>
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-navy/80 border border-cobalt/20">
              <div className="flex items-center gap-2">
                <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-mono text-white">{vol.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-sky-400" />
                <span className="text-slate-300">{vol.email}</span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1">
                Completed Missions: <strong className="text-sky-300">{vol.totalMissions}</strong>
              </div>
            </div>

            {/* Skills */}
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Verified Skills</div>
              <div className="flex flex-wrap gap-1">
                {vol.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {vol.currentTask && (
              <div className="p-2.5 rounded-xl bg-navy border border-cobalt/20 text-xs text-sky-200">
                Current Task: <strong className="text-white">{vol.currentTask}</strong>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
