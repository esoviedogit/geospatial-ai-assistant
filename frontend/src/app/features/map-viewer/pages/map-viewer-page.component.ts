import { Component, inject, signal } from '@angular/core';
import Feature from 'ol/Feature.js';
import type Geometry from 'ol/geom/Geometry.js';
import { FileUploadComponent } from '../../../shared/components/file-upload.component';
import type { AnalysisResult } from '../../analysis/models/analysis-result.model';
import { FileAnalysisService } from '../../analysis/services/file-analysis.service';
import { MapViewerComponent } from '../components/map-viewer.component';
import { MapViewerService } from '../services/map-viewer.service';

@Component({
  selector: 'app-map-viewer-page',
  standalone: true,
  imports: [FileUploadComponent, MapViewerComponent],
  templateUrl: './map-viewer-page.component.html',
  styleUrl: './map-viewer-page.component.scss'
})
export class MapViewerPageComponent {
  private readonly fileAnalysisService = inject(FileAnalysisService);
  private readonly mapViewerService = inject(MapViewerService);

  readonly features = signal<Feature<Geometry>[] | null>(null);
  readonly analysis = signal<AnalysisResult | null>(null);
  readonly fileName = signal<string | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  async loadFile(file: File): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    this.features.set(null);
    this.analysis.set(null);
    this.fileName.set(file.name);

    try {
      const analysis = await this.fileAnalysisService.analyze(file);
      const features = await this.mapViewerService.readFeatures(file);
      this.analysis.set(analysis);
      this.features.set(features);
    } catch {
      this.error.set('Unable to load the selected geospatial file.');
    } finally {
      this.loading.set(false);
    }
  }
}
