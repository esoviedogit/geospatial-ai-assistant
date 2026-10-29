import { Injectable } from '@angular/core';
import KML from 'ol/format/KML.js';
import GeometryCollection from 'ol/geom/GeometryCollection.js';
import type Geometry from 'ol/geom/Geometry.js';
import type { AnalysisResult } from '../models/analysis-result.model';

@Injectable({ providedIn: 'root' })
export class KmlAnalysisService {
  async analyze(file: File): Promise<AnalysisResult> {
    const features = new KML().readFeatures(await file.text());
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

      const categories = this.getGeometryCategories(geometry);
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

    return result;
  }

  private getGeometryCategories(geometry: Geometry): Set<'point' | 'line' | 'polygon'> {
    if (geometry instanceof GeometryCollection) {
      return geometry.getGeometries().reduce(
        (categories, child) => new Set([...categories, ...this.getGeometryCategories(child)]),
        new Set<'point' | 'line' | 'polygon'>()
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
}
