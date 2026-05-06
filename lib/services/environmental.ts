import fs from 'fs';
import path from 'path';

interface EnvData {
  [key: string]: {
    forest_cover: number;
    biodiversity: number;
    degradation: number;
  };
}

interface GeoJSONFeature {
  type: string;
  properties: Record<string, any>;
  geometry: Record<string, any>;
}

interface GeoJSONFeatureCollection {
  type: string;
  crs?: Record<string, any>;
  features: GeoJSONFeature[];
}

const geoJsonPath = path.join(process.cwd(), 'data', 'geoBoundaries.geojson');
const envDataPath = path.join(process.cwd(), 'data', 'regency_environmental_data.json');

let geoData: GeoJSONFeatureCollection | null = null;
let envData: EnvData | null = null;

function loadData() {
  if (!geoData) {
    geoData = JSON.parse(fs.readFileSync(geoJsonPath, 'utf8'));
  }
  if (!envData) {
    envData = JSON.parse(fs.readFileSync(envDataPath, 'utf8'));
  }
}

function calculateScore(forest_cover: number, biodiversity: number, degradation: number): number {
  let score = (forest_cover * 3) + (biodiversity * 2) - (degradation * 2);
  return Math.max(0, Math.min(100, score));
}

export function getGeoJson(): GeoJSONFeatureCollection {
  loadData();
  return {
    ...geoData!,
    features: geoData!.features.map((feature, index) => ({
      ...feature,
      id: index,
      properties: {
        ...feature.properties,
        regionId: feature.properties.shapeName
      }
    }))
  };
}

export function getRegions(): Array<{ id: string; name: string }> {
  loadData();
  return Object.keys(envData!).map(name => ({
    id: name,
    name: name
  }));
}

export function getRegionById(id: string): any {
  loadData();

  const envInfo = envData![id];
  if (!envInfo) {
    return null;
  }

  const feature = geoData!.features.find(
    f => f.properties && f.properties.shapeName === id
  );

  const score = calculateScore(envInfo.forest_cover, envInfo.biodiversity, envInfo.degradation);

  return {
    id: id,
    name: id,
    metrics: {
      forest_cover: envInfo.forest_cover,
      biodiversity: envInfo.biodiversity,
      degradation: envInfo.degradation
    },
    score: score,
    geometry: feature ? feature.geometry : null
  };
}
