import { Injectable } from '@angular/core';
import KML from 'ol/format/KML.js';
import type { AnalysisResult } from '../models/analysis-result.model';
import { analyzeFeatures } from './feature-analysis';

@Injectable({ providedIn: 'root' })
export class KmlAnalysisService {
  async analyze(file: File): Promise<AnalysisResult> {
    const features = new KML().readFeatures(await file.text());
    return analyzeFeatures(features);
  }
}
