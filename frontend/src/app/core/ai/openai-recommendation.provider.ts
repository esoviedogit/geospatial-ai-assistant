import { Injectable } from '@angular/core';
import type { AnalysisResult } from '../../features/analysis/models/analysis-result.model';
import type { ValidationResult } from '../../features/analysis/models/validation-result.model';
import type { AiRecommendation } from '../../features/ai-assistant/models/ai-recommendation.model';
import type { RecommendationProvider } from './recommendation-provider';

@Injectable({ providedIn: 'root' })
export class OpenAiRecommendationProvider implements RecommendationProvider {
  async generateAssessment(
    analysis: AnalysisResult,
    validation: ValidationResult
  ): Promise<AiRecommendation> {
    // TODO: Call a secured backend endpoint that integrates Azure OpenAI.
    // TODO: Validate and map the endpoint response to AiRecommendation.
    return {
      summary: `AI assessment is not connected yet. The dataset contains ${analysis.totalFeatures} features.`,
      warnings: validation.warnings,
      recommendations: []
    };
  }
}
