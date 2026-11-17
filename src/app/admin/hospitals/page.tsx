"use client";

import { usePranrakshaStore } from "@/lib/store";
import { Building, HeartPulse, PhoneCall, CheckCircle2, ShieldAlert } from "lucide-react";

export default function AdminHospitalsPage() {
  const { hospitals } = usePranrakshaStore();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-cobalt/20 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Building className="h-6 w-6 text-purple-400" />
          <span>Regional Emergency Hospitals & Trauma Centers</span>
        </h1>
        <p className="text-xs text-slate-300">
          Live telemetry for available emergency ICU beds, general beds, blood bank inventories, and ambulances.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((hosp) => (
          <div
            key={hosp.id}
            className="p-6 rounded-3xl bg-midnight border border-cobalt/30 shadow-xl space-y-4 text-xs"
          >
            <div className="flex items-start justify-between border-b border-cobalt/20 pb-3">
              <div>
                <span className="text-[10px] font-mono text-purple-300 font-bold uppercase">
                  {hosp.traumaCenterTier} Trauma Center
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{hosp.name}</h3>
                <div className="text-[11px] text-slate-400">{hosp.address}</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-navy/80 border border-cobalt/20">
              <div>
                <div className="text-[10px] text-slate-400">Available ICU Beds</div>
                <div className="text-xl font-black text-purple-400">{hosp.availableIcuBeds}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">General Beds Free</div>
                <div className="text-xl font-black text-emerald-400">{hosp.availableGeneralBeds}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Blood Bank</div>
                <div className="text-xs font-bold text-white capitalize">{hosp.bloodBankStatus.replace("_", " ")}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Active Ambulances</div>
                <div className="text-xs font-bold text-sky-300">{hosp.ambulanceCount} Fleet</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400">Emergency Desk:</span>
              <a href={`tel:${hosp.emergencyPhone}`} className="text-sky-300 font-mono font-bold flex items-center gap-1">
                <PhoneCall className="h-3 w-3" />
                <span>{hosp.emergencyPhone}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
