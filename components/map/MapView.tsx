"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { cn } from "@/lib/utils";
import axios from "axios";



interface RegionData {
  id: string;
  name: string;
  score: number;
  metrics: {
    forest_cover: number;
    biodiversity: number;
    degradation: number;
  };
}

function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-forest/70">{label}</span>
        <span className="text-text-primary">{value.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 w-full bg-forest/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-forest transition-all duration-500 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function getSummary(score: number) {
  if (score > 75) return "Exceptional environmental stability and robust ecosystem health.";
  if (score > 60) return "Healthy ecosystem with strong conservation metrics.";
  if (score > 50) return "Moderate environmental health; some areas show signs of pressure.";
  if (score > 40) return "Environmental stress detected. Monitoring recommended.";
  return "Significant degradation. Immediate conservation intervention required.";
}

function getStatusLabel(score: number) {
  if (score > 75) return "Excellent";
  if (score > 50) return "Stable";
  if (score > 40) return "Warning";
  return "Critical";
}

function getStatusColor(score: number) {
  if (score > 75) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (score > 50) return "text-forest bg-forest/5 border-forest/20";
  if (score > 40) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-red-600 bg-red-50 border-red-200";
}

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [118.0149, -2.5489],
      zoom: 4,
    });

    map.current.on("load", async () => {
      if (!map.current) return;

      try {
        const res = await axios.get("/api/geojson");
        const data = res.data;

        map.current.addSource("regions", {
          type: "geojson",
          data: data,
          promoteId: "regionId",
        });

        map.current.addLayer({
          id: "regions-fill",
          type: "fill",
          source: "regions",
          paint: {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", "score"],
              0, "#ef4444",
              50, "#f59e0b",
              75, "#10b981",
              100, "#0f2e22"
            ],
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              0.8,
              0.5,
            ],
          },
        });

        map.current.addLayer({
          id: "regions-line",
          type: "line",
          source: "regions",
          paint: {
            "line-color": "#ffffff",
            "line-width": 1,
            "line-opacity": 0.5
          },
        });

        let hoveredId: string | number | null = null;

        map.current.on("mousemove", "regions-fill", (e) => {
          if (!map.current || !e.features || e.features.length === 0) return;

          if (hoveredId !== null) {
            map.current.setFeatureState(
              { source: "regions", id: hoveredId },
              { hover: false }
            );
          }

          hoveredId = e.features[0].properties?.regionId ?? e.features[0].id;
          if (hoveredId == null) return;

          map.current.setFeatureState(
            { source: "regions", id: hoveredId },
            { hover: true }
          );

          map.current.getCanvas().style.cursor = "pointer";
        });

        map.current.on("mouseleave", "regions-fill", () => {
          if (!map.current) return;
          if (hoveredId !== null) {
            map.current.setFeatureState(
              { source: "regions", id: hoveredId },
              { hover: false }
            );
          }
          hoveredId = null;
          map.current.getCanvas().style.cursor = "";
        });

        map.current.on("click", "regions-fill", async (e) => {
          if (!e.features || e.features.length === 0) return;

          const regionId = e.features[0].properties?.regionId;
          if (!regionId) return;

          setLoading(true);
          try {
            const res = await axios.get(
              `/api/region/${encodeURIComponent(regionId)}`
            );
            setSelectedRegion(res.data);
          } catch (err) {
            console.error(err);
            setSelectedRegion(null);
          } finally {
            setLoading(false);
          }
        });
      } catch (err) {
        console.error("Failed to load geojson:", err);
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[600px]">
      <div
        ref={mapContainer}
        className="flex-[2] min-h-[400px] lg:min-h-0 bg-secondary/30 rounded-xl overflow-hidden border border-border-subtle"
      />
      
      <div className="flex-1 bg-white p-6 rounded-xl border border-border-subtle flex flex-col gap-6 overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold text-text-primary tracking-tight">Region Details</h2>
          <p className="text-sm text-muted-foreground mt-1">Environmental health assessment</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 animate-pulse">
            <div className="h-8 w-32 bg-forest/10 rounded-lg" />
            <div className="h-4 w-48 bg-forest/5 rounded-lg" />
          </div>
        ) : selectedRegion ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
              <div className="flex items-end justify-between border-b border-border-subtle pb-4">
                <div>
                  <h3 className="text-2xl font-bold text-forest">{selectedRegion.name}</h3>
                  <div className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border mt-2",
                    getStatusColor(selectedRegion.score)
                  )}>
                    {getStatusLabel(selectedRegion.score)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-forest">
                    {selectedRegion.score.toFixed(1)}
                  </div>
                  <div className="text-[10px] font-medium uppercase text-muted-foreground tracking-tighter">
                    Sustainability Index
                  </div>
                </div>
              </div>

              <div className="bg-forest/5 p-4 rounded-lg border border-forest/10">
                <p className="text-sm leading-relaxed text-forest/90 font-medium">
                  {getSummary(selectedRegion.score)}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border-subtle pb-2">
                Core Metrics
              </h4>
              <MetricBar label="Forest Cover" value={selectedRegion.metrics.forest_cover} />
              <MetricBar label="Biodiversity" value={selectedRegion.metrics.biodiversity} />
              <MetricBar label="Land Quality" value={100 - selectedRegion.metrics.degradation} />
            </div>

            <div className="pt-4">
              <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                Data based on latest satellite imagery and ground observations. 
                Scores are normalized across the 34 provinces of Indonesia.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center text-center p-8 border-2 border-dashed border-border-subtle rounded-xl bg-offwhite/50">
            <div>
              <div className="mb-4 text-forest/20 flex justify-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Click on a province in the map <br /> to view detailed analysis.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
