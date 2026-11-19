import Link from "next/link";
import { ShieldAlert, PhoneCall, AlertTriangle, Radio, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-midnight/90 backdrop-blur-2xl text-slate-300">
      {/* Critical Emergency Disclaimer Banner */}
      <div className="bg-critical/15 border-b border-critical/30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-red-200">
            <AlertTriangle className="h-4 w-4 text-critical shrink-0" />
            <span>
              <strong>EMERGENCY NOTICE:</strong> PRANRAKSHA AI is an intelligent coordination platform. In immediate life-threatening danger, always call national emergency helplines directly.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono font-bold text-white">
            <span className="bg-critical/80 px-2.5 py-1 rounded-lg border border-red-400/40 shadow-sm">Police / National: 112</span>
            <span className="bg-amber-600/80 px-2.5 py-1 rounded-lg border border-amber-400/40 shadow-sm">Ambulance: 108</span>
            <span className="bg-cobalt/80 px-2.5 py-1 rounded-lg border border-sky-400/40 shadow-sm">Disaster Helpline: 1070 / 1077</span>
            <span className="bg-red-700/80 px-2.5 py-1 rounded-lg border border-red-500/40 shadow-sm">Fire Services: 101</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & mission */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-cobalt to-sky-400 text-white shadow-lg shadow-cobalt/40 border border-sky-300/30">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <span className="text-base font-black text-white tracking-wide font-mono">PRANRAKSHA AI</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Predict Danger. Connect Help. Save Lives. Next-generation emergency intelligence connecting citizens, rescue agencies (NDRF, TSR, Fire & Rescue), and GIS road intelligence during critical disasters.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span>Telemetry: Tripura (Howrah & Gomati Basins)</span>
          </div>
        </div>

        {/* Citizen Services */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Citizen Services</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/citizen/dashboard#sos" className="hover:text-sky-300 transition-colors">Instant SOS Emergency Button</Link></li>
            <li><Link href="/citizen/report" className="hover:text-sky-300 transition-colors">File Incident Report</Link></li>
            <li><Link href="/citizen/journey" className="hover:text-sky-300 transition-colors">Journey Guardian (Live Check-in)</Link></li>
            <li><Link href="/citizen/dashboard#shelters" className="hover:text-sky-300 transition-colors">Locate Nearest Relief Shelter</Link></li>
            <li><Link href="/citizen/dashboard#hospitals" className="hover:text-sky-300 transition-colors">Hospital Emergency ICU Status</Link></li>
          </ul>
        </div>

        {/* Operational Command */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Operational GIS & Command</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/admin/command-center" className="hover:text-sky-300 transition-colors">Emergency Command Centre</Link></li>
            <li><Link href="/map" className="hover:text-sky-300 transition-colors">Interactive GIS Map & Layers</Link></li>
            <li><Link href="/routes" className="hover:text-sky-300 transition-colors">Roadway & Flood Detour Routing</Link></li>
            <li><Link href="/team/dashboard" className="hover:text-sky-300 transition-colors">Rescue Team Field Terminal</Link></li>
            <li><Link href="/admin/intelligence" className="hover:text-sky-300 transition-colors">AI Disaster Intelligence Engine</Link></li>
          </ul>
        </div>

        {/* Partner Organizations */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Participating Agencies</h4>
          <p className="text-xs text-slate-400 mb-2 leading-relaxed">
            Integrated with National Disaster Response Force (NDRF), Tripura State Rifles (TSR), Tripura State Disaster Management Authority (TDMA), and Fire & Emergency Services.
          </p>
          <div className="text-[11px] text-slate-400 font-mono">
            Platform Build v2.5-PROD • Apple Liquid UI
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-4 px-4 text-center text-xs text-slate-500 font-mono">
        © 2026 PRANRAKSHA AI — Built for resilient, real-time humanitarian disaster response in Tripura.
      </div>
    </footer>
  );
}
