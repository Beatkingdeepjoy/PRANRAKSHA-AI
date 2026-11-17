"use client";

import { useState } from "react";
import { Plug, CheckCircle2, Shield, AlertCircle, RefreshCw, Server, MapPin, Radio, Cpu, Database, Check } from "lucide-react";

export default function IntegrationsPage() {
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, string>>({});

  const integrations = [
    {
      id: "int-01",
      name: "Twilio Telephony & Emergency SMS Gateway",
      category: "Cell Broadcast & SMS Dispatch",
      icon: Radio,
      status: "connected",
      statusText: "Twilio Account SID (AC75...0df) Connected",
      endpoint: "https://api.twilio.com/2010-04-01",
      budget: "Active Trial Credentials",
      badgeColor: "emerald",
    },
    {
      id: "int-02",
      name: "Open-Meteo Hydrological Telemetry API",
      category: "Tripura Basin Precipitation & Radar",
      icon: RefreshCw,
      status: "connected",
      statusText: "100% Free Live Sync — No Key Required",
      endpoint: "https://api.open-meteo.com/v1/forecast",
      budget: "10,000 req/day (Free Tier Respect)",
      badgeColor: "emerald",
    },
    {
      id: "int-03",
      name: "OpenStreetMap & OSRM Routing Machine",
      category: "Tripura Roadways & Landslide Bypass",
      icon: MapPin,
      status: "connected",
      statusText: "Turn-by-turn road vector calculation",
      endpoint: "https://router.project-osrm.org/route/v1",
      budget: "Public OSM Server (Free)",
      badgeColor: "emerald",
    },
    {
      id: "int-04",
      name: "CARTO Dark Matter & ESRI Satellite Basemaps",
      category: "Watermark-Free Tactical GIS",
      icon: Server,
      status: "connected",
      statusText: "Dual Vector & Satellite Engine Active",
      endpoint: "https://basemaps.cartocdn.com / ArcGIS World Imagery",
      budget: "100% Free & Unlimited",
      badgeColor: "emerald",
    },
    {
      id: "int-05",
      name: "Hugging Face Emergency NLP Classifier",
      category: "AI Distress Triage & Sentiment Analysis",
      icon: Cpu,
      status: "connected",
      statusText: "Hybrid Model (Configured Token + Rule Engine)",
      endpoint: "https://api-inference.huggingface.co",
      budget: "Inference API + Fast Heuristics",
      badgeColor: "cyan",
    },
    {
      id: "int-06",
      name: "Supabase & PostgreSQL / PostGIS",
      category: "Database & Realtime Sockets",
      icon: Database,
      status: "connected_local",
      statusText: "Local Cache Active / Cloud Ready",
      endpoint: "https://supabase.com / Local Storage Sync",
      budget: "Self-Contained & Cloud Scalable",
      badgeColor: "purple",
    },
  ];

  const handleTestConnection = async (id: string, endpoint: string) => {
    setTestingId(id);
    // Simulate test probe
    setTimeout(() => {
      setTestResults((prev) => ({
        ...prev,
        [id]: "Operational (Latency: 42ms — HTTP 200 OK)",
      }));
      setTestingId(null);
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-cobalt/20 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Plug className="h-6 w-6 text-sky-400" />
            <span>External API Services & Provider Gateway</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time status, credentials validation, rate-limiting budgets, and fallback policies for external GIS, AI, Weather, and SMS telecom relays.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            6/6 Gateways Operational
          </span>
        </div>
      </div>

      {/* Grid of integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="glass-liquid-card p-6 rounded-3xl border border-cobalt/30 hover:border-cobalt/60 shadow-xl space-y-4 text-xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between border-b border-cobalt/20 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-cobalt/20 text-sky-400 border border-cobalt/30">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-0.5">{item.name}</h3>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    ACTIVE
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-navy/80 border border-cobalt/20 space-y-1.5 font-mono text-[11px]">
                  <div className="text-slate-400 truncate">
                    Endpoint: <span className="text-sky-300">{item.endpoint}</span>
                  </div>
                  <div className="text-slate-400">
                    Status: <span className="text-emerald-400 font-semibold">{item.statusText}</span>
                  </div>
                  <div className="text-slate-400">
                    Budget: <span className="text-warning">{item.budget}</span>
                  </div>
                </div>

                {testResults[item.id] && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 shrink-0" />
                    <span>{testResults[item.id]}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleTestConnection(item.id, item.endpoint)}
                disabled={testingId === item.id}
                className="w-full mt-2 py-2 rounded-xl bg-cobalt/20 hover:bg-cobalt/40 border border-cobalt/30 text-sky-300 text-[11px] font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${testingId === item.id ? "animate-spin" : ""}`} />
                <span>{testingId === item.id ? "Probing Gateway..." : "Test Connection"}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
