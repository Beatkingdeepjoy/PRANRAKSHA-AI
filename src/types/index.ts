export type EmergencyCategory =
  | "flood"
  | "landslide"
  | "cyclone"
  | "medical"
  | "fire"
  | "trapped"
  | "structural_collapse"
  | "road_accident"
  | "general_sos";

export type IncidentSeverity = "critical" | "high" | "moderate" | "low";

export type IncidentStatus =
  | "reported"
  | "under_verification"
  | "verified"
  | "assigned"
  | "en_route"
  | "in_progress"
  | "resolved"
  | "closed"
  | "rejected";

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
  district?: string;
  state?: string;
  accuracyMeters?: number;
}

export interface VulnerableDetails {
  elderly?: number;
  children?: number;
  pregnantWomen?: number;
  disabledPersons?: number;
  hasPetsOrLivestock?: boolean;
}

export interface Incident {
  id: string;
  trackingCode: string;
  title: string;
  description: string;
  category: EmergencyCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  location: GeoLocation;
  affectedCount: number;
  vulnerableCount: number;
  vulnerableDetails?: VulnerableDetails;
  medicalNeeded: boolean;
  accessibilityNotes?: string;
  reporter: {
    id: string;
    name: string;
    phone: string;
    isAnonymous?: boolean;
  };
  evidenceUrls?: string[];
  assignedTeamId?: string;
  assignedTeamName?: string;
  rejectionReason?: string;
  internalNotes?: string[];
  aiPriorityScore: number; // 0 - 100
  aiCategoryConfidence: number; // 0 - 1.0
  aiDuplicateClusterId?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  verifiedAt?: string;
  assignedAt?: string;
}

export interface RescueTeam {
  id: string;
  name: string;
  organization: string; // "NDRF 1st Bn", "SDRF Assam", "Red Cross Disaster Squad", "Guwahati Civil Defence", "State Police Rescue Unit", "Fire & Emergency Services"
  capabilities: (
    | "boat_rescue"
    | "medical_first_aid"
    | "flood_evacuation"
    | "search_and_rescue"
    | "high_angle_rope"
    | "fire_response"
    | "airlift_liaison"
  )[];
  status: "available" | "dispatched" | "on_scene" | "resting" | "offline";
  currentAssignmentId?: string;
  currentAssignmentTitle?: string;
  baseLocation: GeoLocation;
  currentLocation: GeoLocation & {
    heading?: number;
    speedKmh?: number;
    lastUpdated: string;
  };
  teamLead: {
    name: string;
    phone: string;
    rank?: string;
  };
  memberCount: number;
  equipment: {
    boats: number;
    ambulances: number;
    lifeJackets: number;
    satelliteComms: boolean;
    medicalKits: number;
  };
}

export interface Volunteer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  district: string;
  skills: string[];
  status: "verified" | "pending_verification" | "rejected" | "active_deployed" | "inactive";
  currentTask?: string;
  totalMissions: number;
  registeredAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  district: string;
  lat: number;
  lng: number;
  totalBeds: number;
  availableGeneralBeds: number;
  availableIcuBeds: number;
  bloodBankStatus: "abundant" | "moderate" | "critical_low";
  ambulanceCount: number;
  emergencyPhone: string;
  traumaCenterTier: "Level 1" | "Level 2" | "Community";
  lastVerifiedAt: string;
}

export interface Shelter {
  id: string;
  name: string;
  address: string;
  district: string;
  lat: number;
  lng: number;
  totalCapacity: number;
  currentOccupancy: number;
  facilities: {
    drinkingWater: boolean;
    foodRations: boolean;
    medicalAid: boolean;
    wheelchairAccess: boolean;
    generatorPower: boolean;
    womenChildrenZone: boolean;
    sanitationBlocks: number;
  };
  status: "active_open" | "near_capacity" | "full" | "closed_temporary";
  contactPerson: string;
  contactPhone: string;
  lastVerifiedAt: string;
}

export interface HazardZone {
  id: string;
  name: string;
  hazardType: "river_flood" | "flash_flood" | "landslide_prone" | "embankment_breach";
  riskLevel: "extreme" | "high" | "moderate";
  polygonCoordinates: [number, number][]; // [lng, lat][]
  center: [number, number]; // [lng, lat]
  riverBasin: string;
  currentWaterLevelM: number;
  dangerMarkM: number;
  rainfall24hMm: number;
  trend: "rapidly_rising" | "rising" | "stable" | "receding";
  alertIssuedAt: string;
  evacuationRecommended: boolean;
}

export interface RoadReport {
  id: string;
  roadName: string;
  highwayNumber?: string;
  district: string;
  status: "open" | "partially_blocked" | "flooded" | "closed_landslide" | "bridge_compromised";
  lat: number;
  lng: number;
  detourAdvice: string;
  waterDepthCm?: number;
  lastVerifiedAt: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  type: "boat" | "ambulance" | "drone" | "water_purifier" | "ration_pack" | "generator" | "life_jacket";
  totalQuantity: number;
  deployedQuantity: number;
  availableQuantity: number;
  baseDistrict: string;
  condition: "ready" | "in_maintenance" | "deployed";
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface JourneySession {
  id: string;
  userId: string;
  userName: string;
  startLocation: GeoLocation;
  destLocation: GeoLocation;
  destAddress: string;
  startedAt: string;
  expectedArrivalAt: string;
  lastCheckinAt: string;
  checkinIntervalMins: number;
  status: "active" | "safe_completed" | "missed_checkin_alert" | "sos_triggered";
  emergencyContacts: { name: string; phone: string }[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email?: string;
  notifyOnSos: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: "citizen" | "volunteer" | "team_member" | "operator" | "admin" | "super_admin";
  organization?: string;
  badgeNumber?: string;
  district: string;
  isVerified: boolean;
  avatarUrl?: string;
}
