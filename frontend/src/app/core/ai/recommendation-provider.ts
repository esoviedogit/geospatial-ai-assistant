import type { AnalysisResult } from '../../features/analysis/models/analysis-result.model';
import type { ValidationResult } from '../../features/analysis/models/validation-result.model';
import type { AiRecommendation } from '../../features/ai-assistant/models/ai-recommendation.model';

export interface RecommendationProvider {
  generateAssessment(
    analysis: AnalysisResult,
    validation: ValidationResult
  ): Promise<AiRecommendation>;
}
