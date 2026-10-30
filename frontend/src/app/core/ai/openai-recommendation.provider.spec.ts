import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { RulesRecommendationProvider } from './rules-recommendation.provider';
import { OpenAiRecommendationProvider } from './openai-recommendation.provider';

describe('OpenAiRecommendationProvider', () => {
  let provider: OpenAiRecommendationProvider;
  let httpTestingController: HttpTestingController;

  const analysis = { totalFeatures: 1, points: 1, lines: 0, polygons: 0 };
  const validation = {
    unnamedFeatures: 1,
    missingGeometries: 0,
    emptyGeometries: 0,
    invalidCoordinates: 0,
    duplicatedFeatures: 0,
    warnings: ['Unnamed features: 1']
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        RulesRecommendationProvider
      ]
    });
    provider = TestBed.inject(OpenAiRecommendationProvider);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('should post assessment input to the backend and return its response', async () => {
    const assessmentPromise = provider.generateAssessment(analysis, validation);
    const request = httpTestingController.expectOne('/api/ai/assessment');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ analysis, validation });
    request.flush({
      summary: 'Assessment from backend',
      warnings: [],
      recommendations: ['Review the data.']
    });

    await expectAsync(assessmentPromise).toBeResolvedTo({
      summary: 'Assessment from backend',
      warnings: [],
      recommendations: ['Review the data.']
    });
  });

  it('should use the rules provider when the backend request fails', async () => {
    const assessmentPromise = provider.generateAssessment(analysis, validation);
    httpTestingController.expectOne('/api/ai/assessment').flush('Unavailable', {
      status: 503,
      statusText: 'Service Unavailable'
    });

    const assessment = await assessmentPromise;
    expect(assessment.recommendations).toContain('Review features without names.');
    expect(assessment.warnings).toContain(
      'AI service unavailable; rules-based fallback used.'
    );
  });

  it('should reject an invalid backend response instead of silently falling back', async () => {
    const assessmentPromise = provider.generateAssessment(analysis, validation);
    httpTestingController.expectOne('/api/ai/assessment').flush({ summary: 123 });

    await expectAsync(assessmentPromise).toBeRejectedWithError(
      'Assessment API returned an invalid response.'
    );
  });
});
