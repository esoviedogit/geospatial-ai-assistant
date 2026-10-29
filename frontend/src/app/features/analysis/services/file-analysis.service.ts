import { Injectable, inject } from '@angular/core';
import type Feature from 'ol/Feature.js';
import type Geometry from 'ol/geom/Geometry.js';
import type { AnalysisResult } from '../models/analysis-result.model';
import type { FileAnalysisReport } from '../models/file-analysis-report.model';
import { analyzeFeatures } from './feature-analysis';
import { GeoJsonAnalysisService } from './geojson-analysis.service';
import { KmlAnalysisService } from './kml-analysis.service';
import { ValidationService } from './validation.service';

@Injectable({ providedIn: 'root' })
export class FileAnalysisService {
  private readonly kmlAnalysisService = inject(KmlAnalysisService);
  private readonly geoJsonAnalysisService = inject(GeoJsonAnalysisService);
  private readonly validationService = inject(ValidationService);

  analyze(file: File): Promise<AnalysisResult> {
    return this.readFeatures(file).then(analyzeFeatures);
  }

  async analyzeWithValidation(file: File): Promise<FileAnalysisReport> {
    const features = await this.readFeatures(file);
    return {
      analysis: analyzeFeatures(features),
      validation: this.validationService.validate(features)
    };
  }

  private readFeatures(file: File): Promise<Feature<Geometry>[]> {
    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'kml':
        return this.kmlAnalysisService.readFeatures(file);
      case 'geojson':
      case 'json':
        return this.geoJsonAnalysisService.readFeatures(file);
      default:
        throw new Error(`Unsupported file type: ${file.name}`);
    }
  }
}
