"use client";

import { usePranrakshaStore } from "@/lib/store";
import { BarChart3, TrendingUp, PieChart, Clock, ShieldAlert, Users } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";

export default function AnalyticsPage() {
  const { incidents } = usePranrakshaStore();

  const districtData = [
    { name: "Kamrup Metro", count: 5 },
    { name: "Kamrup Rural", count: 2 },
    { name: "Nagaon", count: 1 },
    { name: "Cachar (Silchar)", count: 2 },
    { name: "Dibrugarh", count: 1 },
    { name: "Majuli", count: 1 },
  ];

  const categoryData = [
    { name: "Flood Inundation", value: 4, color: "#2563eb" },
    { name: "Landslide", value: 1, color: "#f59e0b" },
    { name: "Medical Urgent", value: 1, color: "#8b5cf6" },
    { name: "Road Accident", value: 1, color: "#dc2626" },
    { name: "Fire / Industrial", value: 1, color: "#ea580c" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-cobalt/20 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-sky-400" />
          <span>Disaster Operations Analytics & Performance Metrics</span>
        </h1>
        <p className="text-xs text-slate-300">
          Empirical emergency resolution speeds, geographic incident distribution, and multi-district trend telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District Breakdown Chart */}
        <div className="p-6 rounded-3xl bg-midnight border border-cobalt/30 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Incident Frequency by District
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b1736",
                    borderColor: "#3b82f6",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="p-6 rounded-3xl bg-midnight border border-cobalt/30 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Incidents by Hazard Classification
          </h2>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b1736",
                    borderColor: "#3b82f6",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
