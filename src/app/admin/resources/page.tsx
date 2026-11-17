"use client";

import { usePranrakshaStore } from "@/lib/store";
import { Box, LifeBuoy, Ambulance, Droplets, Utensils, Zap, Shield } from "lucide-react";

export default function ResourceManagementPage() {
  const { resources } = usePranrakshaStore();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-cobalt/20 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Box className="h-6 w-6 text-cobalt" />
          <span>Strategic Disaster Resource Inventory</span>
        </h1>
        <p className="text-xs text-slate-300">
          Tracking physical availability of high-clearance ambulances, Gemini inflatable powerboats, water filtration hubs, and emergency nutritional kits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res) => (
          <div
            key={res.id}
            className="p-6 rounded-3xl bg-midnight border border-cobalt/30 shadow-xl space-y-4 text-xs"
          >
            <div className="flex items-start justify-between border-b border-cobalt/20 pb-3">
              <div>
                <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">
                  {res.type.replace("_", " ")}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{res.name}</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {res.condition}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-navy/80 border border-cobalt/20 text-center font-mono">
              <div>
                <div className="text-[10px] text-slate-400">Total Stock</div>
                <div className="text-base font-bold text-white">{res.totalQuantity}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Deployed</div>
                <div className="text-base font-bold text-warning">{res.deployedQuantity}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Available</div>
                <div className="text-base font-bold text-emerald-400">{res.availableQuantity}</div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              Base Depot: <strong className="text-white">{res.baseDistrict}</strong>
            </div>

            {/* Availability Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Deployment Ratio</span>
                <span>{Math.round((res.deployedQuantity / res.totalQuantity) * 100)}% active</span>
              </div>
              <div className="w-full bg-navy h-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-cobalt h-full"
                  style={{ width: `${(res.deployedQuantity / res.totalQuantity) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
