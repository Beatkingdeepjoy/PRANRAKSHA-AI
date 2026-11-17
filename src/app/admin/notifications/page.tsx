"use client";

import { useState } from "react";
import { Bell, Send, AlertTriangle, CheckCircle2, ShieldAlert, Phone, Radio, Loader2 } from "lucide-react";

export default function NotificationsPage() {
  const [targetDistrict, setTargetDistrict] = useState("West Tripura (Agartala)");
  const [alertLevel, setAlertLevel] = useState("extreme");
  const [targetPhone, setTargetPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState(
    "FLASH FLOOD WARNING: Howrah river level has crossed 10.45m danger mark at Baldakhal. Residents in low-lying riverside wards of Agartala are advised to evacuate to Dasarath Deb Stadium Relief Hub immediately."
  );
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const [broadcastLog, setBroadcastLog] = useState([
    {
      id: "notif-01",
      district: "West Tripura (Agartala)",
      level: "extreme",
      message: "FLASH FLOOD WARNING: Howrah river water crossed 10.45m. Evacuate to Dasarath Deb Stadium.",
      recipients: "185,400 devices (Cell Broadcast)",
      sentAt: "2026-11-17T02:15:00Z",
    },
    {
      id: "notif-02",
      district: "Khowai / Teliamura",
      level: "critical",
      message: "NH-8 Baramura Hill Section impassable due to double mudslide. Diversion active via Mandwi.",
      recipients: "64,200 devices (Cell Broadcast)",
      sentAt: "2026-11-17T01:45:00Z",
    },
    {
      id: "notif-03",
      district: "Gomati (Udaipur)",
      level: "high",
      message: "Maharani barrage sluice gate opening: Gomati river embankment warning in effect.",
      recipients: "92,100 devices (Cell Broadcast)",
      sentAt: "2026-11-17T00:30:00Z",
    },
  ]);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusNotification(null);

    try {
      const res = await fetch("/api/notifications/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          district: targetDistrict,
          level: alertLevel,
          message: alertMessage,
          targetPhone: targetPhone || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const newEntry = {
          id: data.broadcastId,
          district: data.district,
          level: data.level,
          message: data.message,
          recipients: data.deliveryMode === "twilio_live_sms" 
            ? `Live Twilio SMS dispatched to ${targetPhone} & ${data.recipients}`
            : `${data.recipients} (Cell Broadcast Relay)`,
          sentAt: data.sentAt,
        };
        setBroadcastLog([newEntry, ...broadcastLog]);
        setStatusNotification(
          data.deliveryMode === "twilio_live_sms"
            ? `✅ Emergency alert transmitted live via Twilio SMS to ${targetPhone} and queued to ${data.recipients} cell towers!`
            : `✅ Geofenced broadcast successfully pushed to telecom towers across ${targetDistrict} (${data.recipients})!`
        );
      } else {
        alert("Broadcast dispatch error: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Network error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="border-b border-cobalt/20 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Radio className="h-6 w-6 text-amber-400 animate-pulse" />
            <span>Emergency Public Notification & Alert Broadcast</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Tripura State Disaster Management Authority (TDMA) — Geofenced Cell Broadcast, In-App Emergency Push, and Twilio SMS Gateway.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            Twilio Gateway Ready
          </span>
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-cobalt/20 text-sky-300 border border-cobalt/30">
            SEOC Tripura
          </span>
        </div>
      </div>

      {statusNotification && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{statusNotification}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Broadcast Form */}
        <div className="glass-liquid-card p-6 rounded-3xl border border-cobalt/30 shadow-2xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Send className="h-4 w-4 text-sky-400" />
            <span>Issue Geofenced Public Emergency Broadcast</span>
          </h2>

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target District (Tripura)</label>
                <select
                  value={targetDistrict}
                  onChange={(e) => setTargetDistrict(e.target.value)}
                  className="glass-liquid-input w-full rounded-xl p-2.5 text-white"
                >
                  <option value="West Tripura (Agartala)">West Tripura (Agartala)</option>
                  <option value="Gomati (Udaipur)">Gomati (Udaipur)</option>
                  <option value="Unakoti (Kailashahar)">Unakoti (Kailashahar)</option>
                  <option value="Khowai">Khowai</option>
                  <option value="South Tripura (Belonia)">South Tripura (Belonia)</option>
                  <option value="North Tripura (Dharmanagar)">North Tripura (Dharmanagar)</option>
                  <option value="Dhalai (Ambassa)">Dhalai (Ambassa)</option>
                  <option value="Sepahijala (Bishramganj)">Sepahijala (Bishramganj)</option>
                  <option value="All Tripura Districts">All Tripura Districts (State-Wide)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Threat Level</label>
                <select
                  value={alertLevel}
                  onChange={(e) => setAlertLevel(e.target.value)}
                  className="glass-liquid-input w-full rounded-xl p-2.5 text-white"
                >
                  <option value="extreme">Extreme Life Threat (Red)</option>
                  <option value="critical">Critical Hazard (Amber)</option>
                  <option value="advisory">Advisory Notice (Yellow)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                <span>Optional Phone for Live SMS Test (Twilio)</span>
                <span className="text-[10px] text-slate-400 font-normal">Format: +91xxxxxxxxxx</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+919876543210"
                  value={targetPhone}
                  onChange={(e) => setTargetPhone(e.target.value)}
                  className="glass-liquid-input w-full rounded-xl pl-9 pr-3 py-2 text-white font-mono placeholder:text-slate-500"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Leave empty for standard geofenced tower broadcast, or enter an admin/volunteer phone to test live Twilio SMS.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Broadcast Message Body</label>
              <textarea
                rows={4}
                required
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                className="glass-liquid-input w-full rounded-2xl p-3 text-white leading-relaxed resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-critical hover:bg-critical/90 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-critical/30 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Transmitting Alert Relay...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-4 w-4" />
                  <span>Broadcast Emergency Warning</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Transmission History */}
        <div className="glass-liquid-card p-6 rounded-3xl border border-cobalt/20 shadow-2xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-cobalt/20 pb-3 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="h-4 w-4 text-sky-400" />
                <span>Broadcast Delivery Registry</span>
              </h2>
              <span className="text-[10px] font-mono text-slate-400">
                {broadcastLog.length} Broadcasts Recorded
              </span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {broadcastLog.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-navy/60 border border-cobalt/20 hover:border-cobalt/40 transition-all space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-[13px]">{b.district}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {b.recipients}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{b.message}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-cobalt/10">
                    <span className="capitalize font-semibold text-warning">Level: {b.level}</span>
                    <span>Sent: {new Date(b.sentAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
