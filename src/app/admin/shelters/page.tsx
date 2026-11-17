"use client";

import { usePranrakshaStore } from "@/lib/store";
import { Home, Users, CheckCircle2, PhoneCall } from "lucide-react";

export default function AdminSheltersPage() {
  const { shelters } = usePranrakshaStore();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-cobalt/20 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Home className="h-6 w-6 text-emerald-400" />
          <span>Designated Disaster Relief Camps & Shelters</span>
        </h1>
        <p className="text-xs text-slate-300">
          Capacity telemetry, current occupancy rates, water and sanitation amenities across verified high-ground evacuation hubs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shelters.map((shlt) => (
          <div
            key={shlt.id}
            className="p-6 rounded-3xl bg-midnight border border-cobalt/30 shadow-xl space-y-4 text-xs"
          >
            <div className="flex items-start justify-between border-b border-cobalt/20 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{shlt.name}</h3>
                <div className="text-[11px] text-slate-400">{shlt.address}</div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                  shlt.status === "active_open"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-warning/20 text-warning border-warning/40"
                }`}
              >
                {shlt.status.replace("_", " ")}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-navy/80 border border-cobalt/20 text-center font-mono">
              <div>
                <div className="text-[10px] text-slate-400">Total Cap</div>
                <div className="text-base font-bold text-white">{shlt.totalCapacity}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Current Occupants</div>
                <div className="text-base font-bold text-warning">{shlt.currentOccupancy}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Free Spaces</div>
                <div className="text-base font-bold text-emerald-400">
                  {shlt.totalCapacity - shlt.currentOccupancy}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Verified Facilities</div>
              <div className="flex flex-wrap gap-1 text-[10px]">
                {shlt.facilities.drinkingWater && (
                  <span className="px-2 py-0.5 rounded bg-navy text-sky-300 border border-cobalt/20">
                    Drinking Water
                  </span>
                )}
                {shlt.facilities.foodRations && (
                  <span className="px-2 py-0.5 rounded bg-navy text-emerald-300 border border-cobalt/20">
                    Food Rations
                  </span>
                )}
                {shlt.facilities.medicalAid && (
                  <span className="px-2 py-0.5 rounded bg-navy text-purple-300 border border-cobalt/20">
                    Medical Post
                  </span>
                )}
                {shlt.facilities.generatorPower && (
                  <span className="px-2 py-0.5 rounded bg-navy text-yellow-300 border border-cobalt/20">
                    Generator Power
                  </span>
                )}
              </div>
            </div>

            <div className="text-slate-300 pt-1 border-t border-cobalt/10">
              Liaison: <strong className="text-white">{shlt.contactPerson} ({shlt.contactPhone})</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
