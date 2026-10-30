import { BadGatewayException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AssessmentRequestDto } from '../dto/assessment-request.dto';
import { OllamaAssessmentProvider } from './ollama-assessment.provider';

describe('OllamaAssessmentProvider', () => {
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

  let provider: OllamaAssessmentProvider;
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    provider = new OllamaAssessmentProvider(
      new ConfigService({
        OLLAMA_BASE_URL: 'http://localhost:11434/',
        OLLAMA_MODEL: 'test-model'
      })
    );
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('should request and return a structured assessment', async () => {
    fetchSpy.mockResolvedValue(
      new Response(
        JSON.stringify({
          message: {
            content: JSON.stringify({
              summary: 'Review the dataset.',
              warnings: ['One feature is unnamed.'],
              recommendations: ['Add a descriptive name.']
            })
          }
        }),
        { status: 200 }
      )
    );

    await expect(provider.generateAssessment(request)).resolves.toEqual({
      summary: 'Review the dataset.',
      warnings: ['One feature is unnamed.'],
      recommendations: ['Add a descriptive name.']
    });
    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:11434/api/chat',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"model":"test-model"')
      })
    );
  });

  it('should use the default Ollama URL and model', async () => {
    provider = new OllamaAssessmentProvider(new ConfigService({}));
    fetchSpy.mockResolvedValue(
      new Response(
        JSON.stringify({
          message: {
            content: JSON.stringify({
              summary: 'Summary',
              warnings: [],
              recommendations: []
            })
          }
        }),
        { status: 200 }
      )
    );

    await provider.generateAssessment(request);

    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:11434/api/chat',
      expect.objectContaining({
        body: expect.stringContaining('"model":"llama3.2"')
      })
    );
  });

  it('should report Ollama connectivity failures as service unavailable', async () => {
    fetchSpy.mockRejectedValue(new Error('Connection refused'));

    await expect(provider.generateAssessment(request)).rejects.toBeInstanceOf(
      ServiceUnavailableException
    );
  });

  it('should reject malformed Ollama assessment output', async () => {
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify({ message: { content: 'not-json' } }), { status: 200 })
    );

    await expect(provider.generateAssessment(request)).rejects.toBeInstanceOf(
      BadGatewayException
    );
  });

  it('should reject non-successful Ollama responses', async () => {
    fetchSpy.mockResolvedValue(new Response('', { status: 500 }));

    await expect(provider.generateAssessment(request)).rejects.toBeInstanceOf(
      BadGatewayException
    );
  });
});
