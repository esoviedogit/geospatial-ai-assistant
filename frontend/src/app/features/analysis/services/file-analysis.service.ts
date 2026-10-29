import { Injectable, inject } from '@angular/core';
import type { AnalysisResult } from '../models/analysis-result.model';
import { GeoJsonAnalysisService } from './geojson-analysis.service';
import { KmlAnalysisService } from './kml-analysis.service';

@Injectable({ providedIn: 'root' })
export class FileAnalysisService {
  private readonly kmlAnalysisService = inject(KmlAnalysisService);
  private readonly geoJsonAnalysisService = inject(GeoJsonAnalysisService);

  analyze(file: File): Promise<AnalysisResult> {
    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'kml':
        return this.kmlAnalysisService.analyze(file);
      case 'geojson':
      case 'json':
        return this.geoJsonAnalysisService.analyze(file);
      default:
        throw new Error(`Unsupported file type: ${file.name}`);
    }
  }
}
