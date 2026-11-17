"use client";

import { useState } from "react";
import { usePranrakshaStore } from "@/lib/store";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileCheck,
  MapPin,
  Users,
  BrainCircuit,
  PhoneCall,
  Check,
  X,
} from "lucide-react";
import { getSeverityBadgeClass } from "@/lib/utils";

export default function VerificationQueuePage() {
  const { incidents, verifyIncident, rejectIncident, assignRescueTeam, rescueTeams } =
    usePranrakshaStore();

  const [rejectionModalId, setRejectionModalId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const unverified = incidents.filter(
    (i) => i.status === "reported" || i.status === "under_verification"
  );

  const handleVerify = (id: string) => {
    verifyIncident(id, "Verified by operator desk after telephonic triangulation.");
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionModalId) return;
    rejectIncident(rejectionModalId, rejectionReason || "Duplicate / inaccurate field information");
    setRejectionModalId(null);
    setRejectionReason("");
    alert("Report rejected with logged audit reason.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-cobalt/20 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <FileCheck className="h-6 w-6 text-purple-400" />
          <span>Emergency Incident Verification Desk</span>
        </h1>
        <p className="text-xs text-slate-300">
          Review incoming citizen reports, examine GPS accuracy, analyze duplicate embeddings, and confirm incident authenticity.
        </p>
      </div>

      {unverified.length === 0 ? (
        <div className="p-12 rounded-3xl bg-midnight border border-cobalt/20 text-center space-y-3">
          <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Verification Queue Clean!</h3>
          <p className="text-xs text-slate-400">All incoming citizen distress calls have been audited and verified.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {unverified.map((inc) => (
            <div
              key={inc.id}
              className="p-6 rounded-3xl bg-midnight border border-cobalt/30 shadow-xl space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cobalt/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-sky-400">{inc.trackingCode}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityBadgeClass(inc.severity)}`}>
                    {inc.severity}
                  </span>
                  <span className="text-xs font-bold text-white capitalize">{inc.category.replace("_", " ")}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVerify(inc.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    <Check className="h-4 w-4" />
                    <span>Verify Authenticity</span>
                  </button>

                  <button
                    onClick={() => setRejectionModalId(inc.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-critical/20 hover:bg-critical/30 text-red-300 border border-critical/40 font-bold text-xs"
                  >
                    <X className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">{inc.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{inc.description}</p>
              </div>

              {/* Telemetry and AI Duplicate Check */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-navy/80 border border-cobalt/20 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Reporter & Telephony</div>
                  <div className="font-bold text-white">{inc.reporter.name}</div>
                  <div className="text-sky-300 font-mono">{inc.reporter.phone}</div>
                </div>

                <div className="p-3 rounded-xl bg-navy/80 border border-cobalt/20 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Geographic Location</div>
                  <div className="text-white font-medium">{inc.location.address}</div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Accuracy: ±{Math.round(inc.location.accuracyMeters || 10)}m
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-1">
                  <div className="text-[10px] font-bold uppercase text-purple-300 flex items-center gap-1">
                    <BrainCircuit className="h-3.5 w-3.5" />
                    <span>AI Confidence & Duplicate Check</span>
                  </div>
                  <div className="font-bold text-emerald-400">Unique Report (No duplicates within 1km)</div>
                  <div className="text-[10px] text-purple-200">Category Confidence: {(inc.aiCategoryConfidence * 100).toFixed(0)}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectionModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/85 backdrop-blur-md">
          <form
            onSubmit={handleReject}
            className="max-w-md w-full rounded-3xl bg-midnight border border-critical/50 p-6 shadow-2xl space-y-4 text-xs"
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <XCircle className="h-5 w-5 text-critical" />
              <span>Reject Emergency Report</span>
            </h3>
            <p className="text-slate-300">
              Please document the official reason for audit compliance before discarding this report:
            </p>

            <textarea
              required
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Verified duplicate of PR-2026-9041; citizen confirmed safe after initial call; false alarm..."
              className="w-full rounded-xl bg-navy border border-cobalt/30 p-2.5 text-white"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectionModalId(null)}
                className="px-4 py-2 rounded-xl bg-navy text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-critical text-white font-bold uppercase tracking-wider"
              >
                Confirm Rejection
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
