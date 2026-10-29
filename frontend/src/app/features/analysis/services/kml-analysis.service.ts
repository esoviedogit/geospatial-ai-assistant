import { Injectable } from '@angular/core';
import KML from 'ol/format/KML.js';
import type Feature from 'ol/Feature.js';
import type Geometry from 'ol/geom/Geometry.js';
import type { AnalysisResult } from '../models/analysis-result.model';
import { analyzeFeatures } from './feature-analysis';

@Injectable({ providedIn: 'root' })
export class KmlAnalysisService {
  async readFeatures(file: File): Promise<Feature<Geometry>[]> {
    return new KML().readFeatures(await file.text());
  }

  async analyze(file: File): Promise<AnalysisResult> {
    const features = await this.readFeatures(file);
    return analyzeFeatures(features);
  }
}
