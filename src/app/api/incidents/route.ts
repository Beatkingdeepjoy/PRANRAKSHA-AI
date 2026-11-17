import { NextRequest, NextResponse } from "next/server";
import { INITIAL_INCIDENTS } from "@/lib/demo-data";
import { Incident } from "@/types";

// In-memory incidents storage for API route requests
let incidentsStore: Incident[] = [...INITIAL_INCIDENTS];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const severity = searchParams.get("severity");
  const status = searchParams.get("status");

  let result = [...incidentsStore];

  if (category && category !== "all") {
    result = result.filter((i) => i.category === category);
  }
  if (severity && severity !== "all") {
    result = result.filter((i) => i.severity === severity);
  }
  if (status && status !== "all") {
    result = result.filter((i) => i.status === status);
  }

  return NextResponse.json({
    success: true,
    total: result.length,
    incidents: result,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const trackingCode = `PR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newIncident: Incident = {
      id: `inc-${Date.now()}`,
      trackingCode,
      title: body.title || "Emergency Incident Reported",
      description: body.description || "",
      category: body.category || "general_sos",
      severity: body.severity || "high",
      status: "reported",
      location: body.location || {
        lat: 23.8315,
        lng: 91.2868,
        address: "Agartala Municipal Corporation Area",
        district: "West Tripura",
        state: "Tripura",
      },
      affectedCount: body.affectedCount || 1,
      vulnerableCount: body.vulnerableCount || 0,
      vulnerableDetails: body.vulnerableDetails,
      medicalNeeded: body.medicalNeeded ?? false,
      reporter: body.reporter || {
        id: "usr-anon",
        name: "Anonymous Citizen",
        phone: "Unspecified",
      },
      aiPriorityScore: body.severity === "critical" ? 95 : 75,
      aiCategoryConfidence: 0.95,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    incidentsStore = [newIncident, ...incidentsStore];

    return NextResponse.json({
      success: true,
      message: "Emergency incident recorded successfully",
      incident: newIncident,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create incident" },
      { status: 400 }
    );
  }
}
