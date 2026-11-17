"use client";

import { useState } from "react";
import { UserCheck, Shield, Users, Building, CheckCircle2 } from "lucide-react";
import { UserProfile } from "@/types";

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserProfile[]>([
    {
      id: "usr-01",
      fullName: "Dr. Nabajit Barooah",
      phone: "+91 94350 11029",
      email: "nabajit.barooah@asdma.gov.in",
      role: "super_admin",
      organization: "Assam State Disaster Management Authority",
      badgeNumber: "ASDMA-SEC-01",
      district: "Kamrup Metropolitan",
      isVerified: true,
    },
    {
      id: "usr-02",
      fullName: "Rahul Sengupta",
      phone: "+91 98640 12345",
      email: "rahul.sengupta@pranraksha.gov.in",
      role: "operator",
      organization: "State Emergency Operations Centre (SEOC)",
      badgeNumber: "SEOC-OP-402",
      district: "Kamrup Metropolitan",
      isVerified: true,
    },
    {
      id: "usr-03",
      fullName: "Inspector R. K. Meena",
      phone: "+91 94350 99821",
      email: "rk.meena@ndrf.gov.in",
      role: "team_member",
      organization: "NDRF 1st Bn Patgaon",
      badgeNumber: "NDRF-CMD-09",
      district: "Kamrup Rural",
      isVerified: true,
    },
    {
      id: "usr-04",
      fullName: "Kaushik Goswami",
      phone: "+91 98640 44102",
      email: "kaushik.assam@gmail.com",
      role: "volunteer",
      organization: "Civil Defense Corps",
      district: "Kamrup Metropolitan",
      isVerified: true,
    },
    {
      id: "usr-05",
      fullName: "Bikash Kalita",
      phone: "+91 98640 12894",
      email: "bikash.k@gmail.com",
      role: "citizen",
      district: "Kamrup Rural",
      isVerified: true,
    },
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-cobalt/20 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <UserCheck className="h-6 w-6 text-sky-400" />
          <span>User Access Control & Role-Based Permissions (RBAC)</span>
        </h1>
        <p className="text-xs text-slate-300">
          Enforces server-grade authorization across 6 distinct operational roles: Citizen, Volunteer, Rescue Team, Operator, Admin, and Super Admin.
        </p>
      </div>

      <div className="rounded-2xl border border-cobalt/20 bg-midnight overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy border-b border-cobalt/20 text-[10px] uppercase font-bold text-slate-400">
              <tr>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">Organization</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Badge ID</th>
                <th className="p-3.5 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cobalt/10">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-navy/40 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-white">{u.fullName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{u.id}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cobalt/20 text-sky-300 border border-cobalt/40">
                      {u.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-300">{u.organization || "Public Citizen"}</td>
                  <td className="p-3.5 font-mono text-slate-300">{u.phone}</td>
                  <td className="p-3.5 font-mono text-xs text-sky-400">{u.badgeNumber || "—"}</td>
                  <td className="p-3.5 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
