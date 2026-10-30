import { Component, inject, signal } from '@angular/core';
import { AiRecommendationsComponent } from '../../ai-assistant/components/ai-recommendations.component';
import type { AiRecommendation } from '../../ai-assistant/models/ai-recommendation.model';
import { AnalysisAgentService } from '../../ai-assistant/services/analysis-agent.service';
import { FileUploadComponent } from '../../../shared/components/file-upload.component';
import { ValidationReportComponent } from '../components/validation-report.component';
import type { AnalysisResult } from '../models/analysis-result.model';
import type { ValidationSummary } from '../models/validation-summary.model';
import { FileAnalysisService } from '../services/file-analysis.service';

@Component({
  selector: 'app-analysis-page',
  standalone: true,
  imports: [AiRecommendationsComponent, FileUploadComponent, ValidationReportComponent],
  templateUrl: './analysis-page.component.html',
  styleUrl: './analysis-page.component.scss'
})
export class AnalysisPageComponent {
  private readonly fileAnalysisService = inject(FileAnalysisService);
  private readonly analysisAgentService = inject(AnalysisAgentService);

  readonly result = signal<AnalysisResult | null>(null);
  readonly validation = signal<ValidationSummary | null>(null);
  readonly aiAssessment = signal<AiRecommendation | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedFileName = signal<string | null>(null);

  async analyzeFile(file: File): Promise<void> {
    this.selectedFileName.set(file.name);
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);
    this.validation.set(null);
    this.aiAssessment.set(null);

    try {
      const report = await this.fileAnalysisService.analyzeWithValidation(file);
      const aiAssessment = await this.analysisAgentService.generateRecommendations({
        analysis: report.analysis,
        validation: report.validation.result
      });
      this.result.set(report.analysis);
      this.validation.set(report.validation);
      this.aiAssessment.set(aiAssessment);
    } catch {
      this.error.set('Unable to analyze the selected file.');
    } finally {
      this.loading.set(false);
    }
  }
}
