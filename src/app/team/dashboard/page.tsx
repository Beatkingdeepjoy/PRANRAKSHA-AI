"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePranrakshaStore } from "@/lib/store";
import {
  Users,
  ShieldAlert,
  Radio,
  CheckCircle2,
  Navigation,
  LifeBuoy,
  PhoneCall,
  Activity,
  ArrowRight,
  FileCheck,
  AlertTriangle,
  Send,
  UploadCloud,
  ChevronRight,
} from "lucide-react";
import { getSeverityBadgeClass, getStatusBadgeClass } from "@/lib/utils";

export default function TeamDashboardPage() {
  const {
    incidents,
    rescueTeams,
    updateIncidentStatus,
    currentUser,
    logAction,
  } = usePranrakshaStore();

  // Active simulated team
  const currentTeam = rescueTeams[0]; // NDRF 1st Bn Alpha Boat Unit

  // Incidents assigned to this team
  const assignedIncidents = incidents.filter(
    (i) => i.assignedTeamId === currentTeam.id || i.status === "assigned" || i.status === "en_route" || i.status === "in_progress"
  );

  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(
    assignedIncidents[0]?.id || "inc-001"
  );
  const [progressNote, setProgressNote] = useState("");
  const [evidenceNote, setEvidenceNote] = useState("");

  const activeIncident = incidents.find((i) => i.id === selectedIncidentId);

  const handleUpdateStatus = (
    newStatus: "en_route" | "in_progress" | "resolved",
    note: string
  ) => {
    if (!activeIncident) return;
    updateIncidentStatus(activeIncident.id, newStatus, note);
    alert(`Status updated to: ${newStatus.replace("_", " ").toUpperCase()}`);
  };

  const handleAddProgressNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progressNote.trim() || !activeIncident) return;
    updateIncidentStatus(activeIncident.id, activeIncident.status, progressNote);
    setProgressNote("");
    alert("Field progress report transmitted to SEOC Command!");
  };

  return (
    <div className="min-h-screen bg-navy text-foreground flex flex-col relative overflow-hidden">
      {/* Background Organic Liquid Ambient Glow Orbs */}
      <div className="absolute top-10 right-1/4 w-[450px] h-[450px] bg-cobalt/20 rounded-full blur-3xl animate-liquid-morph pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-electric/15 rounded-full blur-3xl animate-liquid-morph pointer-events-none" style={{ animationDelay: "-6s" }} />

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative z-10">
        {/* Rescue Team Operational Header */}
        <div className="p-6 rounded-[2rem] liquid-card flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <Radio className="h-4 w-4 animate-pulse text-emerald-400" />
              <span>Field Terminal • National Disaster Response Force</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{currentTeam.name}</h1>
            <p className="text-xs text-slate-300">
              Commander: <strong className="text-white">{currentTeam.teamLead.name}</strong> • Base: {currentTeam.baseLocation.address}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Dynamic Island Readiness Badge */}
            <div className="dynamic-island px-4 py-2 flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="text-left">
                <div className="text-[9px] uppercase font-bold text-slate-400 leading-none">Readiness</div>
                <div className="font-bold text-emerald-400 text-xs uppercase tracking-wider mt-0.5">
                  {currentTeam.status.replace("_", " ")}
                </div>
              </div>
            </div>

            <div className="dynamic-island px-4 py-2 flex items-center gap-2">
              <div className="text-left">
                <div className="text-[9px] uppercase font-bold text-slate-400 leading-none">Missions</div>
                <div className="font-bold text-white text-xs font-mono mt-0.5">{assignedIncidents.length} Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment & Personnel Readiness Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl liquid-card">
            <div className="text-[10px] uppercase font-bold text-slate-400">Inflatable Boats</div>
            <div className="text-xl font-black text-sky-300 mt-1">{currentTeam.equipment.boats} Gemini IRBs</div>
          </div>
          <div className="p-4 rounded-2xl liquid-card">
            <div className="text-[10px] uppercase font-bold text-slate-400">Personnel</div>
            <div className="text-xl font-black text-white mt-1">{currentTeam.memberCount} Rescuers</div>
          </div>
          <div className="p-4 rounded-2xl liquid-card">
            <div className="text-[10px] uppercase font-bold text-slate-400">Life Jackets</div>
            <div className="text-xl font-black text-emerald-400 mt-1">{currentTeam.equipment.lifeJackets} Units</div>
          </div>
          <div className="p-4 rounded-2xl liquid-card">
            <div className="text-[10px] uppercase font-bold text-slate-400">Trauma Kits</div>
            <div className="text-xl font-black text-purple-400 mt-1">{currentTeam.equipment.medicalKits} Advance</div>
          </div>
          <div className="p-4 rounded-2xl liquid-card col-span-2 sm:col-span-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Satellite Comms</div>
            <div className="text-xl font-black text-emerald-400 mt-1">ONLINE / ACTIVE</div>
          </div>
        </div>

        {/* Main Grid: Mission Queue & Mission Control */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Assigned Incidents Queue */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-warning" />
                <span>Assigned Incident Queue</span>
              </h2>
              <span className="text-xs text-sky-300 font-mono font-bold">{assignedIncidents.length}</span>
            </div>

            <div className="space-y-3">
              {assignedIncidents.map((inc) => {
                const isSelected = inc.id === selectedIncidentId;
                return (
                  <button
                    key={inc.id}
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ios-spring ${
                      isSelected
                        ? "liquid-card border-sky-400 shadow-lg shadow-cobalt/30 ring-1 ring-sky-400"
                        : "liquid-card border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-mono font-bold text-sky-400">{inc.trackingCode}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadgeClass(inc.status)}`}>
                        {inc.status.replace("_", " ")}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white mt-1.5 line-clamp-1">{inc.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{inc.description}</p>
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/10 text-[10px] text-slate-400">
                      <span>Affected: <strong className="text-white">{inc.affectedCount}</strong></span>
                      <span className="text-sky-300 font-semibold flex items-center gap-1">
                        Select Mission <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Mission Operational Command */}
          {activeIncident ? (
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-[2rem] liquid-card space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-sky-400">{activeIncident.trackingCode}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityBadgeClass(activeIncident.severity)}`}>
                        {activeIncident.severity}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mt-1">{activeIncident.title}</h2>
                  </div>

                  {/* Incident Lifecycle Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {activeIncident.status === "assigned" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus("en_route", "Team departed base en route with 4 boats.")
                        }
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-600/30 transition-all ios-spring"
                      >
                        Depart Base (En Route)
                      </button>
                    )}

                    {activeIncident.status === "en_route" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus("in_progress", "Team arrived on scene. Launching Geminis.")
                        }
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:opacity-95 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-yellow-500/30 transition-all ios-spring"
                      >
                        Report Arrived (On Scene)
                      </button>
                    )}

                    {activeIncident.status === "in_progress" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus("resolved", "All stranded persons safely rescued & transferred to shelter.")
                        }
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all ios-spring"
                      >
                        Mark Assistance Completed
                      </button>
                    )}
                  </div>
                </div>

                {/* Incident Coordinates & Geography */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-navy/80 border border-white/10 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Geographic Target</div>
                    <div className="font-bold text-white">{activeIncident.location.address}</div>
                    <div className="text-[11px] font-mono text-sky-400">
                      {activeIncident.location.lat.toFixed(4)}°N, {activeIncident.location.lng.toFixed(4)}°E
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-navy/80 border border-white/10 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Reporter & Contact</div>
                    <div className="font-bold text-white">{activeIncident.reporter.name}</div>
                    <a
                      href={`tel:${activeIncident.reporter.phone}`}
                      className="text-[11px] text-emerald-400 font-mono font-bold flex items-center gap-1"
                    >
                      <PhoneCall className="h-3 w-3" />
                      <span>{activeIncident.reporter.phone}</span>
                    </a>
                  </div>
                </div>

                {/* Situation Description & Accessibility */}
                <div className="p-4 rounded-2xl bg-navy/70 border border-white/10 text-xs space-y-2">
                  <div className="text-slate-400 font-semibold uppercase text-[10px]">Field Intel & Access:</div>
                  <p className="text-slate-200 leading-relaxed">{activeIncident.description}</p>
                  {activeIncident.accessibilityNotes && (
                    <div className="text-warning text-[11px]">
                      <strong>Access Warning:</strong> {activeIncident.accessibilityNotes}
                    </div>
                  )}
                </div>

                {/* Live Activity Timeline & Field Notes */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Mission Audit Stream</h4>
                  <div className="space-y-2">
                    {activeIncident.internalNotes && activeIncident.internalNotes.length > 0 ? (
                      activeIncident.internalNotes.map((note, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-navy/90 border border-white/10 text-xs text-slate-300 font-mono flex items-start gap-2.5"
                        >
                          <Activity className="h-3.5 w-3.5 text-sky-400 shrink-0 mt-0.5" />
                          <span>{note}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-500">No notes recorded yet.</div>
                    )}
                  </div>
                </div>

                {/* Transmit Live Field Update Form */}
                <form onSubmit={handleAddProgressNote} className="space-y-2 pt-2 border-t border-white/10">
                  <label className="block text-xs font-bold text-white uppercase tracking-wider">
                    Transmit Real-time Progress Update to SEOC
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={progressNote}
                      onChange={(e) => setProgressNote(e.target.value)}
                      placeholder="e.g. 12 persons rescued via Gemini boat 2. Water depth receding..."
                      className="flex-1 rounded-2xl glass-liquid-input p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cobalt to-electric hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 ios-spring"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Transmit</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 p-12 rounded-[2rem] liquid-card text-center text-slate-400">
              Select an incident from the queue to take operational command.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
