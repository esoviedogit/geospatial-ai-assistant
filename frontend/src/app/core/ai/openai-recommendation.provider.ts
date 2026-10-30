import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { AnalysisResult } from '../../features/analysis/models/analysis-result.model';
import type { ValidationResult } from '../../features/analysis/models/validation-result.model';
import type { AiRecommendation } from '../../features/ai-assistant/models/ai-recommendation.model';
import { RulesRecommendationProvider } from './rules-recommendation.provider';
import type { RecommendationProvider } from './recommendation-provider';

@Injectable({ providedIn: 'root' })
export class OpenAiRecommendationProvider implements RecommendationProvider {
  private readonly http = inject(HttpClient);
  private readonly rulesProvider = inject(RulesRecommendationProvider);

  async generateAssessment(
    analysis: AnalysisResult,
    validation: ValidationResult
  ): Promise<AiRecommendation> {
    try {
      const response = await firstValueFrom(
        this.http.post<unknown>('/api/ai/assessment', { analysis, validation })
      );
      return this.parseRecommendation(response);
    } catch (error) {
      if (!(error instanceof HttpErrorResponse)) {
        throw error;
      }

      const fallback = await this.rulesProvider.generateAssessment(analysis, validation);
      return {
        ...fallback,
        warnings: [...fallback.warnings, 'AI service unavailable; rules-based fallback used.']
      };
    }
  }

  private parseRecommendation(response: unknown): AiRecommendation {
    if (
      typeof response !== 'object' ||
      response === null ||
      !('summary' in response) ||
      !('warnings' in response) ||
      !('recommendations' in response) ||
      typeof response.summary !== 'string' ||
      !Array.isArray(response.warnings) ||
      !response.warnings.every((warning) => typeof warning === 'string') ||
      !Array.isArray(response.recommendations) ||
      !response.recommendations.every((recommendation) => typeof recommendation === 'string')
    ) {
      throw new Error('Assessment API returned an invalid response.');
    }

    return {
      summary: response.summary,
      warnings: response.warnings,
      recommendations: response.recommendations
    };
  }
}
