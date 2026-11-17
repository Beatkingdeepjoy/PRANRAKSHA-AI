"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePranrakshaStore } from "@/lib/store";
import {
  Route,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  MapPin,
  Send,
} from "lucide-react";

export default function JourneyGuardianPage() {
  const { emergencyContacts, activeJourney, currentUser, logAction } = usePranrakshaStore();

  const [destination, setDestination] = useState("Amingaon Relief Hub, North Guwahati");
  const [etaMinutes, setEtaMinutes] = useState(45);
  const [checkinInterval, setCheckinInterval] = useState(15);
  const [isJourneyActive, setIsJourneyActive] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60);
  const [safeCheckinCount, setSafeCheckinCount] = useState(2);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Checkin Countdown Timer
  useEffect(() => {
    if (!isJourneyActive) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setAlertTriggered(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isJourneyActive]);

  const handleCheckin = () => {
    setSecondsRemaining(checkinInterval * 60);
    setSafeCheckinCount((prev) => prev + 1);
    setAlertTriggered(false);
    logAction("JOURNEY_CHECKIN", "journey_session", "jrn-active", "User confirmed safe check-in on route.");
    setStatusMessage("Safe check-in confirmed! Emergency contacts notified you are safe.");
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleEndJourney = () => {
    setIsJourneyActive(false);
    logAction("JOURNEY_COMPLETED", "journey_session", "jrn-active", "User safely arrived at destination.");
    setStatusMessage("Journey successfully completed! Monitoring session ended.");
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleStartJourney = (e: React.FormEvent) => {
    e.preventDefault();
    setIsJourneyActive(true);
    setSecondsRemaining(checkinInterval * 60);
    setAlertTriggered(false);
    logAction("JOURNEY_STARTED", "journey_session", "jrn-new", `Started monitored journey to ${destination}`);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-navy text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between border-b border-cobalt/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <Route className="h-4 w-4" />
              <span>Journey Guardian Safe Transit Protocol</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Monitored Safe Journey</h1>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                isJourneyActive
                  ? alertTriggered
                    ? "bg-critical/20 text-critical border-critical animate-pulse"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-slate-700 text-slate-300 border-slate-600"
              }`}
            >
              {isJourneyActive ? (alertTriggered ? "CHECK-IN MISSED" : "MONITORING ACTIVE") : "IDLE"}
            </span>
          </div>
        </div>

        {statusMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between">
            <span>{statusMessage}</span>
            <button onClick={() => setStatusMessage(null)} className="text-emerald-400 hover:text-white font-bold">✕</button>
          </div>
        )}

        {isJourneyActive ? (
          <div className="space-y-6">
            {/* Missed Checkin Alert Warning */}
            {alertTriggered && (
              <div className="p-4 rounded-2xl bg-critical/20 border-2 border-critical text-xs space-y-2 animate-bounce">
                <div className="flex items-center gap-2 text-critical font-bold text-sm">
                  <AlertTriangle className="h-5 w-5" />
                  <span>CHECK-IN WINDOW MISSED!</span>
                </div>
                <p className="text-red-200">
                  You have missed your 15-minute safety check-in. If you do not click &quot;I Am Safe&quot; within 3 minutes, an escalation SMS with your last known GPS coordinates will be automatically transmitted to your emergency contacts.
                </p>
              </div>
            )}

            {/* Live Journey Progress & Safe Check-in Card */}
            <div className="p-6 rounded-3xl bg-midnight border border-cobalt/30 shadow-2xl space-y-6 text-center">
              <div className="space-y-1">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Destination</div>
                <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                  <MapPin className="h-5 w-5 text-sky-400" />
                  <span>{destination}</span>
                </h2>
              </div>

              {/* Countdown Dial */}
              <div className="p-6 rounded-2xl bg-navy/80 border border-cobalt/20 max-w-sm mx-auto space-y-2">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <Clock className="h-4 w-4 text-sky-400" />
                  <span>Next Safe Check-in In:</span>
                </div>
                <div className="text-5xl font-black font-mono text-sky-300 tracking-wider">
                  {formatTimer(secondsRemaining)}
                </div>
                <div className="text-[11px] text-slate-400">
                  {safeCheckinCount} successful safe check-ins logged so far
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <button
                  onClick={handleCheckin}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                >
                  <ShieldCheck className="h-5 w-5" />
                  <span>I AM SAFE (CHECK IN)</span>
                </button>

                <button
                  onClick={handleEndJourney}
                  className="px-6 py-3.5 rounded-xl bg-navy hover:bg-navy/80 border border-cobalt/40 text-slate-300 hover:text-white font-bold text-sm"
                >
                  Safely Arrived / End Journey
                </button>
              </div>
            </div>

            {/* Emergency Contacts Live Notified */}
            <div className="p-5 rounded-2xl bg-midnight border border-cobalt/30 space-y-3">
              <h3 className="text-sm font-bold text-white">Contacts Connected to this Journey:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {emergencyContacts.map((cnt) => (
                  <div
                    key={cnt.id}
                    className="p-3 rounded-xl bg-navy/80 border border-cobalt/20 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white">{cnt.name}</div>
                      <div className="text-[10px] text-slate-400">{cnt.relation}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Live Telemetry Linked
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Start Monitored Journey Form */
          <div className="p-6 rounded-3xl bg-midnight border border-cobalt/30 shadow-2xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Start a Monitored Journey Session</h2>
              <p className="text-xs text-slate-300">
                Your designated contacts will receive SMS updates with your route, expected arrival time, and automatic alerts if you do not check in safely.
              </p>
            </div>

            <form onSubmit={handleStartJourney} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Destination Address / Landmark</label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full rounded-xl bg-navy border border-cobalt/30 p-3 text-white text-sm"
                  placeholder="e.g. Amingaon Relief Hub, IIT Guwahati Campus..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Expected Travel Time (mins)</label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={etaMinutes}
                    onChange={(e) => setEtaMinutes(Number(e.target.value))}
                    className="w-full rounded-xl bg-navy border border-cobalt/30 p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Check-in Interval</label>
                  <select
                    value={checkinInterval}
                    onChange={(e) => setCheckinInterval(Number(e.target.value))}
                    className="w-full rounded-xl bg-navy border border-cobalt/30 p-2.5 text-white"
                  >
                    <option value={10}>Every 10 minutes</option>
                    <option value={15}>Every 15 minutes</option>
                    <option value={30}>Every 30 minutes</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-cobalt hover:bg-cobalt/90 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-cobalt/30"
              >
                Start Monitored Journey
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
