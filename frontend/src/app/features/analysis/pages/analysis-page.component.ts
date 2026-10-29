import { Component, inject, signal } from '@angular/core';
import { FileUploadComponent } from '../components/file-upload.component';
import type { AnalysisResult } from '../models/analysis-result.model';
import { KmlAnalysisService } from '../services/kml-analysis.service';

@Component({
  selector: 'app-analysis-page',
  standalone: true,
  imports: [FileUploadComponent],
  template: `
    <main>
      <h1>KML analysis</h1>
      <app-file-upload (fileSelected)="analyzeFile($event)" />

      @if (loading()) {
        <p role="status">Analyzing file...</p>
      }

      @if (error()) {
        <p role="alert">{{ error() }}</p>
      }

      @if (result(); as analysis) {
        <section aria-labelledby="results-heading">
          <h2 id="results-heading">Analysis results</h2>
          <dl>
            <dt>Total features</dt>
            <dd>{{ analysis.totalFeatures }}</dd>
            <dt>Points</dt>
            <dd>{{ analysis.points }}</dd>
            <dt>Lines</dt>
            <dd>{{ analysis.lines }}</dd>
            <dt>Polygons</dt>
            <dd>{{ analysis.polygons }}</dd>
          </dl>
        </section>
      }
    </main>
  `
})
export class AnalysisPageComponent {
  private readonly kmlAnalysisService = inject(KmlAnalysisService);

  readonly result = signal<AnalysisResult | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  async analyzeFile(file: File): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);

    try {
      this.result.set(await this.kmlAnalysisService.analyze(file));
    } catch {
      this.error.set('Unable to analyze the selected KML file.');
    } finally {
      this.loading.set(false);
    }
  }
}
