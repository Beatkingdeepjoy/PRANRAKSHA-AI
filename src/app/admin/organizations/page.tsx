"use client";

import { Building2, Shield, Users, PhoneCall, CheckCircle2 } from "lucide-react";

export default function OrganizationsPage() {
  const orgs = [
    {
      id: "org-01",
      name: "National Disaster Response Force (NDRF)",
      type: "Federal Rescue Force",
      district: "1st Battalion Regional HQ, Patgaon",
      contactPerson: "Commandant S. K. Yadav",
      contactPhone: "+91 361 2840001",
      verified: true,
      personnelDeployed: 120,
    },
    {
      id: "org-02",
      name: "Assam State Disaster Management Authority (ASDMA)",
      type: "State Coordination Body",
      district: "Dispur, Guwahati",
      contactPerson: "Dr. Nabajit Barooah",
      contactPhone: "+91 361 2237221",
      verified: true,
      personnelDeployed: 45,
    },
    {
      id: "org-03",
      name: "Assam State Disaster Response Force (SDRF)",
      type: "State Marine & Heavy Rescue Unit",
      district: "Panbazar, Guwahati",
      contactPerson: "Chief Officer P. K. Nath",
      contactPhone: "+91 361 2540222",
      verified: true,
      personnelDeployed: 85,
    },
    {
      id: "org-04",
      name: "Indian Red Cross Society (Assam Branch)",
      type: "Humanitarian Relief Partner",
      district: "Chandmari, Guwahati",
      contactPerson: "Dr. Dipali Bhattacharya",
      contactPhone: "+91 361 2660100",
      verified: true,
      personnelDeployed: 60,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-cobalt/20 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Building2 className="h-6 w-6 text-cobalt" />
          <span>Disaster Management Organizations & Agencies</span>
        </h1>
        <p className="text-xs text-slate-300">
          Accredited military, paramilitary, state civil defence, and accredited humanitarian NGO coordination partners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orgs.map((o) => (
          <div
            key={o.id}
            className="p-6 rounded-3xl bg-midnight border border-cobalt/30 shadow-xl space-y-4 text-xs"
          >
            <div className="flex items-start justify-between border-b border-cobalt/20 pb-3">
              <div>
                <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">{o.type}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{o.name}</h3>
                <div className="text-[11px] text-slate-400">{o.district}</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ACCREDITED
              </span>
            </div>

            <div className="p-3 rounded-xl bg-navy/80 border border-cobalt/20 space-y-1">
              <div>Liaison Officer: <strong className="text-white">{o.contactPerson}</strong></div>
              <div>Direct Control Line: <strong className="text-sky-300 font-mono">{o.contactPhone}</strong></div>
              <div>Active Field Strength: <strong className="text-emerald-400">{o.personnelDeployed} Officers</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
