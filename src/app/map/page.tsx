"use client";

import Navbar from "@/components/Navbar";
import MapComponent from "@/components/MapComponent";
import { usePranrakshaStore } from "@/lib/store";

export default function FullscreenMapPage() {
  const { incidents, rescueTeams, hospitals, shelters, hazardZones, roadReports } =
    usePranrakshaStore();

  return (
    <div className="h-screen w-screen flex flex-col bg-navy text-foreground overflow-hidden">
      <Navbar />

      <main className="flex-1 relative w-full h-[calc(100vh-64px)] min-h-0 overflow-hidden">
        <MapComponent
          incidents={incidents}
          rescueTeams={rescueTeams}
          hospitals={hospitals}
          shelters={shelters}
          hazardZones={hazardZones}
          roadReports={roadReports}
          autoDetectLocation={false}
          className="absolute inset-0 w-full h-full"
        />
      </main>
    </div>
  );
}
