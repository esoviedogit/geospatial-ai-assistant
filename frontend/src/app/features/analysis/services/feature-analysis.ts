import type Feature from 'ol/Feature.js';
import GeometryCollection from 'ol/geom/GeometryCollection.js';
import type Geometry from 'ol/geom/Geometry.js';
import type { AnalysisResult } from '../models/analysis-result.model';

type GeometryCategory = 'point' | 'line' | 'polygon';

export function analyzeFeatures(features: Feature[]): AnalysisResult {
  const result = {
    totalFeatures: features.length,
    points: 0,
    lines: 0,
    polygons: 0
  };

  for (const feature of features) {
    const geometry = feature.getGeometry();
    if (!geometry) {
      continue;
    }

    const categories = getGeometryCategories(geometry);
    if (categories.has('point')) {
      result.points += 1;
    }
    if (categories.has('line')) {
      result.lines += 1;
    }
    if (categories.has('polygon')) {
      result.polygons += 1;
    }
  }

  return {
    totalFeatures: result.totalFeatures,
    points: result.points,
    lines: result.lines,
    polygons: result.polygons
  };
}

function getGeometryCategories(geometry: Geometry): Set<GeometryCategory> {
  if (geometry instanceof GeometryCollection) {
    return geometry.getGeometries().reduce(
      (categories, child) => new Set([...categories, ...getGeometryCategories(child)]),
      new Set<GeometryCategory>()
    );
  }

  switch (geometry.getType()) {
    case 'Point':
    case 'MultiPoint':
      return new Set(['point']);
    case 'LineString':
    case 'MultiLineString':
      return new Set(['line']);
    case 'Polygon':
    case 'MultiPolygon':
      return new Set(['polygon']);
    default:
      return new Set();
  }
}
