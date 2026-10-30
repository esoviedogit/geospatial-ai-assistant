import { TestBed } from '@angular/core/testing';
import type { AiAnalysisResult } from '../models/ai-analysis-result.model';
import { AnalysisAgentService } from './analysis-agent.service';
import { RECOMMENDATION_PROVIDER } from '../../../core/ai/recommendation-provider.token';
import { RulesRecommendationProvider } from '../../../core/ai/rules-recommendation.provider';

describe('AnalysisAgentService', () => {
  let service: AnalysisAgentService;

  const createInput = (
    overrides: Partial<AiAnalysisResult['validation']> = {},
    totalFeatures = 100
  ): AiAnalysisResult => ({
    analysis: {
      totalFeatures,
      points: 10,
      lines: 5,
      polygons: 3
    },
    validation: {
      unnamedFeatures: 0,
      missingGeometries: 0,
      emptyGeometries: 0,
      invalidCoordinates: 0,
      duplicatedFeatures: 0,
      warnings: [],
      ...overrides
    }
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RulesRecommendationProvider,
        { provide: RECOMMENDATION_PROVIDER, useExisting: RulesRecommendationProvider }
      ]
    });
    service = TestBed.inject(AnalysisAgentService);
  });

  it('should recommend reviewing features without names', async () => {
    const result = await service.generateRecommendations(createInput({ unnamedFeatures: 2 }));

    expect(result.warnings).toContain('2 features are missing their names.');
    expect(result.recommendations).toContain('Review features without names.');
  });

  it('should recommend reviewing duplicated geometries', async () => {
    const result = await service.generateRecommendations(createInput({ duplicatedFeatures: 3 }));

    expect(result.warnings).toContain('3 duplicate geometries were detected.');
    expect(result.recommendations).toContain(
      'Duplicated geometries may affect visualization and analysis.'
    );
  });

  it('should recommend correcting invalid coordinates', async () => {
    const result = await service.generateRecommendations(createInput({ invalidCoordinates: 1 }));

    expect(result.warnings).toContain('1 feature has invalid coordinates.');
    expect(result.recommendations).toContain(
      'Invalid coordinates were detected and should be corrected.'
    );
  });

  it('should recommend scale-dependent rendering for large datasets', async () => {
    const result = await service.generateRecommendations(createInput({}, 1001));

    expect(result.recommendations).toContain(
      'Large dataset detected. Consider scale-dependent rendering.'
    );
    expect(result.warnings).toEqual([]);
  });

  it('should return no warnings or recommendations for a clean dataset', async () => {
    await expectAsync(service.generateRecommendations(createInput())).toBeResolvedTo({
      summary: 'The dataset contains 100 features and no data quality warnings were found.',
      warnings: [],
      recommendations: []
    });
  });

});

describe('AnalysisAgentService provider delegation', () => {
  it('should pass analysis and validation results to the injected provider', async () => {
    const provider = jasmine.createSpyObj('RecommendationProvider', ['generateAssessment']);
    const input = {
      analysis: { totalFeatures: 0, points: 0, lines: 0, polygons: 0 },
      validation: {
        unnamedFeatures: 0,
        missingGeometries: 0,
        emptyGeometries: 0,
        invalidCoordinates: 0,
        duplicatedFeatures: 0,
        warnings: []
      }
    } satisfies AiAnalysisResult;
    provider.generateAssessment.and.resolveTo({
      summary: 'Provider assessment',
      warnings: [],
      recommendations: []
    });

    TestBed.configureTestingModule({
      providers: [
        AnalysisAgentService,
        { provide: RECOMMENDATION_PROVIDER, useValue: provider }
      ]
    });

    await TestBed.inject(AnalysisAgentService).generateRecommendations(input);

    expect(provider.generateAssessment).toHaveBeenCalledOnceWith(input.analysis, input.validation);
  });
});
