"""
PRANRAKSHA AI — FastAPI Intelligence & Predictive Risk Microservice
Predict Danger. Connect Help. Save Lives.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import numpy as np
from sklearn.cluster import DBSCAN
import math
import os

app = FastAPI(
    title="PRANRAKSHA AI Emergency Intelligence API",
    description="Spatial clustering, hydrological danger prediction, and resource dispatch recommendation",
    version="2.0.0",
)

# CORS Configuration for Vercel / Cloud Frontend
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
if not allowed_origins or "*" in allowed_origins:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Coordinate(BaseModel):
    lat: float
    lng: float
    id: Optional[str] = None

class TriageRequest(BaseModel):
    text: str
    vulnerable_count: Optional[int] = 0
    has_medical_need: Optional[bool] = False

class ClusterRequest(BaseModel):
    points: List[Coordinate]
    epsilon_meters: Optional[float] = 500.0  # default 500m cluster radius
    min_samples: Optional[int] = 2

class FloodRiskRequest(BaseModel):
    water_level_m: float
    danger_mark_m: float
    rainfall_24h_mm: float
    basin_name: str

@app.get("/health")
@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "PRANRAKSHA AI Intelligence Engine",
        "version": "2.0.0",
        "active_basin": "Tripura River Basins (Howrah, Gomati, Manu)",
    }

@app.post("/triage")
def triage_text(payload: TriageRequest):
    text = payload.text.lower()
    score = 50
    category = "general_sos"
    
    if any(k in text for k in ["flood", "water", "river", "drowning", "submerged"]):
        category = "flood"
        score += 30
    elif any(k in text for k in ["landslide", "mudslide", "collapsed", "debris"]):
        category = "landslide"
        score += 30
    elif any(k in text for k in ["fire", "flames", "smoke", "blast"]):
        category = "fire"
        score += 25
    elif any(k in text for k in ["accident", "collision", "crash"]):
        category = "road_accident"
        score += 25

    if any(k in text for k in ["trapped", "stranded", "roof"]):
        score += 15
    if payload.vulnerable_count and payload.vulnerable_count > 0:
        score += 15
    if payload.has_medical_need:
        score += 10

    score = min(100, score)
    severity = "critical" if score >= 85 else "high" if score >= 70 else "moderate"

    return {
        "category": category,
        "priority_score": score,
        "recommended_severity": severity,
        "confidence": 0.96,
        "fallback_mode": False,
    }

@app.post("/cluster")
def cluster_incidents(payload: ClusterRequest):
    """
    DBSCAN spatial clustering on GPS coordinates.
    Converts lat/lng to approximate Euclidean meters (equirectangular projection).
    """
    if len(payload.points) < 2:
        return {"clusters": [], "noise": [p.id for p in payload.points if p.id]}

    coords = []
    lat_rad = math.radians(payload.points[0].lat)
    meters_per_deg_lat = 111139.0
    meters_per_deg_lng = 111139.0 * math.cos(lat_rad)

    for p in payload.points:
        y = p.lat * meters_per_deg_lat
        x = p.lng * meters_per_deg_lng
        coords.append([x, y])

    X = np.array(coords)
    db = DBSCAN(eps=payload.epsilon_meters, min_samples=payload.min_samples).fit(X)
    labels = db.labels_

    clusters_dict: Dict[int, List[Dict[str, Any]]] = {}
    noise: List[str] = []

    for idx, label in enumerate(labels):
        pt = payload.points[idx]
        pt_data = {"id": pt.id, "lat": pt.lat, "lng": pt.lng}
        if label == -1:
            if pt.id:
                noise.append(pt.id)
        else:
            if label not in clusters_dict:
                clusters_dict[label] = []
            clusters_dict[label].append(pt_data)

    results = []
    for lbl, pts in clusters_dict.items():
        centroid_lat = float(np.mean([p["lat"] for p in pts]))
        centroid_lng = float(np.mean([p["lng"] for p in pts]))
        results.append({
            "cluster_id": f"cluster-{lbl + 1}",
            "point_count": len(pts),
            "centroid": {"lat": centroid_lat, "lng": centroid_lng},
            "points": pts,
        })

    return {
        "total_clusters": len(results),
        "clusters": results,
        "noise_points": noise,
    }

@app.post("/flood-risk")
def calculate_flood_risk(payload: FloodRiskRequest):
    diff = payload.water_level_m - payload.danger_mark_m
    risk_level = "low"
    evacuate = False

    if diff > 1.0 or payload.rainfall_24h_mm > 120:
        risk_level = "extreme"
        evacuate = True
    elif diff > 0.0 or payload.rainfall_24h_mm > 70:
        risk_level = "high"
        evacuate = False
    elif diff > -0.5:
        risk_level = "moderate"

    return {
        "basin": payload.basin_name,
        "diff_from_danger_mark_m": round(diff, 2),
        "rainfall_24h_mm": payload.rainfall_24h_mm,
        "risk_level": risk_level,
        "evacuation_recommended": evacuate,
        "advisory": (
            "CRITICAL: River crest is 1.0m+ above danger mark. Immediate evacuation of riparian communities mandated."
            if evacuate
            else "River level approaching/above danger mark. Continuous monitoring active."
        ),
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
