"use client";

import MapView from "@/components/map/MapView";
import { ContactSection } from "@/components/sections/ContactSection";

export default function MapPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-offwhite bg-grid-pattern py-12 md:py-16 flex-grow">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-8">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-forest/60">
              Map Explorer
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
              Indonesia Environmental Health Map
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Interact with the map to explore environmental scores and metrics across the archipelago.
            </p>
          </div>

          <div className="bg-white border border-border-subtle rounded-2xl overflow-hidden shadow-sm h-[600px]">
            <MapView />
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
