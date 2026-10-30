import { Inject, Injectable } from '@angular/core';
import type { AiAnalysisResult } from '../models/ai-analysis-result.model';
import type { AiRecommendation } from '../models/ai-recommendation.model';
import { RECOMMENDATION_PROVIDER } from '../../../core/ai/recommendation-provider.token';
import type { RecommendationProvider } from '../../../core/ai/recommendation-provider';

@Injectable({ providedIn: 'root' })
export class AnalysisAgentService {
  constructor(
    @Inject(RECOMMENDATION_PROVIDER)
    private readonly recommendationProvider: RecommendationProvider
  ) {}

  generateRecommendations(input: AiAnalysisResult): Promise<AiRecommendation> {
    return this.recommendationProvider.generateAssessment(input.analysis, input.validation);
  }
}
