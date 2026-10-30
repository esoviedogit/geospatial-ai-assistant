import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { ASSESSMENT_PROVIDER } from './assessment-provider.token';
import { AssessmentRequestDto } from './dto/assessment-request.dto';

describe('AiService', () => {
  let service: AiService;
  let provider: { generateAssessment: jest.Mock };

  beforeEach(async () => {
    provider = {
      generateAssessment: jest.fn().mockResolvedValue({
        summary: 'Assessment summary',
        warnings: [],
        recommendations: []
      })
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AiService, { provide: ASSESSMENT_PROVIDER, useValue: provider }]
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should delegate assessment generation to the configured provider', async () => {
    const request = {
      analysis: { totalFeatures: 0, points: 0, lines: 0, polygons: 0 },
      validation: {
        unnamedFeatures: 0,
        missingGeometries: 0,
        emptyGeometries: 0,
        invalidCoordinates: 0,
        duplicatedFeatures: 0,
        warnings: []
      }
    } satisfies AssessmentRequestDto;

    await expect(service.createAssessment(request)).resolves.toEqual({
      summary: 'Assessment summary',
      warnings: [],
      recommendations: []
    });
    expect(provider.generateAssessment).toHaveBeenCalledTimes(1);
    expect(provider.generateAssessment).toHaveBeenCalledWith(request);
  });
});
