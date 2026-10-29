import type { AnalysisResult } from './analysis-result.model';
import type { ValidationSummary } from './validation-summary.model';

export interface FileAnalysisReport {
  readonly analysis: AnalysisResult;
  readonly validation: ValidationSummary;
}
