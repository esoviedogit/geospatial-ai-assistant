import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AssessmentRequestDto } from './dto/assessment-request.dto';

describe('AiController', () => {
  let controller: AiController;
  let aiService: { createAssessment: jest.Mock };

  beforeEach(async () => {
    aiService = {
      createAssessment: jest.fn().mockResolvedValue({
        summary: 'Assessment summary',
        warnings: [],
        recommendations: ['Review the dataset.']
      })
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [{ provide: AiService, useValue: aiService }]
    }).compile();

    controller = module.get<AiController>(AiController);
  });

  it('should pass the assessment request to the AI service', async () => {
    const request = {
      analysis: { totalFeatures: 1, points: 1, lines: 0, polygons: 0 },
      validation: {
        unnamedFeatures: 0,
        missingGeometries: 0,
        emptyGeometries: 0,
        invalidCoordinates: 0,
        duplicatedFeatures: 0,
        warnings: []
      }
    } satisfies AssessmentRequestDto;

    await expect(controller.createAssessment(request)).resolves.toEqual({
      summary: 'Assessment summary',
      warnings: [],
      recommendations: ['Review the dataset.']
    });
    expect(aiService.createAssessment).toHaveBeenCalledWith(request);
  });
});
