"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Incident,
  RescueTeam,
  Hospital,
  Shelter,
  HazardZone,
  RoadReport,
} from "@/types";
import {
  Layers,
  Locate,
  ZoomIn,
  ZoomOut,
  Maximize2,
  AlertTriangle,
  Users,
  Building,
  Home,
  Shield,
  Activity,
  Crosshair,
  Globe,
  Mountain,
  Sun,
  Key,
  Compass,
  CheckCircle2,
  ExternalLink,
  Info,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { getSeverityBadgeClass, getStatusBadgeClass } from "@/lib/utils";

interface MapComponentProps {
  incidents?: Incident[];
  rescueTeams?: RescueTeam[];
  hospitals?: Hospital[];
  shelters?: Shelter[];
  hazardZones?: HazardZone[];
  roadReports?: RoadReport[];
  selectedIncidentId?: string | null;
  onSelectIncident?: (incident: Incident) => void;
  centerLat?: number;
  centerLng?: number;
  zoomLevel?: number;
  interactive?: boolean;
  autoDetectLocation?: boolean;
  className?: string;
}

// Coordinate constants for Tripura State Emergency Operations Zone (Agartala)
const TRIPURA_DISASTER_CENTER = {
  lat: 23.8315,
  lng: 91.2868,
  zoom: 12,
};

// Helper: validate MapTiler API Key (must be alphanumeric, not URL or UUID path)
function isValidMaptilerKey(key?: string): boolean {
  if (!key) return false;
  const trimmed = key.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.includes("/") ||
    trimmed.includes("?") ||
    trimmed.includes("settings") ||
    trimmed.includes("-") || // UUIDs have hyphens (MapTiler keys are pure alphanumeric)
    trimmed.length < 15
  ) {
    return false;
  }
  return true;
}

export default function MapComponent({
  incidents = [],
  rescueTeams = [],
  hospitals = [],
  shelters = [],
  hazardZones = [],
  roadReports = [],
  selectedIncidentId,
  onSelectIncident,
  centerLat = TRIPURA_DISASTER_CENTER.lat,
  centerLng = TRIPURA_DISASTER_CENTER.lng,
  zoomLevel = TRIPURA_DISASTER_CENTER.zoom,
  interactive = true,
  autoDetectLocation = false,
  className = "h-full w-full",
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [gpsDetecting, setGpsDetecting] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
  } | null>(null);
  const [trackingActive, setTrackingActive] = useState(false);
  const [maptilerKey, setMaptilerKey] = useState<string>("");
  const [mapStyle, setMapStyle] = useState<"dark" | "satellite" | "outdoor" | "streets">("dark");
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [keyInputValue, setKeyInputValue] = useState("");
  const [keyInputError, setKeyInputError] = useState<string | null>(null);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const [activeLayers, setActiveLayers] = useState({
    incidents: true,
    hazardZones: true,
    rescueTeams: true,
    shelters: true,
    hospitals: true,
    roadReports: true,
  });
  const [layersMenuOpen, setLayersMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    type: "incident" | "team" | "hospital" | "shelter" | "road" | "hazard";
    data: any;
  } | null>(null);

  // Read and clean MapTiler API Key on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("maptiler_api_key");
        const envKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
        const initialKey = stored || envKey || "";
        if (isValidMaptilerKey(initialKey)) {
          setMaptilerKey(initialKey.trim());
          setKeyInputValue(initialKey.trim());
        } else if (stored && !isValidMaptilerKey(stored)) {
          // Clean up invalid stored key (e.g. URL entered by mistake)
          localStorage.removeItem("maptiler_api_key");
        }
      } catch (e) {
        console.warn("Storage access notice:", e);
      }
    }
  }, []);

  // Universal style definition with guaranteed 100% free offline-safe fallbacks
  const getStyleDefinition = useCallback((styleType: string, key?: string) => {
    // If a valid MapTiler key is provided, use high-resolution vector styles
    if (isValidMaptilerKey(key)) {
      const cleanKey = key!.trim();
      if (styleType === "satellite") {
        return `https://api.maptiler.com/maps/hybrid/style.json?key=${cleanKey}`;
      }
      if (styleType === "outdoor") {
        return `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${cleanKey}`;
      }
      if (styleType === "streets") {
        return `https://api.maptiler.com/maps/streets-v2/style.json?key=${cleanKey}`;
      }
      return `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${cleanKey}`;
    }

    // FREE RELIABLE FALLBACKS (NO API KEY REQUIRED)
    if (styleType === "satellite") {
      // ESRI World Imagery public raster tiles (Free, No Auth, CORS Enabled)
      return {
        version: 8,
        sources: {
          "esri-satellite": {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            attribution: "&copy; Esri, Maxar, Earthstar Geographics",
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: "satellite-tiles",
            type: "raster",
            source: "esri-satellite",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      };
    }

    if (styleType === "streets") {
      // CARTO Voyager raster tiles (Free, No Auth, High Visibility Streets)
      return {
        version: 8,
        sources: {
          "carto-voyager": {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
              "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
              "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap &copy; CARTO",
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: "voyager-tiles",
            type: "raster",
            source: "carto-voyager",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      };
    }

    if (styleType === "outdoor") {
      // CARTO Positron light raster tiles
      return {
        version: 8,
        sources: {
          "carto-positron": {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png",
              "https://b.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png",
              "https://c.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap &copy; CARTO",
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: "positron-tiles",
            type: "raster",
            source: "carto-positron",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      };
    }

    // Default: CARTO Dark Tactical Raster Tiles (High-contrast military aesthetic)
    return {
      version: 8,
      sources: {
        "carto-dark": {
          type: "raster",
          tiles: [
            "https://a.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png",
            "https://b.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png",
            "https://c.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png",
            "https://d.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png",
          ],
          tileSize: 256,
          attribution: "&copy; OpenStreetMap &copy; CARTO",
          maxzoom: 19,
        },
      },
      layers: [
        {
          id: "dark-tiles",
          type: "raster",
          source: "carto-dark",
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };
  }, []);

  const addHazardZonesLayer = useCallback(
    (map: any) => {
      if (!map || hazardZones.length === 0) return;
      try {
        if (map.getSource("hazard-zones-source")) return;

        const features = hazardZones
          .filter((hz) => Array.isArray(hz.polygonCoordinates) && hz.polygonCoordinates.length > 2)
          .map((hz) => ({
            type: "Feature",
            properties: {
              id: hz.id,
              name: hz.name,
              level: hz.riskLevel,
              waterLevel: hz.currentWaterLevelM,
              dangerMark: hz.dangerMarkM,
            },
            geometry: {
              type: "Polygon",
              coordinates: [hz.polygonCoordinates],
            },
          }));

        if (features.length === 0) return;

        map.addSource("hazard-zones-source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: features as any,
          },
        });

        map.addLayer({
          id: "hazard-zones-fill",
          type: "fill",
          source: "hazard-zones-source",
          paint: {
            "fill-color": [
              "match",
              ["get", "level"],
              "extreme",
              "#dc2626",
              "high",
              "#ea580c",
              "#eab308",
            ],
            "fill-opacity": 0.28,
          },
        });

        map.addLayer({
          id: "hazard-zones-outline",
          type: "line",
          source: "hazard-zones-source",
          paint: {
            "line-color": [
              "match",
              ["get", "level"],
              "extreme",
              "#ef4444",
              "high",
              "#f97316",
              "#facc15",
            ],
            "line-width": 2,
            "line-dasharray": [2, 2],
          },
        });
      } catch (err) {
        console.warn("Notice adding hazard zones layer:", err);
      }
    },
    [hazardZones]
  );

  const changeMapStyle = (newStyle: "dark" | "satellite" | "outdoor" | "streets") => {
    setMapStyle(newStyle);
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    try {
      const styleDef = getStyleDefinition(newStyle, maptilerKey);
      map.setStyle(styleDef as any);
      map.once("style.load", () => {
        addHazardZonesLayer(map);
      });
    } catch (err) {
      console.warn("Style change notice:", err);
    }
  };

  const handleSaveMaptilerKey = (key: string) => {
    const cleaned = key.trim();
    if (!cleaned) {
      // Clear key -> revert to free basemaps
      setMaptilerKey("");
      setKeyInputError(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("maptiler_api_key");
      }
      setKeyModalOpen(false);
      setBannerNotice("Using free open GIS basemaps (CARTO & ESRI).");
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setStyle(getStyleDefinition(mapStyle, "") as any);
        mapInstanceRef.current.once("style.load", () => {
          addHazardZonesLayer(mapInstanceRef.current);
        });
      }
      return;
    }

    if (cleaned.includes("-") && cleaned.length >= 25) {
      setKeyInputError(
        "⚠️ That is your Key ID from the URL (with hyphens). In MapTiler, look for the field 'Key' and click the Copy icon to copy your actual key token (e.g. 'aB1c2D...')."
      );
      return;
    }

    if (!isValidMaptilerKey(cleaned)) {
      setKeyInputError(
        "Please enter only the alphanumeric key token (e.g. 'eFg1...'). Do not paste the full URL or settings page link."
      );
      return;
    }

    setKeyInputError(null);
    setMaptilerKey(cleaned);
    if (typeof window !== "undefined") {
      localStorage.setItem("maptiler_api_key", cleaned);
    }
    setKeyModalOpen(false);
    setBannerNotice("MapTiler key applied successfully.");

    if (mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      const styleDef = getStyleDefinition(mapStyle, cleaned);
      map.setStyle(styleDef as any);
      map.once("style.load", () => {
        addHazardZonesLayer(map);
      });
    }
  };

  const handleResetToFreeBasemaps = () => {
    setMaptilerKey("");
    setKeyInputValue("");
    setKeyInputError(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("maptiler_api_key");
    }
    setKeyModalOpen(false);
    setBannerNotice("Map reset to 100% free open GIS basemap (Tactical Dark).");

    if (mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      map.setStyle(getStyleDefinition("dark", "") as any);
      map.once("style.load", () => {
        addHazardZonesLayer(map);
      });
    }
  };

  // Initialize MapLibre GL
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      if (typeof window === "undefined") return;

      const maplibregl = (await import("maplibre-gl")).default;

      let initialKey = "";
      try {
        const stored = localStorage.getItem("maptiler_api_key");
        const envKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
        initialKey = stored || envKey || "";
        if (!isValidMaptilerKey(initialKey)) {
          if (stored && !isValidMaptilerKey(stored)) {
            localStorage.removeItem("maptiler_api_key");
          }
          initialKey = "";
        }
      } catch (e) {
        console.warn("Storage check:", e);
      }

      const styleDef = getStyleDefinition(mapStyle, initialKey);

      try {
        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: styleDef as any,
          center: [centerLng, centerLat],
          zoom: zoomLevel,
          attributionControl: false,
        });

        // Resilience: if any style errors happen (e.g. 401/403 on MapTiler), fallback safely
        map.on("error", (e: any) => {
          console.warn("MapLibre runtime message:", e);
          if (
            e?.error &&
            (e.error.status === 401 ||
              e.error.status === 403 ||
              String(e.error).includes("Failed to fetch") ||
              String(e.error?.message).includes("Failed to fetch"))
          ) {
            console.warn("MapTiler key blocked or unauthorized. Reverting to free Carto Dark...");
            map.setStyle(getStyleDefinition("dark", "") as any);
            setBannerNotice(
              "MapTiler key unauthorized. Reverted automatically to free Tactical Dark basemap."
            );
          }
        });

        map.on("load", () => {
          if (!isMounted) return;
          mapInstanceRef.current = map;
          setMapLoaded(true);
          addHazardZonesLayer(map);
          map.resize();
        });

        // ResizeObserver ensures canvas updates its size when layout changes
        if (typeof ResizeObserver !== "undefined" && mapContainerRef.current) {
          const ro = new ResizeObserver(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.resize();
            }
          });
          ro.observe(mapContainerRef.current);
          resizeObserverRef.current = ro;
        }

        // Safety timeout: ensure mapLoaded becomes true even on slow connections
        const safetyTimeout = setTimeout(() => {
          if (isMounted && !mapLoaded) {
            mapInstanceRef.current = map;
            setMapLoaded(true);
            addHazardZonesLayer(map);
            map.resize();
          }
        }, 1200);

        return () => clearTimeout(safetyTimeout);
      } catch (err) {
        console.error("Map initialization failed:", err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers on map whenever datasets or filters change
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const map = mapInstanceRef.current;
    import("maplibre-gl").then(({ default: maplibregl }) => {
      // 1. Incidents
      if (activeLayers.incidents) {
        incidents.forEach((inc) => {
          const el = document.createElement("div");
          el.className = "cursor-pointer transition-transform hover:scale-125 z-20";

          // Color based on severity / status
          let colorBg = "bg-critical";
          let pingColor = "bg-critical";
          if (inc.status === "resolved" || inc.status === "closed") {
            colorBg = "bg-success";
            pingColor = "bg-success";
          } else if (inc.severity === "high") {
            colorBg = "bg-warning";
            pingColor = "bg-warning";
          } else if (inc.severity === "moderate") {
            colorBg = "bg-electric";
            pingColor = "bg-electric";
          } else if (inc.severity === "low") {
            colorBg = "bg-slate-400";
            pingColor = "bg-slate-400";
          }

          const isSelected = selectedIncidentId === inc.id;

          el.innerHTML = `
            <div class="relative flex items-center justify-center">
              ${
                inc.status !== "resolved" && inc.severity === "critical"
                  ? `<div class="absolute -inset-1 rounded-full ${pingColor} animate-ping opacity-60"></div>`
                  : ""
              }
              <div class="relative flex h-7 w-7 items-center justify-center rounded-full ${colorBg} text-white shadow-lg border-2 ${
            isSelected ? "border-white ring-4 ring-sky-400 scale-125" : "border-slate-900"
          }">
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
              </div>
            </div>
          `;

          el.addEventListener("click", () => {
            setSelectedItem({ type: "incident", data: inc });
            if (onSelectIncident) onSelectIncident(inc);
            map.flyTo({ center: [inc.location.lng, inc.location.lat], zoom: 14, speed: 1.2 });
          });

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([inc.location.lng, inc.location.lat])
            .addTo(map);

          markersRef.current.push(marker);
        });
      }

      // 2. Rescue Teams
      if (activeLayers.rescueTeams) {
        rescueTeams.forEach((team) => {
          const el = document.createElement("div");
          el.className = "cursor-pointer transition-transform hover:scale-125 z-10";

          el.innerHTML = `
            <div class="flex h-6 w-6 items-center justify-center rounded-full bg-cobalt text-white shadow-md border-2 border-slate-900">
              <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
          `;

          el.addEventListener("click", () => {
            setSelectedItem({ type: "team", data: team });
            map.flyTo({ center: [team.currentLocation.lng, team.currentLocation.lat], zoom: 14 });
          });

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([team.currentLocation.lng, team.currentLocation.lat])
            .addTo(map);

          markersRef.current.push(marker);
        });
      }

      // 3. Shelters
      if (activeLayers.shelters) {
        shelters.forEach((shlt) => {
          const el = document.createElement("div");
          el.className = "cursor-pointer transition-transform hover:scale-125";
          el.innerHTML = `
            <div class="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-600 text-white shadow-sm border border-slate-900">
              <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
          `;
          el.addEventListener("click", () => {
            setSelectedItem({ type: "shelter", data: shlt });
            map.flyTo({ center: [shlt.lng, shlt.lat], zoom: 14 });
          });
          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([shlt.lng, shlt.lat])
            .addTo(map);
          markersRef.current.push(marker);
        });
      }

      // 4. Hospitals
      if (activeLayers.hospitals) {
        hospitals.forEach((hosp) => {
          const el = document.createElement("div");
          el.className = "cursor-pointer transition-transform hover:scale-125";
          el.innerHTML = `
            <div class="flex h-5 w-5 items-center justify-center rounded-md bg-purple-600 text-white shadow-sm border border-slate-900">
              <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 6v12m-6-6h12"/>
              </svg>
            </div>
          `;
          el.addEventListener("click", () => {
            setSelectedItem({ type: "hospital", data: hosp });
            map.flyTo({ center: [hosp.lng, hosp.lat], zoom: 14 });
          });
          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([hosp.lng, hosp.lat])
            .addTo(map);
          markersRef.current.push(marker);
        });
      }

      // 5. Road Reports
      if (activeLayers.roadReports) {
        roadReports.forEach((road) => {
          const el = document.createElement("div");
          el.className = "cursor-pointer transition-transform hover:scale-125";
          el.innerHTML = `
            <div class="flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-white shadow-sm border border-slate-900">
              <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>
              </svg>
            </div>
          `;
          el.addEventListener("click", () => {
            setSelectedItem({ type: "road", data: road });
            map.flyTo({ center: [road.lng, road.lat], zoom: 14 });
          });
          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([road.lng, road.lat])
            .addTo(map);
          markersRef.current.push(marker);
        });
      }
    });
  }, [
    mapLoaded,
    incidents,
    rescueTeams,
    hospitals,
    shelters,
    roadReports,
    activeLayers,
    selectedIncidentId,
    onSelectIncident,
  ]);

  // Detect single current GPS location & center map
  const detectCurrentLocation = useCallback((centerOnUser = true) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setBannerNotice("Geolocation is not supported by your browser");
      return;
    }

    setGpsDetecting(true);
    setBannerNotice("Detecting your live device GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude, accuracy });
        setTrackingActive(true);
        setGpsDetecting(false);
        setBannerNotice(
          `GPS Acquired: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E (±${Math.round(
            accuracy || 10
          )}m)`
        );

        if (mapInstanceRef.current) {
          const map = mapInstanceRef.current;
          import("maplibre-gl").then(({ default: maplibregl }) => {
            if (!userMarkerRef.current) {
              const el = document.createElement("div");
              el.className = "relative flex items-center justify-center cursor-pointer";
              el.innerHTML = `
                <div class="absolute -inset-4 rounded-full bg-sky-400 animate-ping opacity-60"></div>
                <div class="h-6 w-6 rounded-full bg-sky-500 border-2 border-white shadow-2xl ring-4 ring-sky-300/50 flex items-center justify-center">
                  <div class="h-2 w-2 rounded-full bg-white"></div>
                </div>
              `;
              userMarkerRef.current = new maplibregl.Marker({ element: el })
                .setLngLat([longitude, latitude])
                .addTo(map);
            } else {
              userMarkerRef.current.setLngLat([longitude, latitude]);
            }

            if (centerOnUser) {
              map.flyTo({ center: [longitude, latitude], zoom: 15, duration: 1800 });
            }
          });
        }
      },
      (err) => {
        setGpsDetecting(false);
        console.warn("GPS error:", err);
        setBannerNotice(
          `GPS Notice: ${err.message}. Please enable location permissions in browser settings.`
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // Real GPS foreground watch tracking
  const toggleLocationTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setBannerNotice("Geolocation is not supported by your browser");
      return;
    }

    if (trackingActive) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      setTrackingActive(false);
      setBannerNotice("Live GPS tracking stopped.");
      return;
    }

    detectCurrentLocation(true);

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude, accuracy });

        if (mapInstanceRef.current) {
          const map = mapInstanceRef.current;
          import("maplibre-gl").then(({ default: maplibregl }) => {
            if (!userMarkerRef.current) {
              const el = document.createElement("div");
              el.className = "relative flex items-center justify-center cursor-pointer";
              el.innerHTML = `
                <div class="absolute -inset-4 rounded-full bg-sky-400 animate-ping opacity-60"></div>
                <div class="h-6 w-6 rounded-full bg-sky-500 border-2 border-white shadow-2xl ring-4 ring-sky-300/50 flex items-center justify-center">
                  <div class="h-2 w-2 rounded-full bg-white"></div>
                </div>
              `;
              userMarkerRef.current = new maplibregl.Marker({ element: el })
                .setLngLat([longitude, latitude])
                .addTo(map);
            } else {
              userMarkerRef.current.setLngLat([longitude, latitude]);
            }
          });
        }
      },
      (err) => {
        console.warn("GPS tracking notice:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    watchIdRef.current = id;
  }, [trackingActive, detectCurrentLocation]);

  // Auto-detect location on load if explicitly requested
  useEffect(() => {
    if (autoDetectLocation && mapLoaded) {
      detectCurrentLocation(false);
    }
  }, [autoDetectLocation, mapLoaded, detectCurrentLocation]);

  const zoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const zoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const jumpToDisasterZone = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [TRIPURA_DISASTER_CENTER.lng, TRIPURA_DISASTER_CENTER.lat],
        zoom: TRIPURA_DISASTER_CENTER.zoom,
        speed: 1.4,
      });
      setBannerNotice("Centered on Agartala, Tripura Emergency Operations Area.");
    }
  };

  const jumpToMyLocation = () => {
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 15,
        speed: 1.4,
      });
    } else {
      detectCurrentLocation(true);
    }
  };

  return (
    <div className={`relative w-full h-full min-h-[400px] overflow-hidden ${className}`}>
      {/* MapLibre GL Canvas Container (Guaranteed Absolute Fill) */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full"
        style={{ minHeight: "100%", width: "100%" }}
      />

      {/* Non-blocking Dismissible Banner Notice */}
      {bannerNotice && (
        <div className="absolute top-16 left-4 right-4 sm:right-auto sm:max-w-md z-30 flex items-center justify-between gap-3 p-3 rounded-2xl bg-midnight/95 border border-cobalt/40 text-sky-200 text-xs shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 shrink-0 text-sky-400" />
            <span className="leading-snug">{bannerNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setBannerNotice(null)}
            className="text-slate-400 hover:text-white font-bold px-1.5 py-0.5 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Tactical Overlay Controls */}
      {interactive && (
        <>
          {/* Top-Left Action Bar: Detect Location & Jump to Emergency Zone */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => detectCurrentLocation(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cobalt hover:bg-cobalt/90 text-white text-xs font-bold shadow-xl border border-sky-400/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
            >
              {gpsDetecting ? (
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
              ) : (
                <Locate className={`h-4 w-4 ${trackingActive ? "animate-pulse text-sky-200" : ""}`} />
              )}
              <span>
                {gpsDetecting
                  ? "Detecting GPS..."
                  : userLocation
                  ? "Re-center On My Location"
                  : "Detect My Local Location"}
              </span>
            </button>

            {/* Quick Button to Jump to Disaster Zone (Tripura) */}
            <button
              type="button"
              onClick={jumpToDisasterZone}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-midnight/90 hover:bg-midnight text-sky-300 hover:text-white text-xs font-bold shadow-xl border border-cobalt/40 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
              title="Jump to Tripura State Emergency Operations Zone (Agartala)"
            >
              <Compass className="h-4 w-4 text-amber-400" />
              <span>Tripura Operations Zone</span>
            </button>

            {userLocation && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-midnight/90 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono shadow-xl backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>
                  {userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E (±
                  {Math.round(userLocation.accuracy || 10)}m)
                </span>
              </div>
            )}
          </div>

          {/* Top-Right GIS Layer Selector */}
          <div className="absolute top-4 right-4 z-20">
            <div className="relative">
              <button
                type="button"
                onClick={() => setLayersMenuOpen(!layersMenuOpen)}
                className="flex items-center gap-2 bg-midnight/90 hover:bg-midnight text-sky-200 border border-cobalt/40 px-3 py-2 rounded-lg text-xs font-semibold shadow-xl backdrop-blur-md transition-colors"
              >
                <Layers className="h-4 w-4 text-sky-400" />
                <span>GIS Layers & Basemap</span>
              </button>

              {layersMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-midnight/95 border border-cobalt/40 shadow-2xl p-3.5 text-xs space-y-3 backdrop-blur-md animate-in fade-in zoom-in-95">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-cobalt/20 pb-1.5 flex items-center justify-between">
                    <span>Active GIS Layers</span>
                    <button
                      type="button"
                      onClick={() => setLayersMenuOpen(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="flex items-center gap-2 text-slate-200">
                      <span className="h-2.5 w-2.5 rounded-full bg-critical" />
                      Incidents ({incidents.length})
                    </span>
                    <input
                      type="checkbox"
                      checked={activeLayers.incidents}
                      onChange={(e) =>
                        setActiveLayers({ ...activeLayers, incidents: e.target.checked })
                      }
                      className="rounded accent-cobalt cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="flex items-center gap-2 text-slate-200">
                      <span className="h-2.5 w-2.5 rounded bg-critical/50 border border-critical" />
                      Flood Hazard Zones ({hazardZones.length})
                    </span>
                    <input
                      type="checkbox"
                      checked={activeLayers.hazardZones}
                      onChange={(e) =>
                        setActiveLayers({ ...activeLayers, hazardZones: e.target.checked })
                      }
                      className="rounded accent-cobalt cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="flex items-center gap-2 text-slate-200">
                      <span className="h-2.5 w-2.5 rounded-full bg-cobalt" />
                      Rescue Teams ({rescueTeams.length})
                    </span>
                    <input
                      type="checkbox"
                      checked={activeLayers.rescueTeams}
                      onChange={(e) =>
                        setActiveLayers({ ...activeLayers, rescueTeams: e.target.checked })
                      }
                      className="rounded accent-cobalt cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="flex items-center gap-2 text-slate-200">
                      <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
                      Relief Shelters ({shelters.length})
                    </span>
                    <input
                      type="checkbox"
                      checked={activeLayers.shelters}
                      onChange={(e) =>
                        setActiveLayers({ ...activeLayers, shelters: e.target.checked })
                      }
                      className="rounded accent-cobalt cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="flex items-center gap-2 text-slate-200">
                      <span className="h-2.5 w-2.5 rounded-sm bg-purple-500" />
                      Hospitals ({hospitals.length})
                    </span>
                    <input
                      type="checkbox"
                      checked={activeLayers.hospitals}
                      onChange={(e) =>
                        setActiveLayers({ ...activeLayers, hospitals: e.target.checked })
                      }
                      className="rounded accent-cobalt cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="flex items-center gap-2 text-slate-200">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                      Roadblocks ({roadReports.length})
                    </span>
                    <input
                      type="checkbox"
                      checked={activeLayers.roadReports}
                      onChange={(e) =>
                        setActiveLayers({ ...activeLayers, roadReports: e.target.checked })
                      }
                      className="rounded accent-cobalt cursor-pointer"
                    />
                  </label>

                  {/* Basemap Style Switcher */}
                  <div className="pt-2 border-t border-cobalt/20 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Basemap Provider & Style
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => changeMapStyle("dark")}
                        className={`p-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
                          mapStyle === "dark"
                            ? "bg-cobalt text-white border-cobalt"
                            : "bg-navy/80 hover:bg-navy border-cobalt/20 text-slate-300"
                        }`}
                      >
                        <Shield className="h-3 w-3 text-sky-400" />
                        <span>Tactical Dark</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => changeMapStyle("satellite")}
                        className={`p-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
                          mapStyle === "satellite"
                            ? "bg-cobalt text-white border-cobalt"
                            : "bg-navy/80 hover:bg-navy border-cobalt/20 text-slate-300"
                        }`}
                      >
                        <Globe className="h-3 w-3 text-emerald-400" />
                        <span>Satellite Hybrid</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => changeMapStyle("streets")}
                        className={`p-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
                          mapStyle === "streets"
                            ? "bg-cobalt text-white border-cobalt"
                            : "bg-navy/80 hover:bg-navy border-cobalt/20 text-slate-300"
                        }`}
                      >
                        <Sun className="h-3 w-3 text-yellow-300" />
                        <span>Streets V2</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => changeMapStyle("outdoor")}
                        className={`p-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
                          mapStyle === "outdoor"
                            ? "bg-cobalt text-white border-cobalt"
                            : "bg-navy/80 hover:bg-navy border-cobalt/20 text-slate-300"
                        }`}
                      >
                        <Mountain className="h-3 w-3 text-amber-400" />
                        <span>Terrain Topo</span>
                      </button>
                    </div>

                    {/* MapTiler Key Config Status */}
                    <button
                      type="button"
                      onClick={() => setKeyModalOpen(true)}
                      className="w-full mt-2 py-1.5 px-2 rounded-lg bg-navy/90 hover:bg-navy border border-cobalt/30 text-[10px] text-sky-300 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1">
                        <Key className="h-3 w-3 text-amber-400" />
                        <span>
                          {isValidMaptilerKey(maptilerKey)
                            ? "MapTiler Key Active"
                            : "MapTiler Key (Optional)"}
                        </span>
                      </span>
                      <span className="text-[9px] text-slate-400 uppercase font-mono">
                        {isValidMaptilerKey(maptilerKey) ? "EDIT" : "ADD"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map Navigation & GPS Controls (Right Bar) */}
          <div className="absolute right-4 top-20 z-20 flex flex-col gap-2">
            <button
              type="button"
              onClick={toggleLocationTracking}
              className={`p-2.5 rounded-lg border shadow-xl backdrop-blur-md transition-all ${
                trackingActive
                  ? "bg-sky-500 text-white border-sky-300 ring-2 ring-sky-400"
                  : "bg-midnight/90 hover:bg-midnight text-sky-200 border-cobalt/40"
              }`}
              title={trackingActive ? "Stop GPS Tracking" : "Track My Live Location"}
            >
              <Locate className={`h-4 w-4 ${trackingActive ? "animate-pulse" : ""}`} />
            </button>

            <button
              type="button"
              onClick={() => changeMapStyle(mapStyle === "satellite" ? "dark" : "satellite")}
              className={`p-2.5 rounded-lg border shadow-xl backdrop-blur-md transition-colors ${
                mapStyle === "satellite"
                  ? "bg-cobalt text-white border-sky-300"
                  : "bg-midnight/90 hover:bg-midnight text-sky-200 border-cobalt/40"
              }`}
              title={
                mapStyle === "satellite" ? "Switch to Tactical Dark" : "Switch to Satellite Hybrid"
              }
            >
              <Globe className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={zoomIn}
              className="p-2.5 rounded-lg bg-midnight/90 hover:bg-midnight text-sky-200 border border-cobalt/40 shadow-xl backdrop-blur-md transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={zoomOut}
              className="p-2.5 rounded-lg bg-midnight/90 hover:bg-midnight text-sky-200 border border-cobalt/40 shadow-xl backdrop-blur-md transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={jumpToDisasterZone}
              className="p-2.5 rounded-lg bg-midnight/90 hover:bg-midnight text-sky-200 border border-cobalt/40 shadow-xl backdrop-blur-md transition-colors"
              title="Center on Emergency Zone (Tripura)"
            >
              <Crosshair className="h-4 w-4" />
            </button>
          </div>
        </>
      )}

      {/* Selected Item Floating Detail Card */}
      {selectedItem && (
        <div className="absolute bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 rounded-2xl bg-midnight/95 border border-cobalt/40 p-4 shadow-2xl backdrop-blur-md z-30 animate-in fade-in slide-in-from-bottom-3 text-xs">
          <div className="flex items-center justify-between border-b border-cobalt/20 pb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-sky-400 font-bold flex items-center gap-1.5">
              <Activity className="h-3 w-3" />
              <span>{selectedItem.type.toUpperCase()} TELEMETRY</span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="text-slate-400 hover:text-white font-bold p-1"
            >
              ✕
            </button>
          </div>

          {/* Incident Details */}
          {selectedItem.type === "incident" && (
            <div className="mt-3 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-slate-300 font-bold">
                  {selectedItem.data.trackingCode}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getSeverityBadgeClass(
                    selectedItem.data.severity
                  )}`}
                >
                  {selectedItem.data.severity}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">{selectedItem.data.title}</h3>
              <p className="text-slate-300 line-clamp-3 text-[11px] leading-relaxed">
                {selectedItem.data.description}
              </p>
              <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-navy/80 border border-cobalt/20">
                <div>
                  <div className="text-[10px] text-slate-400">Affected People</div>
                  <div className="text-sm font-bold text-white">
                    {selectedItem.data.affectedCount}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Assigned Team</div>
                  <div className="text-xs font-semibold text-sky-300 truncate">
                    {selectedItem.data.assignedTeamName || "Pending Dispatch"}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-slate-400">Status:</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${getStatusBadgeClass(
                    selectedItem.data.status
                  )}`}
                >
                  {selectedItem.data.status}
                </span>
              </div>
            </div>
          )}

          {/* Rescue Team Details */}
          {selectedItem.type === "team" && (
            <div className="mt-3 space-y-2.5">
              <h3 className="text-sm font-bold text-white">{selectedItem.data.name}</h3>
              <div className="text-xs text-sky-300 font-semibold">
                {selectedItem.data.organization} &bull; {selectedItem.data.vehicleType}
              </div>
              <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-navy/80 border border-cobalt/20">
                <div>
                  <div className="text-[10px] text-slate-400">Field Personnel</div>
                  <div className="text-sm font-bold text-white">
                    {selectedItem.data.personnelCount} Rescuers
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Operational Status</div>
                  <div className="text-xs font-bold text-emerald-400 uppercase">
                    {selectedItem.data.status.replace("_", " ")}
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-300">
                Lead:{" "}
                <strong className="text-white">
                  {selectedItem.data.leaderName} ({selectedItem.data.leaderPhone})
                </strong>
              </div>
            </div>
          )}

          {/* Hospital Details */}
          {selectedItem.type === "hospital" && (
            <div className="mt-3 space-y-2.5">
              <h3 className="text-sm font-bold text-white">{selectedItem.data.name}</h3>
              <div className="text-xs text-slate-300">{selectedItem.data.address}</div>
              <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-navy/80 border border-cobalt/20 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">ICU Beds</div>
                  <div className="text-sm font-bold text-emerald-400">
                    {selectedItem.data.availableIcuBeds}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Total Free</div>
                  <div className="text-sm font-bold text-sky-300">
                    {selectedItem.data.availableGeneralBeds}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Oxygen</div>
                  <div className="text-sm font-bold text-amber-300">
                    {selectedItem.data.oxygenStockPercent}%
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-300">
                Emergency Desk:{" "}
                <strong className="text-white">{selectedItem.data.emergencyPhone}</strong>
              </div>
            </div>
          )}

          {/* Shelter Details */}
          {selectedItem.type === "shelter" && (
            <div className="mt-3 space-y-2.5">
              <h3 className="text-sm font-bold text-white">{selectedItem.data.name}</h3>
              <div className="text-xs text-slate-300">{selectedItem.data.address}</div>
              <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-navy/80 border border-cobalt/20">
                <div>
                  <div className="text-[10px] text-slate-400">Occupancy</div>
                  <div className="text-sm font-bold text-sky-300">
                    {selectedItem.data.currentOccupancy} / {selectedItem.data.totalCapacity}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Free Spaces</div>
                  <div className="text-sm font-bold text-emerald-400">
                    {selectedItem.data.totalCapacity - selectedItem.data.currentOccupancy}
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-300">
                Contact:{" "}
                <strong className="text-white">
                  {selectedItem.data.contactPerson} ({selectedItem.data.contactPhone})
                </strong>
              </div>
            </div>
          )}

          {/* Road Obstruction Details */}
          {selectedItem.type === "road" && (
            <div className="mt-3 space-y-2.5">
              <h3 className="text-sm font-bold text-white">{selectedItem.data.roadName}</h3>
              <div className="p-2 rounded-lg bg-navy/80 border border-cobalt/20 space-y-1">
                <div className="text-warning font-semibold uppercase">
                  {selectedItem.data.status.replace("_", " ")}
                </div>
                <div className="text-slate-300">{selectedItem.data.detourAdvice}</div>
                {selectedItem.data.waterDepthCm ? (
                  <div className="text-critical font-bold">
                    Water Depth: {selectedItem.data.waterDepthCm} cm
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MapTiler Key Configuration Modal */}
      {keyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/85 backdrop-blur-md">
          <div className="max-w-md w-full rounded-3xl bg-midnight border border-cobalt/40 p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-cobalt/20 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="h-5 w-5 text-amber-400" />
                <span>MapTiler API Key Configuration</span>
              </h3>
              <button
                type="button"
                onClick={() => setKeyModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-300 leading-relaxed">
              PRANRAKSHA AI includes <strong>free built-in tactical satellite & dark basemaps</strong>.
              Optionally, you can enter a MapTiler API Key to enable vector tile styling.
            </p>

            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold">MapTiler Key Token</label>
              <input
                type="text"
                value={keyInputValue}
                onChange={(e) => {
                  setKeyInputValue(e.target.value);
                  setKeyInputError(null);
                }}
                placeholder="Paste key token (e.g. abc123def456...)"
                className="w-full rounded-xl bg-navy border border-cobalt/30 p-2.5 text-white font-mono text-xs placeholder-slate-500 focus:outline-none focus:border-cobalt"
              />

              {keyInputError && (
                <div className="text-[11px] text-critical font-medium flex items-center gap-1 mt-1">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>{keyInputError}</span>
                </div>
              )}

              <div className="text-[10px] text-slate-400 pt-1 leading-relaxed">
                Tip: Copy the actual <strong>Key string</strong> from{" "}
                <a
                  href="https://cloud.maptiler.com/account/keys/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:underline font-bold"
                >
                  cloud.maptiler.com/account/keys
                </a>
                . Do not copy the browser URL.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-cobalt/20">
              <button
                type="button"
                onClick={handleResetToFreeBasemaps}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-navy/90 hover:bg-navy text-amber-300 border border-amber-500/30 font-bold"
              >
                Clear Key & Use Free Basemap
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setKeyModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy text-slate-300 hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveMaptilerKey(keyInputValue)}
                  className="px-4 py-2 rounded-xl bg-cobalt hover:bg-cobalt/90 text-white font-bold uppercase tracking-wider"
                >
                  Save & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
