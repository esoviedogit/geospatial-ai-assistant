import type { AnalysisResult } from '../../analysis/models/analysis-result.model';
import type { ValidationResult } from '../../analysis/models/validation-result.model';

export interface AiAnalysisResult {
  readonly analysis: AnalysisResult;
  readonly validation: ValidationResult;
}
