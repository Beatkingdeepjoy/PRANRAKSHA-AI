"use client";

import { usePranrakshaStore } from "@/lib/store";
import { FileText, Shield, Lock, Search } from "lucide-react";
import { useState } from "react";

export default function AuditLogsPage() {
  const { auditLogs } = usePranrakshaStore();
  const [search, setSearch] = useState("");

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.entityId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cobalt/20 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-sky-400" />
            <span>Immutable Security Audit Log Trail</span>
          </h1>
          <p className="text-xs text-slate-300">
            Append-only cryptographic record of all operator dispatches, report verifications, priority modifications, and administrative overrides.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
          <Lock className="h-3.5 w-3.5" />
          <span>TAMPER-EVIDENT REGISTRY</span>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter audit logs by action, dispatcher, or entity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl bg-midnight border border-cobalt/30 pl-9 pr-3 py-2 text-xs text-white"
        />
      </div>

      <div className="rounded-2xl border border-cobalt/20 bg-midnight overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-navy border-b border-cobalt/20 text-[10px] uppercase font-bold text-slate-400">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Operator</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Entity</th>
                <th className="p-3.5">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cobalt/10">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-navy/40 transition-colors">
                  <td className="p-3.5 text-slate-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3.5 text-white font-bold">{log.userName}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-cobalt/20 text-sky-300 border border-cobalt/30">
                      {log.userRole.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-3.5 text-warning font-bold">{log.action}</td>
                  <td className="p-3.5 text-sky-400">{log.entityId}</td>
                  <td className="p-3.5 text-slate-200 text-[11px] font-sans">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
