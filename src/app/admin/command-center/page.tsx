"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import MapComponent from "@/components/MapComponent";
import { usePranrakshaStore } from "@/lib/store";
import {
  Incident,
  EmergencyCategory,
  IncidentSeverity,
  IncidentStatus,
} from "@/types";
import {
  Radio,
  Search,
  Filter,
  ShieldAlert,
  Users,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
  BrainCircuit,
  PhoneCall,
  Activity,
  Layers,
  ChevronRight,
  Maximize2,
  RefreshCw,
  AlertTriangle,
  Lock,
  LogIn,
  ShieldCheck,
} from "lucide-react";
import { getSeverityBadgeClass, getStatusBadgeClass } from "@/lib/utils";

export default function CommandCenterPage() {
  const {
    currentUser,
    loginUser,
    incidents,
    rescueTeams,
    shelters,
    hospitals,
    hazardZones,
    roadReports,
    verifyIncident,
    assignRescueTeam,
    updateIncidentStatus,
    auditLogs,
    isDemoMode,
  } = usePranrakshaStore();

  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    incidents[0]?.id || null
  );
  const [mobileTab, setMobileTab] = useState<"queue" | "map" | "details">("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");

  const isAdminAuthorized =
    currentUser.isVerified &&
    (currentUser.role === "operator" ||
      currentUser.role === "admin" ||
      currentUser.role === "super_admin");

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const matchSearch =
        inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inc.location.address && inc.location.address.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = selectedCategory === "all" || inc.category === selectedCategory;
      const matchSeverity = selectedSeverity === "all" || inc.severity === selectedSeverity;
      const matchStatus = selectedStatus === "all" || inc.status === selectedStatus;
      const matchDistrict = selectedDistrict === "all" || inc.location.district === selectedDistrict;

      return matchSearch && matchCategory && matchSeverity && matchStatus && matchDistrict;
    });
  }, [incidents, searchQuery, selectedCategory, selectedSeverity, selectedStatus, selectedDistrict]);

  const selectedIncident = useMemo(() => {
    return incidents.find((i) => i.id === selectedIncidentId) || null;
  }, [incidents, selectedIncidentId]);

  // Operational metrics
  const activeCount = incidents.filter(
    (i) => i.status !== "resolved" && i.status !== "closed" && i.status !== "rejected"
  ).length;
  const criticalCount = incidents.filter(
    (i) => i.severity === "critical" && i.status !== "resolved" && i.status !== "closed"
  ).length;
  const pendingVerifyCount = incidents.filter(
    (i) => i.status === "reported" || i.status === "under_verification"
  ).length;
  const availableTeamsCount = rescueTeams.filter((t) => t.status === "available").length;
  const dispatchedTeamsCount = rescueTeams.filter((t) => t.status === "dispatched" || t.status === "on_scene").length;
  const totalAffectedCount = incidents.reduce((acc, i) => acc + (i.affectedCount || 0), 0);
  const resolvedCount = incidents.filter((i) => i.status === "resolved" || i.status === "closed").length;

  // Access control gate: unauthenticated visitors or citizens cannot access command centre
  if (!isAdminAuthorized) {
    return (
      <div className="min-h-screen bg-navy text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
          <div className="max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-midnight border border-cobalt/40 shadow-2xl text-center space-y-6">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-critical/20 border border-critical/40 flex items-center justify-center text-critical shadow-lg shadow-critical/20">
              <Lock className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-critical/20 text-red-300 text-xs font-bold uppercase tracking-wider border border-critical/30">
                <ShieldAlert className="h-3.5 w-3.5 text-critical" />
                <span>SEOC Agartala Operational Area</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Operator Clearance Required
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                Live incident triage, radar radar basemaps, and NDRF rescue column assignments require verified SEOC Operator or Disaster Management credentials.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-navy/80 border border-cobalt/20 text-xs text-left space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-slate-400">Current Session State:</div>
              <div className="font-bold text-white flex items-center justify-between">
                <span>{currentUser.fullName}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cobalt/30 text-sky-300 border border-cobalt/40 font-mono uppercase">
                  {currentUser.role}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Status: <span className="text-amber-400 font-semibold">Public Citizen Access</span>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <Link
                href="/auth/login"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cobalt to-electric hover:from-cobalt/90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cobalt/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In as Emergency Operator</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  loginUser(
                    "ram.chandra@pranraksha.gov.in",
                    "operator",
                    "Ram Chandra Bhattacharjee (Dispatcher)"
                  );
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-navy/90 hover:bg-navy border border-cobalt/40 text-sky-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all hover:border-sky-400"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Demo Bypass: Authenticate as SEOC Dispatcher</span>
              </button>

              <Link
                href="/citizen/dashboard"
                className="block text-xs text-slate-400 hover:text-white underline pt-1"
              >
                ← Return to Citizen Public Safety Portal
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-navy text-foreground overflow-hidden">
      <Navbar />

      {/* Flagship Command Status Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-midnight border-b border-cobalt/30 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
            <Radio className="h-4 w-4 animate-pulse" />
            <span>COMMAND_RADAR_ONLINE</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-3 font-mono">
            <span className="text-slate-300">
              Active: <strong className="text-warning">{activeCount}</strong>
            </span>
            <span className="text-slate-300">
              Critical: <strong className="text-critical">{criticalCount}</strong>
            </span>
            <span className="text-slate-300">
              Pending Verification: <strong className="text-purple-400">{pendingVerifyCount}</strong>
            </span>
            <span className="text-slate-300">
              Teams Dispatched: <strong className="text-sky-300">{dispatchedTeamsCount}</strong> / {rescueTeams.length}
            </span>
            <span className="text-slate-300">
              Affected Persons: <strong className="text-white">{totalAffectedCount}</strong>
            </span>
            <span className="text-slate-300">
              Resolved: <strong className="text-emerald-400">{resolvedCount}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded bg-cobalt/20 text-sky-300 border border-cobalt/40 font-bold">
            LATENCY: 18ms
          </span>
          <span className="text-slate-400">Tripura Emergency Network (SEOC Agartala)</span>
        </div>
      </div>

      {/* Responsive In-Flow Mobile Section Selector (< lg, Never Overlays) */}
      <div className="lg:hidden flex bg-midnight border-b border-cobalt/30 p-1.5 gap-1.5 text-xs">
        <button
          type="button"
          onClick={() => setMobileTab("queue")}
          className={`flex-1 py-2 px-1 text-center font-bold rounded-xl transition-all ${
            mobileTab === "queue"
              ? "bg-cobalt text-white shadow-md border border-sky-400/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Queue ({filteredIncidents.length})
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("map")}
          className={`flex-1 py-2 px-1 text-center font-bold rounded-xl transition-all ${
            mobileTab === "map"
              ? "bg-cobalt text-white shadow-md border border-sky-400/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          GIS Radar Map
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("details")}
          className={`flex-1 py-2 px-1 text-center font-bold rounded-xl transition-all ${
            mobileTab === "details"
              ? "bg-cobalt text-white shadow-md border border-sky-400/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Triage & Dispatch
        </button>
      </div>

      {/* Main 3-Column Command Centre Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Triage & Filter Sidebar (320px) */}
        <aside
          className={`w-full lg:w-80 border-r border-cobalt/20 bg-midnight/90 flex-col overflow-hidden ${
            mobileTab === "queue" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Search & Filter Header */}
          <div className="p-3 border-b border-cobalt/20 space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search code, district, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg bg-navy border border-cobalt/30 pl-8 pr-2 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cobalt"
              />
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="rounded-lg bg-navy border border-cobalt/30 p-1 text-slate-200"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="moderate">Moderate</option>
                <option value="low">Low</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-lg bg-navy border border-cobalt/30 p-1 text-slate-200"
              >
                <option value="all">All Statuses</option>
                <option value="reported">Reported</option>
                <option value="verified">Verified</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Incident List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            <div className="px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Incident Queue ({filteredIncidents.length})</span>
              <span className="text-sky-400">Live Telemetry</span>
            </div>

            {filteredIncidents.map((inc) => {
              const isSelected = inc.id === selectedIncidentId;
              return (
                <button
                  key={inc.id}
                  onClick={() => {
                    setSelectedIncidentId(inc.id);
                    setMobileTab("details");
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-cobalt/25 border-sky-400 ring-2 ring-sky-400/60 shadow-lg shadow-cobalt/30 scale-[1.01]"
                      : "bg-navy/70 hover:bg-navy/90 hover:border-cobalt/40 border-cobalt/15"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-sky-400">{inc.trackingCode}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${getSeverityBadgeClass(
                        inc.severity
                      )}`}
                    >
                      {inc.severity}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">{inc.title}</h4>
                  <div className="text-[10px] text-slate-400 mt-0.5">{inc.location.district}</div>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-cobalt/10 text-[10px]">
                    <span className="text-slate-300">
                      Victims: <strong className="text-white">{inc.affectedCount}</strong>
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-semibold capitalize ${getStatusBadgeClass(
                        inc.status
                      )}`}
                    >
                      {inc.status.replace("_", " ")}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Centre GIS Tactical Map (Flexible Width) */}
        <main
          className={`flex-1 relative flex-col overflow-hidden min-h-0 ${
            mobileTab === "map" ? "flex" : "hidden lg:flex"
          }`}
        >
          <div className="flex-1 relative min-h-[400px]">
            <MapComponent
              incidents={filteredIncidents}
              rescueTeams={rescueTeams}
              hospitals={hospitals}
              shelters={shelters}
              hazardZones={hazardZones}
              roadReports={roadReports}
              selectedIncidentId={selectedIncidentId}
              onSelectIncident={(inc) => {
                setSelectedIncidentId(inc.id);
                setMobileTab("details");
              }}
              centerLat={23.8315}
              centerLng={91.2868}
              zoomLevel={12}
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Bottom Activity Timeline Stream */}
          <div className="h-32 border-t border-cobalt/20 bg-midnight/95 p-2 overflow-y-auto font-mono text-[11px]">
            <div className="flex items-center justify-between px-2 pb-1 border-b border-cobalt/10 text-[10px] uppercase font-bold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Activity className="h-3 w-3 text-sky-400" />
                Live Incident & Dispatch Activity Stream
              </span>
              <span className="text-emerald-400">Stream Connected</span>
            </div>

            <div className="space-y-1 mt-1 px-2">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between text-slate-300 py-0.5">
                  <span className="text-sky-400 font-bold">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span className="text-white mx-2 font-semibold">{log.action}:</span>
                  <span className="flex-1 truncate text-slate-300">{log.details}</span>
                  <span className="text-[10px] text-slate-500">{log.userName}</span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Right Incident Deep-Dive & Quick Dispatch Panel (360px) */}
        <aside
          className={`w-full lg:w-96 border-l border-cobalt/20 bg-midnight/90 flex-col overflow-y-auto p-4 space-y-4 ${
            mobileTab === "details" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Mobile Back / Forward Header */}
          <div className="lg:hidden flex items-center justify-between pb-2 border-b border-cobalt/20">
            <button
              type="button"
              onClick={() => setMobileTab("queue")}
              className="text-xs text-sky-400 hover:text-white font-bold flex items-center gap-1"
            >
              ← Back to Queue
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("map")}
              className="text-xs text-emerald-400 hover:text-white font-bold flex items-center gap-1"
            >
              View on Map →
            </button>
          </div>

          {selectedIncident ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="space-y-1 border-b border-cobalt/20 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-sky-400">
                    {selectedIncident.trackingCode}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityBadgeClass(
                      selectedIncident.severity
                    )}`}
                  >
                    {selectedIncident.severity}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{selectedIncident.title}</h3>
                <div className="text-xs text-slate-400">{selectedIncident.location.address}</div>
              </div>

              {/* AI Recommendation Score Box */}
              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-purple-300 font-bold">
                    <BrainCircuit className="h-4 w-4" />
                    AI Triage Recommendation
                  </span>
                  <span className="text-base font-black text-purple-200">
                    {selectedIncident.aiPriorityScore}/100
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Severity score calculated based on {selectedIncident.affectedCount} trapped persons, presence of vulnerable infants/elderly, and reported fast-rising floodwaters.
                </p>
              </div>

              {/* Incident Stats Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-navy/80 border border-cobalt/20">
                  <div className="text-[10px] text-slate-400">Affected Count</div>
                  <div className="text-sm font-bold text-white">{selectedIncident.affectedCount} Persons</div>
                </div>
                <div className="p-2.5 rounded-lg bg-navy/80 border border-cobalt/20">
                  <div className="text-[10px] text-slate-400">Vulnerable Count</div>
                  <div className="text-sm font-bold text-warning">{selectedIncident.vulnerableCount} Persons</div>
                </div>
                <div className="p-2.5 rounded-lg bg-navy/80 border border-cobalt/20">
                  <div className="text-[10px] text-slate-400">Medical Needed</div>
                  <div className="text-xs font-bold text-critical">
                    {selectedIncident.medicalNeeded ? "YES - URGENT" : "NO"}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-navy/80 border border-cobalt/20">
                  <div className="text-[10px] text-slate-400">Current Status</div>
                  <div className="text-xs font-bold capitalize text-sky-300">
                    {selectedIncident.status.replace("_", " ")}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-3 rounded-lg bg-navy/80 border border-cobalt/20 text-xs space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Incident Description</div>
                <p className="text-slate-200 leading-relaxed">{selectedIncident.description}</p>
              </div>

              {/* Reporter Contact */}
              <div className="p-3 rounded-lg bg-navy/80 border border-cobalt/20 text-xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Field Reporter</div>
                  <div className="font-bold text-white">{selectedIncident.reporter.name}</div>
                </div>
                <a
                  href={`tel:${selectedIncident.reporter.phone}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 font-mono font-bold"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>Call Reporter</span>
                </a>
              </div>

              {/* Quick Dispatch Rescue Team Action */}
              <div className="p-3.5 rounded-xl bg-navy border border-cobalt/30 text-xs space-y-2.5">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Dispatch Rescue Column:</span>
                  <span className="text-[10px] text-sky-400">
                    Assigned: {selectedIncident.assignedTeamName || "None"}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {rescueTeams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => assignRescueTeam(selectedIncident.id, team.id)}
                      className={`w-full text-left p-2 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                        selectedIncident.assignedTeamId === team.id
                          ? "bg-cobalt text-white border-cobalt"
                          : "bg-midnight/80 hover:bg-midnight border-cobalt/20 text-slate-300"
                      }`}
                    >
                      <div>
                        <div className="font-bold">{team.name}</div>
                        <div className="text-[10px] opacity-80">
                          {team.equipment.boats} Boats • {team.status.toUpperCase()}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase">
                        {selectedIncident.assignedTeamId === team.id ? "ASSIGNED" : "DISPATCH"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lifecycle Actions */}
              <div className="space-y-2 pt-2 border-t border-cobalt/20">
                <div className="text-xs font-bold text-white">Manual Status Override:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => verifyIncident(selectedIncident.id)}
                    className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 font-bold"
                  >
                    Verify Incident
                  </button>
                  <button
                    onClick={() => updateIncidentStatus(selectedIncident.id, "resolved")}
                    className="p-2 rounded-lg bg-success/20 hover:bg-success/30 text-emerald-300 border border-success/40 font-bold"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-400 text-xs py-12">
              Select an incident from the queue to view details and dispatch rescue teams.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
