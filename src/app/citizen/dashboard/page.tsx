"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePranrakshaStore } from "@/lib/store";
import {
  ShieldAlert,
  MapPin,
  HeartPulse,
  Navigation,
  Compass,
  PhoneCall,
  Users,
  Building,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Route,
  Activity,
  VolumeX,
  Volume2,
  Lock,
} from "lucide-react";
import { calculateDistanceKm, getSeverityBadgeClass, getStatusBadgeClass } from "@/lib/utils";
import { EmergencyCategory, IncidentSeverity } from "@/types";

export default function CitizenDashboardPage() {
  const {
    incidents,
    reportIncident,
    shelters,
    hospitals,
    emergencyContacts,
    activeJourney,
    currentUser,
  } = usePranrakshaStore();

  // Real device GPS state
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
  }>({
    lat: 23.8315,
    lng: 91.2868,
    accuracy: 6.5,
  });

  // SOS activation state
  const [isHoldingSos, setIsHoldingSos] = useState(false);
  const [sosProgress, setSosProgress] = useState(0); // 0 to 100%
  const [sosTriggeredModal, setSosTriggeredModal] = useState(false);
  const [silentAlert, setSilentAlert] = useState(false);
  const [recentGeneratedCode, setRecentGeneratedCode] = useState<string | null>(null);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Quick report details modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [emergencyType, setEmergencyType] = useState<EmergencyCategory>("flood");
  const [affectedCount, setAffectedCount] = useState(2);
  const [hasVulnerable, setHasVulnerable] = useState(true);
  const [medicalAssistance, setMedicalAssistance] = useState(true);
  const [description, setDescription] = useState("");

  // Request actual device GPS
  const refreshGpsLocation = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      setGpsLoading(true);
      setGpsError(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
          setGpsLoading(false);
        },
        (err) => {
          console.warn("Geolocation notice:", err.message);
          setGpsError(err.message);
          setGpsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  useEffect(() => {
    refreshGpsLocation();
  }, []);

  // SOS Hold-to-Activate (Accidental trigger protection)
  const startHold = () => {
    setIsHoldingSos(true);
    setSosProgress(0);

    const startTime = Date.now();
    const duration = 2000; // 2 seconds hold

    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setSosProgress(progress);

      if (progress >= 100) {
        clearInterval(holdTimerRef.current!);
        setIsHoldingSos(false);
        setSosProgress(0);
        triggerSosEmergency();
      }
    }, 50);
  };

  const endHold = () => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsHoldingSos(false);
    setSosProgress(0);
  };

  const triggerSosEmergency = () => {
    const newInc = reportIncident({
      title: "CITIZEN SOS DISTRESS CALL",
      description: `Instant SOS activated from mobile device. Coordinates: ${currentCoords.lat.toFixed(4)}°N, ${currentCoords.lng.toFixed(4)}°E (Accuracy: ±${Math.round(currentCoords.accuracy || 10)}m). ${silentAlert ? "[Silent SOS mode selected]" : ""}`,
      category: "general_sos",
      severity: "critical",
      location: {
        lat: currentCoords.lat,
        lng: currentCoords.lng,
        address: "Agartala Municipal Area (GPS Tagged)",
        district: "West Tripura",
        state: "Tripura",
        accuracyMeters: currentCoords.accuracy,
      },
      affectedCount: 1,
      vulnerableCount: 0,
      medicalNeeded: true,
      reporter: {
        id: currentUser.id,
        name: currentUser.fullName,
        phone: currentUser.phone,
      },
    });

    setRecentGeneratedCode(newInc.trackingCode);
    setSosTriggeredModal(true);
  };

  const submitDetailedReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newInc = reportIncident({
      title: `${emergencyType.replace("_", " ").toUpperCase()} REPORT`,
      description: description || `Reported ${emergencyType} emergency requiring immediate field response.`,
      category: emergencyType,
      severity: "critical",
      location: {
        lat: currentCoords.lat,
        lng: currentCoords.lng,
        address: "Field Reported Location via GPS",
        district: "West Tripura",
        state: "Tripura",
        accuracyMeters: currentCoords.accuracy,
      },
      affectedCount: Number(affectedCount),
      vulnerableCount: hasVulnerable ? 1 : 0,
      medicalNeeded: medicalAssistance,
      reporter: {
        id: currentUser.id,
        name: currentUser.fullName,
        phone: currentUser.phone,
      },
    });

    setReportModalOpen(false);
    setRecentGeneratedCode(newInc.trackingCode);
    setSosTriggeredModal(true);
    setDescription("");
  };

  // Nearby shelters sorted by distance
  const nearbyShelters = shelters
    .map((s) => ({
      ...s,
      distanceKm: calculateDistanceKm(currentCoords.lat, currentCoords.lng, s.lat, s.lng),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  // Nearby hospitals sorted by distance
  const nearbyHospitals = hospitals
    .map((h) => ({
      ...h,
      distanceKm: calculateDistanceKm(currentCoords.lat, currentCoords.lng, h.lat, h.lng),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  // My active reports
  const myIncidents = incidents.filter(
    (i) => i.reporter.id === currentUser.id || i.trackingCode === recentGeneratedCode
  );

  return (
    <div className="min-h-screen bg-navy text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome & GPS Telemetry Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-midnight border border-cobalt/30 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
              <HeartPulse className="h-4 w-4" />
              <span>Citizen Emergency Protection Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Welcome, {currentUser.fullName}
            </h1>
            <p className="text-xs text-slate-400">
              Your device is monitored by the State Emergency Operations Centre (SEOC).
            </p>
          </div>

          {/* GPS Status Card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-navy/90 border border-cobalt/20 text-xs">
            <div className="h-9 w-9 rounded-lg bg-cobalt/20 border border-cobalt/40 flex items-center justify-center text-sky-300 shrink-0">
              <Navigation className={`h-5 w-5 ${gpsLoading ? "animate-spin text-sky-400" : "animate-pulse"}`} />
            </div>
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <span className={`h-2 w-2 rounded-full ${gpsLoading ? "bg-amber-400 animate-pulse" : "bg-emerald-400 animate-ping"}`} />
                  <span>{gpsLoading ? "Detecting GPS..." : "GPS Location Acquired"}</span>
                </div>
                <button
                  type="button"
                  onClick={refreshGpsLocation}
                  className="text-[10px] text-sky-400 hover:text-white font-bold underline cursor-pointer"
                >
                  Refresh GPS
                </button>
              </div>
              <div className="text-[11px] font-mono text-slate-300">
                {currentCoords.lat.toFixed(4)}°N, {currentCoords.lng.toFixed(4)}°E (±{Math.round(currentCoords.accuracy || 10)}m)
              </div>
            </div>
          </div>
        </div>

        {/* SOS Emergency Hub (Flagship Section) */}
        <section id="sos" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large Emergency SOS Hold Button */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-critical/20 via-midnight to-midnight border-2 border-critical/40 shadow-2xl space-y-6 text-center flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Pulsing Radians */}
            <div className="absolute inset-0 bg-red-600/5 animate-pulse pointer-events-none" />

            <div className="space-y-2 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-critical/20 text-red-300 text-xs font-bold uppercase tracking-wider border border-critical/30">
                <ShieldAlert className="h-4 w-4 text-critical" />
                <span>Immediate Threat to Life</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Press & Hold for Emergency SOS
              </h2>
              <p className="text-xs text-slate-300">
                Hold for 2 seconds to prevent accidental triggers. Transmits your live coordinates immediately to NDRF & State Control.
              </p>
            </div>

            {/* Interactive Hold Button */}
            <div className="relative my-4 select-none">
              <button
                onMouseDown={startHold}
                onMouseUp={endHold}
                onMouseLeave={endHold}
                onTouchStart={startHold}
                onTouchEnd={endHold}
                className="relative flex flex-col items-center justify-center h-48 w-48 sm:h-56 sm:w-56 rounded-full bg-gradient-to-br from-red-600 to-critical text-white font-black shadow-2xl shadow-critical/60 border-4 border-red-300/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {/* SVG Progress Ring */}
                <svg className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="46%"
                    className="stroke-red-950/60 fill-none"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="46%"
                    className="stroke-white fill-none transition-all duration-75"
                    strokeWidth="8"
                    strokeDasharray="290%"
                    strokeDashoffset={`${290 - (sosProgress / 100) * 290}%`}
                  />
                </svg>

                <ShieldAlert className="h-12 w-12 sm:h-16 sm:w-16 mb-1 text-white animate-pulse" />
                <span className="text-2xl sm:text-3xl font-black tracking-wider">SOS</span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-red-200 mt-1">
                  {isHoldingSos ? `HOLDING ${Math.round(sosProgress)}%` : "HOLD 2 SECONDS"}
                </span>
              </button>
            </div>

            {/* Silent SOS Option & Accidental Warning */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer bg-navy/80 px-3 py-1.5 rounded-lg border border-cobalt/30">
                <input
                  type="checkbox"
                  checked={silentAlert}
                  onChange={(e) => setSilentAlert(e.target.checked)}
                  className="rounded accent-critical"
                />
                {silentAlert ? (
                  <span className="flex items-center gap-1 text-red-300 font-bold">
                    <VolumeX className="h-3.5 w-3.5" /> Silent Mode (No Siren)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-300">
                    <Volume2 className="h-3.5 w-3.5" /> Audible Alarm Active
                  </span>
                )}
              </label>

              <button
                onClick={() => setReportModalOpen(true)}
                className="text-sky-300 hover:text-white underline font-semibold"
              >
                Need to provide details first? File Detailed Report →
              </button>
            </div>
          </div>

          {/* Emergency Helpline Direct Contacts & Journey Guardian Banner */}
          <div className="space-y-4">
            {/* Journey Guardian Shortcut */}
            <div className="p-5 rounded-2xl bg-midnight border border-cobalt/30 space-y-3">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                <Route className="h-4 w-4" />
                <span>Journey Guardian Mode</span>
              </div>
              <h3 className="text-base font-bold text-white">Traveling Through Flood Zones?</h3>
              <p className="text-xs text-slate-300">
                Start a monitored journey session. If you miss a periodic safe check-in, an automatic escalation alert is sent to your emergency contacts.
              </p>
              <Link
                href="/citizen/journey"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-cobalt hover:bg-cobalt/90 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                <span>Launch Journey Guardian</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Emergency Contacts List */}
            <div className="p-5 rounded-2xl bg-midnight border border-cobalt/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Emergency Contacts ({emergencyContacts.length})
                </h4>
                <span className="text-[10px] text-emerald-400 font-bold">Auto-Notified on SOS</span>
              </div>

              <div className="space-y-2">
                {emergencyContacts.map((cnt) => (
                  <div
                    key={cnt.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-navy/80 border border-cobalt/20 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{cnt.name}</div>
                      <div className="text-[10px] text-slate-400">{cnt.relation}</div>
                    </div>
                    <a
                      href={`tel:${cnt.phone}`}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 font-mono font-bold"
                    >
                      <PhoneCall className="h-3 w-3" />
                      <span>{cnt.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Active Incident Tracking Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-sky-400" />
              <span>Your Active & Recent Incident Reports</span>
            </h2>
            <button
              onClick={() => setReportModalOpen(true)}
              className="text-xs px-3 py-1.5 rounded-lg bg-cobalt/20 hover:bg-cobalt/30 text-sky-300 border border-cobalt/40 font-semibold"
            >
              + File New Report
            </button>
          </div>

          {myIncidents.length === 0 ? (
            <div className="p-8 rounded-2xl bg-midnight/50 border border-cobalt/20 text-center text-xs text-slate-400 space-y-2">
              <CheckCircle2 className="h-8 w-8 text-slate-600 mx-auto" />
              <div>No active emergency incidents currently linked to your profile.</div>
              <p className="text-[11px] text-slate-500">If you need help, use the SOS button above or file a report.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-5 rounded-2xl bg-midnight border border-cobalt/30 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-sky-400">{inc.trackingCode}</span>
                      <h3 className="text-sm font-bold text-white">{inc.title}</h3>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadgeClass(
                        inc.status
                      )}`}
                    >
                      {inc.status.replace("_", " ")}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{inc.description}</p>

                  {/* Incident Lifecycle Progress Bar */}
                  <div className="space-y-1.5 pt-2 border-t border-cobalt/20">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Status: {inc.status.replace("_", " ").toUpperCase()}</span>
                      <span>Assigned: {inc.assignedTeamName || "Triage Pending"}</span>
                    </div>

                    <div className="w-full bg-navy h-2 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full transition-all duration-500 ${
                          inc.status === "resolved" || inc.status === "closed"
                            ? "w-full bg-success"
                            : inc.status === "in_progress"
                            ? "w-4/5 bg-yellow-400"
                            : inc.status === "en_route"
                            ? "w-3/5 bg-orange-400"
                            : inc.status === "assigned"
                            ? "w-2/5 bg-cyan-400"
                            : inc.status === "verified"
                            ? "w-1/4 bg-blue-500"
                            : "w-1/6 bg-amber-400"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Nearby Lifesaving Shelters & Hospitals */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nearby Shelters */}
          <div id="shelters" className="p-5 rounded-2xl bg-midnight border border-cobalt/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building className="h-4 w-4 text-emerald-400" />
                <span>Nearest Safe Relief Camps & Shelters</span>
              </h3>
              <span className="text-[10px] text-slate-400">Live Capacity</span>
            </div>

            <div className="space-y-2.5">
              {nearbyShelters.slice(0, 3).map((shlt) => (
                <div
                  key={shlt.id}
                  className="p-3 rounded-xl bg-navy/80 border border-cobalt/20 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white">{shlt.name}</div>
                    <div className="text-[11px] text-slate-400">{shlt.address}</div>
                    <div className="text-[10px] text-sky-400">
                      Distance: <strong>{shlt.distanceKm.toFixed(1)} km away</strong>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-400">
                      {shlt.totalCapacity - shlt.currentOccupancy} Spaces Free
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {shlt.currentOccupancy}/{shlt.totalCapacity} Occupied
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Hospitals & ICU Availability */}
          <div id="hospitals" className="p-5 rounded-2xl bg-midnight border border-cobalt/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-purple-400" />
                <span>Emergency Hospitals & ICU Bed Status</span>
              </h3>
              <span className="text-[10px] text-slate-400">Verified ICU</span>
            </div>

            <div className="space-y-2.5">
              {nearbyHospitals.slice(0, 3).map((hosp) => (
                <div
                  key={hosp.id}
                  className="p-3 rounded-xl bg-navy/80 border border-cobalt/20 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-white">{hosp.name}</div>
                    <div className="text-[11px] text-slate-400">{hosp.address}</div>
                    <div className="text-[10px] text-sky-400">
                      Distance: <strong>{hosp.distanceKm.toFixed(1)} km away</strong>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-purple-300">
                      {hosp.availableIcuBeds} ICU Beds Open
                    </div>
                    <div className="text-[10px] text-emerald-400">
                      {hosp.availableGeneralBeds} General Beds
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* SOS Activated Success Modal */}
      {sosTriggeredModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/90 backdrop-blur-md">
          <div className="max-w-md w-full rounded-3xl bg-midnight border-2 border-critical p-6 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div className="h-16 w-16 rounded-full bg-critical/20 border-2 border-critical flex items-center justify-center text-critical mx-auto">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest">
                TRACKING ID: {recentGeneratedCode}
              </div>
              <h3 className="text-xl font-black text-white">Emergency Distress Signal Transmitted!</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                State Emergency Operations Centre has received your coordinates. Your designated emergency contacts have been sent SMS alerts. Stay calm and follow safety protocols.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-navy border border-cobalt/30 text-xs text-left space-y-1.5 font-mono">
              <div className="text-sky-300 font-bold">» Transmission Details:</div>
              <div className="text-slate-300 text-[11px]">
                Latitude: {currentCoords.lat.toFixed(5)}°N <br />
                Longitude: {currentCoords.lng.toFixed(5)}°E <br />
                Accuracy Radius: ±{Math.round(currentCoords.accuracy || 10)} meters
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setSosTriggeredModal(false)}
                className="w-full py-3 rounded-xl bg-cobalt hover:bg-cobalt/90 text-white font-bold text-xs uppercase tracking-wider"
              >
                Track Live Rescue Status
              </button>
              <button
                onClick={() => {
                  setSosTriggeredModal(false);
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                Triggered by Accident? Cancel Alert (Dispatcher will verify)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/85 backdrop-blur-md">
          <div className="max-w-lg w-full rounded-3xl bg-midnight border border-cobalt/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-cobalt/20 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-critical" />
                <span>File Citizen Emergency Report</span>
              </h3>
              <button
                onClick={() => setReportModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitDetailedReport} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Emergency Category</label>
                <select
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value as EmergencyCategory)}
                  className="w-full rounded-xl bg-navy border border-cobalt/30 p-2.5 text-white"
                >
                  <option value="flood">Severe Flooding / Marooned Community</option>
                  <option value="landslide">Landslide / Mudslide Collapse</option>
                  <option value="medical">Critical Medical Transport Required</option>
                  <option value="road_accident">Road Accident / Highway Collision</option>
                  <option value="fire">Fire / Explosive Hazard</option>
                  <option value="trapped">Persons Trapped in Building / Structure</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estimated Affected People</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={affectedCount}
                    onChange={(e) => setAffectedCount(Number(e.target.value))}
                    className="w-full rounded-xl bg-navy border border-cobalt/30 p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Vulnerable (Infants/Elderly)</label>
                  <div className="flex items-center gap-3 pt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-200">
                      <input
                        type="checkbox"
                        checked={hasVulnerable}
                        onChange={(e) => setHasVulnerable(e.target.checked)}
                        className="rounded accent-cobalt"
                      />
                      <span>Yes, present</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description & Urgent Needs</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 4 people stranded on roof, rising water level, elderly patient requires insulin..."
                  className="w-full rounded-xl bg-navy border border-cobalt/30 p-2.5 text-white placeholder-slate-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-navy/80 border border-cobalt/20 text-slate-400">
                <div className="font-bold text-white mb-1">Geographic Tagging:</div>
                <div>Lat: {currentCoords.lat.toFixed(5)}°N, Lng: {currentCoords.lng.toFixed(5)}°E (Automatic GPS)</div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-midnight border border-cobalt/30 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-critical hover:bg-critical/90 text-white font-bold uppercase tracking-wider"
                >
                  Submit Emergency Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
