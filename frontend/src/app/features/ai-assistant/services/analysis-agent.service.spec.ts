import { TestBed } from '@angular/core/testing';
import type { AiAnalysisResult } from '../models/ai-analysis-result.model';
import { AnalysisAgentService } from './analysis-agent.service';

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
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalysisAgentService);
  });

  it('should recommend reviewing features without names', () => {
    const result = service.generateRecommendations(createInput({ unnamedFeatures: 2 }));

    expect(result.warnings).toContain('2 features are missing their names.');
    expect(result.recommendations).toContain('Review features without names.');
  });

  it('should recommend reviewing duplicated geometries', () => {
    const result = service.generateRecommendations(createInput({ duplicatedFeatures: 3 }));

    expect(result.warnings).toContain('3 duplicate geometries were detected.');
    expect(result.recommendations).toContain(
      'Duplicated geometries may affect visualization and analysis.'
    );
  });

  it('should recommend correcting invalid coordinates', () => {
    const result = service.generateRecommendations(createInput({ invalidCoordinates: 1 }));

    expect(result.warnings).toContain('1 feature has invalid coordinates.');
    expect(result.recommendations).toContain(
      'Invalid coordinates were detected and should be corrected.'
    );
  });

  it('should recommend scale-dependent rendering for large datasets', () => {
    const result = service.generateRecommendations(createInput({}, 1001));

    expect(result.recommendations).toContain(
      'Large dataset detected. Consider scale-dependent rendering.'
    );
    expect(result.warnings).toEqual([]);
  });

  it('should return no warnings or recommendations for a clean dataset', () => {
    expect(service.generateRecommendations(createInput())).toEqual({
      summary: 'The dataset contains 100 features and no data quality warnings were found.',
      warnings: [],
      recommendations: []
    });
  });
});
