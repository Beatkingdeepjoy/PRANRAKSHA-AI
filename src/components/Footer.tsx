import Link from "next/link";
import { ShieldAlert, PhoneCall, AlertTriangle, Radio, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-cobalt/20 bg-midnight text-slate-300">
      {/* Critical Emergency Disclaimer Banner */}
      <div className="bg-critical/15 border-b border-critical/30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-red-200">
            <AlertTriangle className="h-4 w-4 text-critical shrink-0" />
            <span>
              <strong>EMERGENCY NOTICE:</strong> PRANRAKSHA AI is an intelligent coordination platform. In immediate life-threatening danger, always call national emergency helplines directly.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-bold text-white">
            <span className="bg-critical px-2 py-0.5 rounded">Police / National: 112</span>
            <span className="bg-amber-600 px-2 py-0.5 rounded">Medical Ambulance: 108</span>
            <span className="bg-blue-600 px-2 py-0.5 rounded">Disaster Helpline: 1070 / 1077</span>
            <span className="bg-red-700 px-2 py-0.5 rounded">Fire Services: 101</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & mission */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cobalt text-white">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <span className="text-base font-bold text-white tracking-wide">PRANRAKSHA AI</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Predict Danger. Connect Help. Save Lives. Next-generation emergency intelligence connecting citizens, rescue agencies (NDRF, SDRF, Red Cross), and GIS road intelligence during critical disasters.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>Telemetry online: Brahmaputra River Basin</span>
          </div>
        </div>

        {/* Citizen Services */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Citizen Services</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/citizen/dashboard#sos" className="hover:text-sky-300">Instant SOS Emergency Button</Link></li>
            <li><Link href="/citizen/report" className="hover:text-sky-300">File Incident Report</Link></li>
            <li><Link href="/citizen/journey" className="hover:text-sky-300">Journey Guardian (Live Check-in)</Link></li>
            <li><Link href="/citizen/dashboard#shelters" className="hover:text-sky-300">Locate Nearest Relief Shelter</Link></li>
            <li><Link href="/citizen/dashboard#hospitals" className="hover:text-sky-300">Hospital Emergency ICU Status</Link></li>
          </ul>
        </div>

        {/* Operational Command */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Operational GIS & Command</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/admin/command-center" className="hover:text-sky-300">Emergency Command Centre</Link></li>
            <li><Link href="/map" className="hover:text-sky-300">Interactive GIS Map & Layers</Link></li>
            <li><Link href="/routes" className="hover:text-sky-300">Roadway & Flood Detour Routing</Link></li>
            <li><Link href="/team/dashboard" className="hover:text-sky-300">Rescue Team Field Terminal</Link></li>
            <li><Link href="/admin/intelligence" className="hover:text-sky-300">AI Disaster Intelligence Engine</Link></li>
          </ul>
        </div>

        {/* Partner Organizations */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Participating Agencies</h4>
          <p className="text-xs text-slate-400 mb-2">
            Integrated with National Disaster Response Force (NDRF), Tripura State Rifles (TSR), Tripura State Disaster Management Authority (TDMA), Indian Red Cross Society, and Fire & Emergency Services.
          </p>
          <div className="text-[11px] text-slate-500 font-mono">
            Platform Build v2.4-PROD • Cobalt Sky Design System
          </div>
        </div>
      </div>

      <div className="border-t border-cobalt/10 py-4 px-4 text-center text-xs text-slate-500">
        © 2026 PRANRAKSHA AI — Built for resilient, real-time humanitarian disaster response.
      </div>
    </footer>
  );
}
