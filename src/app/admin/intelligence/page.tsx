"use client";

import { useState } from "react";
import { usePranrakshaStore } from "@/lib/store";
import {
  BrainCircuit,
  Cpu,
  Layers,
  Sparkles,
  Waves,
  Search,
  Activity,
  CheckCircle2,
  AlertTriangle,
  FileText,
  RefreshCw,
} from "lucide-react";

export default function AIIntelligencePage() {
  const { incidents, rescueTeams, hazardZones } = usePranrakshaStore();

  const [inputQuery, setInputQuery] = useState(
    "River water rapidly entered our house near Bharalu sluice gate. 5 family members including an 80yo grandmother stranded on rooftop. Water level rising fast."
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    category: string;
    confidence: number;
    priorityScore: number;
    recommendedSeverity: string;
    detectedKeywords: string[];
    clusterMatch: string | null;
    recommendedTeam: string;
    operationalSummary: string;
  } | null>({
    category: "flood",
    confidence: 0.98,
    priorityScore: 94,
    recommendedSeverity: "critical",
    detectedKeywords: ["River water", "sluice gate", "80yo grandmother", "stranded on rooftop", "rising fast"],
    clusterMatch: "cluster-flood-saraighat (Distance: 620m)",
    recommendedTeam: "NDRF 1st Battalion Alpha Boat Unit (Inflatable Motorboats)",
    operationalSummary:
      "Life-safety flood emergency with vulnerable geriatric individual marooned on rooftop. Direct road transit compromised. Immediate motorized boat deployment advised.",
  });

  const runNeuralTriage = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);

    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisResult({
        category: "flood",
        confidence: 0.96,
        priorityScore: 92,
        recommendedSeverity: "critical",
        detectedKeywords: ["water entered", "rooftop", "elderly", "rising fast"],
        clusterMatch: "cluster-flood-saraighat",
        recommendedTeam: "SDRF Assam Marine Evacuation Column",
        operationalSummary:
          "High priority flood stranding. AI recommends prioritizing over non-trapped urban waterlogging reports.",
      });
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-cobalt/20 pb-4">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
          <BrainCircuit className="h-4 w-4" />
          <span>Machine Learning & Neural Decision Support</span>
        </div>
        <h1 className="text-2xl font-black text-white mt-1">AI Intelligence & Spatial Clustering Engine</h1>
        <p className="text-xs text-slate-300">
          Autonomous natural language triage, sentence-transformer duplicate identification, DBSCAN geographic clustering, and resource optimization.
        </p>
      </div>

      {/* Model & Providers Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-midnight border border-cobalt/20 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">NLP Classifier Model</div>
          <div className="font-bold text-white">RoBERTa Disaster / Fallback</div>
          <div className="text-[10px] text-emerald-400">Inference Active (8ms latency)</div>
        </div>

        <div className="p-4 rounded-2xl bg-midnight border border-cobalt/20 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Duplicate Embeddings</div>
          <div className="font-bold text-white">MiniLM-L6 Cosine Similarity</div>
          <div className="text-[10px] text-sky-400">Threshold: 0.82 Similarity</div>
        </div>

        <div className="p-4 rounded-2xl bg-midnight border border-cobalt/20 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Spatial Clustering</div>
          <div className="font-bold text-white">DBSCAN (Epsilon: 500m)</div>
          <div className="text-[10px] text-purple-300">2 Active Clusters Grouped</div>
        </div>

        <div className="p-4 rounded-2xl bg-midnight border border-cobalt/20 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Flood Telemetry Engine</div>
          <div className="font-bold text-white">CWC Hydro-Predictor</div>
          <div className="text-[10px] text-amber-300">Brahmaputra Rising Forecast</div>
        </div>
      </div>

      {/* Interactive AI Triage Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Citizen Report */}
        <div className="p-6 rounded-3xl bg-midnight border border-cobalt/30 shadow-2xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span>Interactive NLP Report Triage Simulator</span>
          </h2>
          <p className="text-xs text-slate-300">
            Test how PRANRAKSHA AI extracts incident categories, assesses urgency, detects trapped elderly/children, and matches rescue equipment.
          </p>

          <form onSubmit={runNeuralTriage} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Raw Emergency Distress Text</label>
              <textarea
                rows={5}
                required
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="w-full rounded-2xl bg-navy border border-cobalt/30 p-3 text-white leading-relaxed placeholder-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={analyzing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cobalt hover:from-purple-500 text-white font-bold uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
            >
              <BrainCircuit className="h-4 w-4" />
              <span>{analyzing ? "Running Neural Inference..." : "Run AI Triage & Assessment"}</span>
            </button>
          </form>
        </div>

        {/* Right: AI Output & Operational Briefing */}
        {analysisResult && (
          <div className="p-6 rounded-3xl bg-midnight border border-purple-500/40 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-cobalt/20 pb-3">
              <span className="text-xs font-bold uppercase text-purple-300 font-mono">
                AI_CLASSIFICATION_OUTPUT
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                CONFIDENCE: {(analysisResult.confidence * 100).toFixed(1)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-navy/80 border border-cobalt/20">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Category Detected</div>
                <div className="text-base font-black text-white uppercase">{analysisResult.category}</div>
              </div>

              <div className="p-3 rounded-xl bg-navy/80 border border-critical/30">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Priority Score</div>
                <div className="text-xl font-black text-critical">{analysisResult.priorityScore}/100</div>
              </div>
            </div>

            {/* Extracted Entities */}
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                Named Entity Extraction (Vulnerabilities & Threat)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.detectedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-semibold"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Operational Briefing */}
            <div className="p-3.5 rounded-xl bg-navy/90 border border-cobalt/20 space-y-1.5">
              <div className="text-[10px] font-bold uppercase text-sky-400">Generated Operational Briefing:</div>
              <p className="text-slate-200 leading-relaxed text-xs">{analysisResult.operationalSummary}</p>
            </div>

            {/* Recommended Equipment */}
            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1">
              <div className="text-[10px] font-bold uppercase text-purple-300">Recommended Resource Matching:</div>
              <div className="font-bold text-white">{analysisResult.recommendedTeam}</div>
            </div>
          </div>
        )}
      </div>

      {/* DBSCAN Spatial Clustering Visualization Table */}
      <div className="p-6 rounded-3xl bg-midnight border border-cobalt/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-4 w-4 text-sky-400" />
            <span>Active DBSCAN Spatial Incident Clusters</span>
          </h3>
          <span className="text-xs text-slate-400">Epsilon: 500m radius threshold</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-navy/80 border border-cobalt/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white font-mono">CLUSTER_01: Saraighat North Bank Inundation</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-critical/20 text-critical border border-critical/30">
                4 Calls Grouped
              </span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Centroid: 26.1856°N, 91.6922°E. Combines rooftop distress calls from Amingaon Sector 4 and Saraighat riverside. Dispatched as single multi-boat operation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-navy/80 border border-cobalt/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white font-mono">CLUSTER_02: Nabagraha Slope Mudslide</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-warning/20 text-warning border border-warning/30">
                2 Calls Grouped
              </span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Centroid: 26.1912°N, 91.7645°E. Combines residential collapse and blocked approach road reports into unified SDRF heavy rescue mission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
