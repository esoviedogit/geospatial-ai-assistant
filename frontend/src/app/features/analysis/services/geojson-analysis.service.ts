import { Injectable } from '@angular/core';
import Feature from 'ol/Feature.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import type Geometry from 'ol/geom/Geometry.js';
import type { AnalysisResult } from '../models/analysis-result.model';
import { analyzeFeatures } from './feature-analysis';

@Injectable({ providedIn: 'root' })
export class GeoJsonAnalysisService {
  async readFeatures(file: File): Promise<Feature<Geometry>[]> {
    return new GeoJSON().readFeatures(await file.text());
  }

  async analyze(file: File): Promise<AnalysisResult> {
    const features = await this.readFeatures(file);
    return analyzeFeatures(features);
  }
}
