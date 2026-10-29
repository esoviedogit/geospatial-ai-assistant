import type { ValidationResult } from './validation-result.model';

export interface ValidationSummary {
  readonly featuresAnalyzed: number;
  readonly result: ValidationResult;
}
