import { BadGatewayException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { AssessmentRequestDto } from '../dto/assessment-request.dto';
import { OpenAiAssessmentProvider } from './openai-assessment.provider';

const mockCreate = jest.fn();

jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: { completions: { create: mockCreate } }
  }))
}));

describe('OpenAiAssessmentProvider', () => {
  const request = {
    analysis: { totalFeatures: 3, points: 1, lines: 1, polygons: 1 },
    validation: {
      unnamedFeatures: 1,
      missingGeometries: 0,
      emptyGeometries: 0,
      invalidCoordinates: 0,
      duplicatedFeatures: 0,
      warnings: ['Unnamed features: 1']
    }
  } satisfies AssessmentRequestDto;

  let provider: OpenAiAssessmentProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    const configService = new ConfigService({
      OPENAI_API_KEY: 'test-api-key',
      OPENAI_MODEL: 'test-model'
    });
    provider = new OpenAiAssessmentProvider(configService);
  });

  it('should request and return a structured assessment', async () => {
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              summary: 'Review the dataset.',
              warnings: ['One feature is unnamed.'],
              recommendations: ['Add a descriptive name.']
            })
          }
        }
      ]
    });

    await expect(provider.generateAssessment(request)).resolves.toEqual({
      summary: 'Review the dataset.',
      warnings: ['One feature is unnamed.'],
      recommendations: ['Add a descriptive name.']
    });
    expect(OpenAI).toHaveBeenCalledWith({ apiKey: 'test-api-key' });
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'test-model',
        response_format: { type: 'json_object' }
      })
    );
  });

  it('should fail clearly when the API key is missing', async () => {
    provider = new OpenAiAssessmentProvider(new ConfigService({}));

    await expect(provider.generateAssessment(request)).rejects.toBeInstanceOf(
      ServiceUnavailableException
    );
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('should reject malformed provider output', async () => {
    mockCreate.mockResolvedValue({ choices: [{ message: { content: 'not-json' } }] });

    await expect(provider.generateAssessment(request)).rejects.toBeInstanceOf(
      BadGatewayException
    );
  });
});
