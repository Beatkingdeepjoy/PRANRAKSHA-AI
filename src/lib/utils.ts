import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistanceKm(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

// Calculate great-circle distance between two coordinates in kilometers (Haversine formula)
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function getSeverityBadgeClass(severity: string): string {
  switch (severity) {
    case "critical":
      return "bg-critical/15 text-critical border-critical/30";
    case "high":
      return "bg-warning/15 text-warning border-warning/30";
    case "moderate":
      return "bg-electric/15 text-electric border-electric/30";
    case "low":
    default:
      return "bg-slate-500/15 text-slate-300 border-slate-500/30";
  }
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "reported":
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "under_verification":
      return "bg-purple-500/15 text-purple-400 border-purple-500/30";
    case "verified":
      return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    case "assigned":
      return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
    case "en_route":
      return "bg-orange-500/15 text-orange-400 border-orange-500/30";
    case "in_progress":
      return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
    case "resolved":
    case "closed":
      return "bg-success/15 text-success border-success/30";
    case "rejected":
      return "bg-critical/15 text-critical border-critical/30";
    default:
      return "bg-slate-500/15 text-slate-400 border-slate-500/30";
  }
}

export function formatTimeAgo(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return isoDate;
  }
}
