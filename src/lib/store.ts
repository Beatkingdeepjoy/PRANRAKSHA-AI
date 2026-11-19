"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Incident,
  RescueTeam,
  Hospital,
  Shelter,
  HazardZone,
  RoadReport,
  ResourceItem,
  AuditLogEntry,
  Volunteer,
  EmergencyContact,
  JourneySession,
  UserProfile,
  IncidentStatus,
  IncidentSeverity,
  EmergencyCategory,
} from "@/types";
import {
  INITIAL_INCIDENTS,
  INITIAL_RESCUE_TEAMS,
  INITIAL_HOSPITALS,
  INITIAL_SHELTERS,
  INITIAL_HAZARD_ZONES,
  INITIAL_ROAD_REPORTS,
  INITIAL_RESOURCES,
  INITIAL_VOLUNTEERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_EMERGENCY_CONTACTS,
  INITIAL_JOURNEY_SESSION,
} from "./demo-data";

const STORAGE_KEY_PREFIX = "pranraksha_";

// Default unauthenticated visitor profile (Public Citizen)
export const DEFAULT_USER: UserProfile = {
  id: "usr-guest",
  fullName: "Guest Citizen",
  phone: "+91 94361 00000",
  email: "citizen@tripura.gov.in",
  role: "citizen", // Default unauthenticated role is citizen; operator/admin requires sign-in
  organization: "Tripura Public Safety Network",
  badgeNumber: "CITIZEN-TR",
  district: "West Tripura",
  isVerified: false,
};

export function usePranrakshaStore() {
  const [isClient, setIsClient] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USER);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [rescueTeams, setRescueTeams] = useState<RescueTeam[]>(INITIAL_RESCUE_TEAMS);
  const [hospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [shelters, setShelters] = useState<Shelter[]>(INITIAL_SHELTERS);
  const [hazardZones] = useState<HazardZone[]>(INITIAL_HAZARD_ZONES);
  const [roadReports, setRoadReports] = useState<RoadReport[]>(INITIAL_ROAD_REPORTS);
  const [resources, setResources] = useState<ResourceItem[]>(INITIAL_RESOURCES);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(INITIAL_EMERGENCY_CONTACTS);
  const [activeJourney, setActiveJourney] = useState<JourneySession | null>(INITIAL_JOURNEY_SESSION);

  // Load from localStorage on client mount
  useEffect(() => {
    setIsClient(true);
    try {
      const savedDemo = localStorage.getItem(`${STORAGE_KEY_PREFIX}demo_mode`);
      if (savedDemo !== null) setIsDemoMode(savedDemo === "true");

      const savedUser = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
      if (savedUser) setCurrentUser(JSON.parse(savedUser));

      const savedIncidents = localStorage.getItem(`${STORAGE_KEY_PREFIX}incidents`);
      if (savedIncidents) setIncidents(JSON.parse(savedIncidents));

      const savedTeams = localStorage.getItem(`${STORAGE_KEY_PREFIX}teams`);
      if (savedTeams) setRescueTeams(JSON.parse(savedTeams));

      const savedShelters = localStorage.getItem(`${STORAGE_KEY_PREFIX}shelters`);
      if (savedShelters) setShelters(JSON.parse(savedShelters));

      const savedRoads = localStorage.getItem(`${STORAGE_KEY_PREFIX}roads`);
      if (savedRoads) setRoadReports(JSON.parse(savedRoads));

      const savedResources = localStorage.getItem(`${STORAGE_KEY_PREFIX}resources`);
      if (savedResources) setResources(JSON.parse(savedResources));

      const savedVolunteers = localStorage.getItem(`${STORAGE_KEY_PREFIX}volunteers`);
      if (savedVolunteers) setVolunteers(JSON.parse(savedVolunteers));

      const savedLogs = localStorage.getItem(`${STORAGE_KEY_PREFIX}logs`);
      if (savedLogs) setAuditLogs(JSON.parse(savedLogs));

      const savedContacts = localStorage.getItem(`${STORAGE_KEY_PREFIX}contacts`);
      if (savedContacts) setEmergencyContacts(JSON.parse(savedContacts));

      const savedJourney = localStorage.getItem(`${STORAGE_KEY_PREFIX}journey`);
      if (savedJourney) setActiveJourney(JSON.parse(savedJourney));
    } catch (e) {
      console.warn("Notice reading from localStorage:", e);
    }
  }, []);

  // Save changes to localStorage
  const saveToStorage = useCallback((key: string, value: unknown) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, JSON.stringify(value));
      } catch (e) {
        console.warn(`Error writing ${key} to storage`, e);
      }
    }
  }, []);

  const toggleDemoMode = useCallback(() => {
    setIsDemoMode((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}demo_mode`, String(next));
      }
      return next;
    });
  }, []);

  const switchUserRole = useCallback(
    (role: UserProfile["role"]) => {
      const updated: UserProfile = {
        ...currentUser,
        role,
        isVerified: role !== "citizen",
        fullName:
          role === "citizen"
            ? "Ram Chandra Debbarma (Citizen, Agartala)"
            : role === "volunteer"
            ? "Laxman Chandra Roy (Aapda Mitra Volunteer)"
            : role === "team_member"
            ? "Inspector Dasharath Kumar (NDRF Detachment Lead)"
            : role === "operator"
            ? "Ram Chandra Bhattacharjee (SEOC Agartala Dispatcher)"
            : role === "admin"
            ? "Bharat Chandra Paul (District Disaster Mgmt Officer)"
            : "Dr. Shatrughan Chandra Debbarma (Director, Tripura SDMA)",
        email:
          role === "citizen"
            ? "ram.chandra@citizen.tripura.in"
            : role === "volunteer"
            ? "laxman.chandra@aapdamitra.tripura.org"
            : role === "team_member"
            ? "dasharath.kumar@ndrf.gov.in"
            : role === "operator"
            ? "ram.chandra@pranraksha.gov.in"
            : role === "admin"
            ? "bharat.paul@tripura.gov.in"
            : "shatrughan.debbarma@sdma.tripura.gov.in",
        organization:
          role === "citizen"
            ? "General Citizen Portal"
            : role === "volunteer"
            ? "Aapda Mitra Community Disaster Volunteer Task Force"
            : role === "team_member"
            ? "NDRF 1st Battalion Detachment Agartala"
            : role === "operator"
            ? "State Emergency Operations Centre (SEOC) Agartala, Tripura"
            : role === "admin"
            ? "District Emergency Operations Centre (DEOC) West Tripura"
            : "Tripura State Disaster Management Authority (SDMA)",
        district:
          role === "volunteer"
            ? "West Tripura"
            : role === "team_member"
            ? "West Tripura"
            : role === "admin"
            ? "West Tripura"
            : "West Tripura",
      };
      setCurrentUser(updated);
      saveToStorage("user", updated);
    },
    [currentUser, saveToStorage]
  );

  // Sign In with role authentication
  const loginUser = useCallback(
    (email: string, role: UserProfile["role"] = "citizen", fullName?: string) => {
      const name =
        fullName ||
        (role === "citizen"
          ? "Ram Chandra Debbarma (Citizen)"
          : role === "volunteer"
          ? "Laxman Chandra Roy (Volunteer)"
          : role === "team_member"
          ? "Inspector Dasharath Kumar (NDRF)"
          : role === "operator"
          ? "Ram Chandra Bhattacharjee (Dispatcher)"
          : role === "admin"
          ? "Bharat Chandra Paul (Admin)"
          : "Dr. Shatrughan Chandra Debbarma (Super Admin)");

      const user: UserProfile = {
        id: `usr-${Date.now()}`,
        fullName: name,
        email: email.trim().toLowerCase(),
        phone: "+91 94361 28941",
        role,
        organization:
          role === "citizen"
            ? "Tripura Citizen Protection Network"
            : role === "volunteer"
            ? "Aapda Mitra Volunteer Force"
            : role === "team_member"
            ? "NDRF 1st Battalion Detachment Agartala"
            : role === "operator"
            ? "State Emergency Operations Centre (SEOC) Agartala"
            : role === "admin"
            ? "West Tripura District Disaster Management Authority"
            : "Tripura State Disaster Management Authority (SDMA)",
        district: "West Tripura",
        isVerified: true,
      };

      setCurrentUser(user);
      saveToStorage("user", user);
      return user;
    },
    [saveToStorage]
  );

  // Register New User (Citizen / Volunteer / Rescuer)
  const registerUser = useCallback(
    (userData: Partial<UserProfile>) => {
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        fullName: userData.fullName || "Registered Citizen",
        email: userData.email || "citizen@tripura.in",
        phone: userData.phone || "+91 94361 00000",
        role: userData.role || "citizen",
        organization: userData.organization || "Tripura Emergency Protection Network",
        district: userData.district || "West Tripura",
        isVerified: true,
      };

      setCurrentUser(newUser);
      saveToStorage("user", newUser);

      // If registered as volunteer, add to volunteer roster
      if (newUser.role === "volunteer") {
        const newVol: Volunteer = {
          id: `vol-${Date.now()}`,
          fullName: newUser.fullName,
          phone: newUser.phone,
          email: newUser.email,
          district: newUser.district || "West Tripura",
          skills: ["First Aid Responder", "Community Logistics"],
          status: "verified",
          totalMissions: 0,
          registeredAt: new Date().toISOString(),
        };
        setVolunteers((prev) => {
          const next = [newVol, ...prev];
          saveToStorage("volunteers", next);
          return next;
        });
      }

      return newUser;
    },
    [saveToStorage]
  );

  const logoutUser = useCallback(() => {
    const guest: UserProfile = {
      id: "usr-guest",
      fullName: "Guest Citizen",
      email: "guest@tripura.in",
      phone: "+91 94361 00000",
      role: "citizen",
      organization: "Citizen Public Access",
      district: "West Tripura",
      isVerified: false,
    };
    setCurrentUser(guest);
    saveToStorage("user", guest);
  }, [saveToStorage]);

  const logAction = useCallback(
    (action: string, entityType: string, entityId: string, details: string) => {
      const newEntry: AuditLogEntry = {
        id: `aud-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.fullName,
        userRole: currentUser.role,
        action,
        entityType,
        entityId,
        details,
        ipAddress: "10.14.20.102 (SEOC Agartala LAN)",
        timestamp: new Date().toISOString(),
      };
      setAuditLogs((prev) => {
        const next = [newEntry, ...prev];
        saveToStorage("logs", next);
        return next;
      });
    },
    [currentUser, saveToStorage]
  );

  const reportIncident = useCallback(
    (newIncident: Partial<Incident>): Incident => {
      const trackingCode = `PR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const incident: Incident = {
        id: `inc-${Date.now()}`,
        trackingCode,
        title: newIncident.title || "Emergency Assistance Requested",
        description: newIncident.description || "Urgent emergency reported by citizen.",
        category: (newIncident.category as EmergencyCategory) || "general_sos",
        severity: (newIncident.severity as IncidentSeverity) || "high",
        status: "reported",
        location: newIncident.location || {
          lat: 23.8315,
          lng: 91.2868,
          address: "Agartala Municipal Area, West Tripura",
          district: "West Tripura",
          state: "Tripura",
        },
        affectedCount: newIncident.affectedCount || 1,
        vulnerableCount: newIncident.vulnerableCount || 0,
        vulnerableDetails: newIncident.vulnerableDetails,
        medicalNeeded: newIncident.medicalNeeded ?? false,
        accessibilityNotes: newIncident.accessibilityNotes,
        reporter: newIncident.reporter || {
          id: currentUser.id,
          name: currentUser.fullName,
          phone: currentUser.phone,
        },
        aiPriorityScore: Math.floor(75 + Math.random() * 23),
        aiCategoryConfidence: 0.95,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setIncidents((prev) => {
        const next = [incident, ...prev];
        saveToStorage("incidents", next);
        return next;
      });

      logAction("CREATE_INCIDENT", "incident", incident.id, `Citizen reported incident ${trackingCode}: ${incident.title}`);
      return incident;
    },
    [currentUser, logAction, saveToStorage]
  );

  const verifyIncident = useCallback(
    (id: string, notes?: string) => {
      setIncidents((prev) => {
        const updated = prev.map((inc) => {
          if (inc.id === id) {
            return {
              ...inc,
              status: "verified" as IncidentStatus,
              verifiedAt: new Date().toISOString(),
              internalNotes: notes
                ? [...(inc.internalNotes || []), `${new Date().toLocaleTimeString()} - Verified: ${notes}`]
                : inc.internalNotes,
            };
          }
          return inc;
        });
        saveToStorage("incidents", updated);
        return updated;
      });
      logAction("VERIFY_INCIDENT", "incident", id, `Incident verified by ${currentUser.fullName}`);
    },
    [currentUser, logAction, saveToStorage]
  );

  const rejectIncident = useCallback(
    (id: string, reason: string) => {
      setIncidents((prev) => {
        const updated = prev.map((inc) => {
          if (inc.id === id) {
            return {
              ...inc,
              status: "closed" as IncidentStatus,
              internalNotes: [
                ...(inc.internalNotes || []),
                `${new Date().toLocaleTimeString()} - Rejected/Closed: ${reason}`,
              ],
            };
          }
          return inc;
        });
        saveToStorage("incidents", updated);
        return updated;
      });
      logAction("REJECT_INCIDENT", "incident", id, `Incident rejected: ${reason}`);
    },
    [logAction, saveToStorage]
  );

  const assignRescueTeam = useCallback(
    (incidentId: string, teamId: string, teamName?: string) => {
      let targetTeamName = teamName;
      setRescueTeams((prevTeams) => {
        return prevTeams.map((t) => {
          if (t.id === teamId) {
            targetTeamName = t.name;
            return { ...t, status: "dispatched" as const };
          }
          return t;
        });
      });

      setIncidents((prevIncidents) => {
        const updated = prevIncidents.map((inc) => {
          if (inc.id === incidentId) {
            return {
              ...inc,
              assignedTeamId: teamId,
              assignedTeamName: targetTeamName || teamId,
              assignedAt: new Date().toISOString(),
              status: "in_progress" as IncidentStatus,
            };
          }
          return inc;
        });
        saveToStorage("incidents", updated);
        return updated;
      });

      logAction("ASSIGN_TEAM", "incident_assignment", incidentId, `Assigned ${targetTeamName || teamId} to incident`);
    },
    [logAction, saveToStorage]
  );

  const updateIncidentStatus = useCallback(
    (id: string, status: IncidentStatus, note?: string) => {
      setIncidents((prev) => {
        const updated = prev.map((inc) => {
          if (inc.id === id) {
            const nextInc = {
              ...inc,
              status,
              updatedAt: new Date().toISOString(),
              resolvedAt: status === "resolved" || status === "closed" ? new Date().toISOString() : inc.resolvedAt,
              internalNotes: note
                ? [...(inc.internalNotes || []), `${new Date().toLocaleTimeString()} - ${note}`]
                : inc.internalNotes,
            };
            return nextInc;
          }
          return inc;
        });
        saveToStorage("incidents", updated);
        return updated;
      });
      logAction("UPDATE_STATUS", "incident", id, `Status updated to ${status}${note ? ` (${note})` : ""}`);
    },
    [logAction, saveToStorage]
  );

  const resetDemoData = useCallback(() => {
    setIncidents(INITIAL_INCIDENTS);
    setRescueTeams(INITIAL_RESCUE_TEAMS);
    setShelters(INITIAL_SHELTERS);
    setRoadReports(INITIAL_ROAD_REPORTS);
    setResources(INITIAL_RESOURCES);
    setVolunteers(INITIAL_VOLUNTEERS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setEmergencyContacts(INITIAL_EMERGENCY_CONTACTS);
    setActiveJourney(INITIAL_JOURNEY_SESSION);

    if (typeof window !== "undefined") {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}incidents`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}teams`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}shelters`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}roads`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}resources`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}volunteers`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}logs`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}contacts`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}journey`);
    }
  }, []);

  return {
    isClient,
    isDemoMode,
    toggleDemoMode,
    currentUser,
    switchUserRole,
    loginUser,
    registerUser,
    logoutUser,
    incidents,
    rescueTeams,
    hospitals,
    shelters,
    hazardZones,
    roadReports,
    resources,
    volunteers,
    auditLogs,
    emergencyContacts,
    activeJourney,
    reportIncident,
    verifyIncident,
    rejectIncident,
    assignRescueTeam,
    updateIncidentStatus,
    logAction,
    resetDemoData,
  };
}
