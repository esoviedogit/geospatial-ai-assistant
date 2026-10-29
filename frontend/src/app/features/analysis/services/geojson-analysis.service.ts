import { Injectable } from '@angular/core';
import GeoJSON from 'ol/format/GeoJSON.js';
import type { AnalysisResult } from '../models/analysis-result.model';
import { analyzeFeatures } from './feature-analysis';

@Injectable({ providedIn: 'root' })
export class GeoJsonAnalysisService {
  async analyze(file: File): Promise<AnalysisResult> {
    const features = new GeoJSON().readFeatures(await file.text());
    return analyzeFeatures(features);
  }
}
