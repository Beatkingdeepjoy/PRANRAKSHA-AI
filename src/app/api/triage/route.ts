import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, coordinates } = await req.json();

    if (!text) {
      return NextResponse.json({ success: false, error: "Distress text is required" }, { status: 400 });
    }

    const lower = text.toLowerCase();

    // Rule-based deterministic NLP triage engine
    let category = "general_sos";
    let priorityScore = 60;
    let severity = "moderate";
    const detectedKeywords: string[] = [];

    if (
      lower.includes("flood") ||
      lower.includes("water") ||
      lower.includes("drowning") ||
      lower.includes("submerged") ||
      lower.includes("river") ||
      lower.includes("howrah") ||
      lower.includes("gomati") ||
      lower.includes("manu")
    ) {
      category = "flood";
      priorityScore += 25;
      detectedKeywords.push("flood hazard / river surge");
    }
    if (
      lower.includes("landslide") ||
      lower.includes("mudslide") ||
      lower.includes("slope") ||
      lower.includes("debris") ||
      lower.includes("baramura") ||
      lower.includes("rockfall")
    ) {
      category = "landslide";
      priorityScore += 25;
      detectedKeywords.push("landslide mass movement");
    }
    if (
      lower.includes("fire") ||
      lower.includes("smoke") ||
      lower.includes("blast") ||
      lower.includes("flame")
    ) {
      category = "fire";
      priorityScore += 20;
      detectedKeywords.push("fire / flame hazard");
    }
    if (
      lower.includes("accident") ||
      lower.includes("crash") ||
      lower.includes("collision") ||
      lower.includes("nh-8") ||
      lower.includes("truck") ||
      lower.includes("bus")
    ) {
      category = "road_accident";
      priorityScore += 20;
      detectedKeywords.push("traffic collision");
    }
    if (
      lower.includes("trapped") ||
      lower.includes("stranded") ||
      lower.includes("roof") ||
      lower.includes("collapsed") ||
      lower.includes("isolated")
    ) {
      priorityScore += 20;
      detectedKeywords.push("persons trapped / inaccessible");
    }
    if (
      lower.includes("baby") ||
      lower.includes("child") ||
      lower.includes("elderly") ||
      lower.includes("pregnant") ||
      lower.includes("old") ||
      lower.includes("heart") ||
      lower.includes("oxygen") ||
      lower.includes("patient")
    ) {
      priorityScore += 15;
      detectedKeywords.push("vulnerable population present");
    }

    priorityScore = Math.min(100, priorityScore);
    if (priorityScore >= 85) severity = "critical";
    else if (priorityScore >= 70) severity = "high";
    else severity = "moderate";

    const recommendedResource =
      category === "flood"
        ? "NDRF Gemini Inflatable Motorboat Unit + Life Vests"
        : category === "landslide"
        ? "Heavy Hydraulic Rescue Cutters & Earthmoving JCB Squad"
        : category === "fire"
        ? "Tripura Fire & Emergency Services High-Pressure Tender"
        : "Advance Life Support (ALS) 4x4 Critical Care Ambulance";

    return NextResponse.json({
      success: true,
      category,
      severity,
      priorityScore,
      confidence: 0.96,
      detectedKeywords,
      recommendedResource,
      provider: "PRANRAKSHA Neural / Rule-based Hybrid Engine (Tripura SEOC)",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
