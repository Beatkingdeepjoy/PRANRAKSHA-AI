"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MapComponent from "@/components/MapComponent";
import { usePranrakshaStore } from "@/lib/store";
import {
  ShieldAlert,
  Radio,
  MapPin,
  Route,
  Cpu,
  Users,
  Compass,
  ArrowRight,
  LifeBuoy,
  Activity,
  AlertTriangle,
  Waves,
  Building2,
  Ambulance,
  PhoneCall,
  CheckCircle2,
  BrainCircuit,
  Eye,
  FileCheck,
  Sparkles,
  LogIn,
  UserPlus,
} from "lucide-react";

export default function HomePage() {
  const { incidents, rescueTeams, shelters, hospitals, hazardZones, roadReports } =
    usePranrakshaStore();

  const activeIncidents = incidents.filter(
    (i) => i.status !== "resolved" && i.status !== "closed" && i.status !== "rejected"
  );
  const criticalCount = activeIncidents.filter((i) => i.severity === "critical").length;
  const totalAffected = incidents.reduce((acc, i) => acc + (i.affectedCount || 0), 0);

  return (
    <div className="min-h-screen bg-navy text-foreground flex flex-col relative overflow-hidden">
      {/* Background Liquid Ambient Light Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-cobalt/20 via-electric/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-3/4 right-0 w-[500px] h-[400px] bg-gradient-to-br from-sky-400/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-14 pb-20 border-b border-cobalt/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Top Operational Pill with Liquid Glass */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-liquid text-sky-200 text-xs font-semibold tracking-wide shadow-xl shadow-cobalt/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-critical opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-critical"></span>
              </span>
              <span>TRIPURA STATE DISASTER NETWORK • LIVE SEOC AGARTALA MONITORING</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight font-sans">
              Every Second Matters. <br />
              <span className="bg-gradient-to-r from-sky-300 via-electric to-cobalt bg-clip-text text-transparent">
                Every Life Counts.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              An intelligent emergency response network connecting citizens across Tripura with AI hazard prediction, GIS flood mapping, and rapid rescue team coordination.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
              <Link
                href="/citizen/dashboard#sos"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-critical hover:from-red-600 hover:to-red-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-2xl shadow-critical/40 border border-red-400/40 transition-all hover:scale-105 active:scale-95"
              >
                <ShieldAlert className="h-5 w-5" />
                <span>Report Emergency SOS</span>
              </Link>

              <Link
                href="/admin/command-center"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cobalt via-electric to-sky-500 hover:from-cobalt hover:to-sky-400 text-white font-bold text-sm tracking-wide shadow-xl shadow-cobalt/30 border border-sky-400/40 transition-all hover:scale-105 active:scale-95"
              >
                <Radio className="h-5 w-5" />
                <span>Explore Command Centre</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/auth/register"
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl glass-liquid hover:bg-white/10 text-sky-200 border border-cobalt/40 text-sm font-semibold transition-all hover:scale-105"
              >
                <UserPlus className="h-4 w-4 text-sky-400" />
                <span>Sign Up / Volunteer</span>
              </Link>
            </div>

            {/* Live Metrics Quick Strip (Liquid Glass Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 max-w-4xl mx-auto text-left">
              <div className="p-4 rounded-3xl glass-liquid-card border border-cobalt/30">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Emergencies</div>
                <div className="text-2xl font-black text-white mt-1">{activeIncidents.length}</div>
                <div className="text-[10px] text-amber-400 font-medium">Tripura Basin Alert</div>
              </div>

              <div className="p-4 rounded-3xl glass-liquid-card border border-critical/30">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Critical Priority</div>
                <div className="text-2xl font-black text-critical mt-1">{criticalCount}</div>
                <div className="text-[10px] text-red-300 font-medium">NDRF / TSR Active</div>
              </div>

              <div className="p-4 rounded-3xl glass-liquid-card border border-cobalt/30">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">People Affected</div>
                <div className="text-2xl font-black text-sky-300 mt-1">{totalAffected}</div>
                <div className="text-[10px] text-slate-400 font-medium">Shelter Assisted</div>
              </div>

              <div className="p-4 rounded-3xl glass-liquid-card border border-emerald-500/30">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Rescue Units Ready</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">{rescueTeams.length}</div>
                <div className="text-[10px] text-emerald-300 font-medium">NDRF / TSR / Fire Units</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Emergency Map Preview Section (Tripura GIS) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-cobalt/20 relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                <MapPin className="h-4 w-4" />
                <span>Tripura GIS Operational Intelligence</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Live Interactive Emergency GIS Radar
              </h2>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Real-time spatial visualization displaying active rescue incidents across Agartala, Howrah river flood inundation polygons, emergency hospital ICU bed telemetry, and passable road networks.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/map"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cobalt hover:bg-cobalt/90 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cobalt/30 transition-all hover:scale-105"
              >
                <span>Open Fullscreen Map</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Embedded Live Map with Guaranteed Dimensions */}
          <div className="h-[520px] w-full rounded-3xl overflow-hidden border border-cobalt/30 shadow-2xl relative">
            <MapComponent
              incidents={incidents}
              rescueTeams={rescueTeams}
              hospitals={hospitals}
              shelters={shelters}
              hazardZones={hazardZones}
              roadReports={roadReports}
              centerLat={23.8315}
              centerLng={91.2868}
              zoomLevel={12}
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* End-to-End Rescue Workflow Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-cobalt/20 bg-navy/90">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="text-xs font-bold text-sky-400 uppercase tracking-widest">Accountability & Verification</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              The 8-Stage Life-Saving Workflow
            </h2>
            <p className="text-sm text-slate-300">
              Every emergency follows an auditable, trackable lifecycle from the initial citizen SOS to supervisor verification, eliminating duplicate reports and ensuring complete closure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "Reported & Geotagged",
                desc: "Citizen presses SOS or submits emergency report. Device GPS accuracy radius & vulnerable count captured instantly.",
                icon: ShieldAlert,
                color: "text-amber-400 border-amber-500/30",
              },
              {
                step: "02",
                title: "AI NLP Triage & Duplicate Check",
                desc: "Embeddings model flags duplicate reports in the same radius. AI prioritizes based on medical need & trapped victims.",
                icon: BrainCircuit,
                color: "text-purple-400 border-purple-500/30",
              },
              {
                step: "03",
                title: "Operator Telephonic Verification",
                desc: "SEOC Agartala Dispatcher reviews citizen report, confirms severity, examines photos, and validates geographic location.",
                icon: FileCheck,
                color: "text-sky-400 border-sky-500/30",
              },
              {
                step: "04",
                title: "Rescue Team Dispatched",
                desc: "Nearest available NDRF 1st Bn / TSR squad with matching capabilities (e.g., Gemini boat, high-axle ambulance) dispatched.",
                icon: Users,
                color: "text-cyan-400 border-cyan-500/30",
              },
              {
                step: "05",
                title: "Team En Route with Live Routing",
                desc: "Rescue commanders receive dynamic turn-by-turn routing avoiding flooded Howrah culverts and Baramura landslides.",
                icon: Route,
                color: "text-orange-400 border-orange-500/30",
              },
              {
                step: "06",
                title: "Assistance in Progress",
                desc: "On-site evacuation begins. Live telemetry communicates remaining rooftop victims and medical transfers to HQ.",
                icon: Activity,
                color: "text-yellow-400 border-yellow-500/30",
              },
              {
                step: "07",
                title: "Assistance Completed",
                desc: "Field commander uploads photo evidence and marks victims transferred to safe relief camp or hospital.",
                icon: CheckCircle2,
                color: "text-emerald-400 border-emerald-500/30",
              },
              {
                step: "08",
                title: "Supervisor Audit & Closure",
                desc: "District Emergency Officer conducts closing review and logs incident into immutable audit registry.",
                icon: ShieldAlert,
                color: "text-blue-400 border-blue-500/30",
              },
            ].map((st) => (
              <div
                key={st.step}
                className="p-5 rounded-3xl glass-liquid-card hover:border-sky-400/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black font-mono text-slate-500 group-hover:text-sky-400 transition-colors">
                    {st.step}
                  </span>
                  <div className={`p-2 rounded-xl bg-navy/80 border ${st.color}`}>
                    <st.icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{st.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Intelligence Engine Explanation (Tripura Hydro-Predictor) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-cobalt/20 bg-midnight/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                <BrainCircuit className="h-4 w-4" />
                <span>AI DISASTER INTELLIGENCE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Predictive Hazard Analytics & Neural Dispatch
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                PRANRAKSHA AI synthesizes live hydrological telemetry from the Central Water Commission, Open-Meteo precipitation models, and crowdsourced field reports across Tripura to forecast danger before it escalates.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0 text-purple-300">
                    <Waves className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Howrah & Gomati Flood Crest Modeling</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Monitors river gauge markers against danger marks in Agartala, Udaipur, and Kailashahar with 6 to 12 hour inundation forecast warnings.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-8 w-8 rounded-lg bg-cobalt/20 border border-cobalt/40 flex items-center justify-center shrink-0 text-sky-300">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">DBSCAN Spatial Incident Clustering</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Automatically clusters multiple distress calls within 500m into single operational rescue zones, preventing duplicated resource dispatch.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-300">
                    <Route className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Hazard-Aware Road Intelligence</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Evaluates OpenStreetMap road vectors against flooded road segments and Baramura hill landslides, warning rescue columns before they enter trapped corridors.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/admin/intelligence"
                  className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 uppercase tracking-wider"
                >
                  <span>Explore AI Engine Benchmarks</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* AI Engine Interactive Telemetry Panel (Liquid Glass) */}
            <div className="rounded-3xl glass-liquid p-6 sm:p-8 border border-white/10 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-white">
                    AI_ANALYSIS_STREAM :: TRIPURA_BASIN_01
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  CONFIDENCE: 97.4%
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-midnight/90 border border-cobalt/20 font-mono text-xs space-y-2">
                <div className="text-sky-300 font-bold">» HYDROLOGICAL MODEL OUTPUT:</div>
                <div className="text-slate-300 text-[11px] leading-relaxed">
                  "Station Howrah (Agartala) gauge reached 11.24m (74cm ABOVE extreme danger mark). Inundation risk critical for Baldakhal, Radhanagar, and Pratapgarh lowlands. Recommended immediate preventive evacuation for 85 households."
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-navy/80 border border-cobalt/20">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Rainfall 24h Gauge</div>
                  <div className="text-lg font-black text-warning mt-1">168.4 mm</div>
                  <div className="text-[10px] text-red-400">Baramura Monsoon Alert</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-navy/80 border border-cobalt/20">
                  <div className="text-[10px] uppercase font-bold text-slate-400">DBSCAN Incident Cluster</div>
                  <div className="text-lg font-black text-sky-300 mt-1">6 Reports Grouped</div>
                  <div className="text-[10px] text-emerald-400">Radius: 400m around Baldakhal</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-xs space-y-1.5">
                <div className="text-purple-300 font-bold flex items-center justify-between">
                  <span>AI Recommended Dispatch:</span>
                  <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded-full text-purple-200 border border-purple-400/30">
                    Optimal Match
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Dispatch NDRF 1st Bn Detachment Agartala (Equipped with 4 Inflatable Gemini Boats) due to 1.3m water depth preventing wheeled vehicle transit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Quick Access CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 glass-liquid border-b border-cobalt/20 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Need Immediate Emergency Rescue in Tripura?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Report directly from your phone with precise GPS coordinates, request immediate boat or medical support, and notify your emergency contacts in one click.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/citizen/dashboard#sos"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-critical hover:from-red-600 hover:to-red-500 text-white font-black text-sm uppercase tracking-wider shadow-2xl shadow-critical/50 transition-all hover:scale-105 active:scale-95"
            >
              TRIGGER CITIZEN SOS NOW
            </Link>
            <Link
              href="/citizen/journey"
              className="px-6 py-4 rounded-2xl glass-liquid hover:bg-white/10 text-sky-200 font-bold text-sm transition-all hover:scale-105"
            >
              Start Monitored Journey Guardian
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
