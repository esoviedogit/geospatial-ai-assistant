import { Component, inject, signal } from '@angular/core';
import { FileUploadComponent } from '../components/file-upload.component';
import type { AnalysisResult } from '../models/analysis-result.model';
import { FileAnalysisService } from '../services/file-analysis.service';

@Component({
  selector: 'app-analysis-page',
  standalone: true,
  imports: [FileUploadComponent],
  templateUrl: './analysis-page.component.html',
  styleUrl: './analysis-page.component.scss'
})
export class AnalysisPageComponent {
  private readonly fileAnalysisService = inject(FileAnalysisService);

  readonly result = signal<AnalysisResult | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedFileName = signal<string | null>(null);

  async analyzeFile(file: File): Promise<void> {
    this.selectedFileName.set(file.name);
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);

    try {
      this.result.set(await this.fileAnalysisService.analyze(file));
    } catch {
      this.error.set('Unable to analyze the selected file.');
    } finally {
      this.loading.set(false);
    }
  }
}
