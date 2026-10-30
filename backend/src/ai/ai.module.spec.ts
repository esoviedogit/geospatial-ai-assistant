import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ASSESSMENT_PROVIDER } from './assessment-provider.token';
import { AiModule } from './ai.module';
import { OllamaAssessmentProvider } from './providers/ollama-assessment.provider';
import { OpenAiAssessmentProvider } from './providers/openai-assessment.provider';

describe('AiModule provider selection', () => {
  const originalProvider = process.env.AI_PROVIDER;

  afterEach(() => {
    if (originalProvider === undefined) {
      delete process.env.AI_PROVIDER;
    } else {
      process.env.AI_PROVIDER = originalProvider;
    }
  });

  it('should select OpenAI by default', async () => {
    delete process.env.AI_PROVIDER;
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }), AiModule]
    }).compile();

    expect(moduleRef.get(ASSESSMENT_PROVIDER)).toBeInstanceOf(OpenAiAssessmentProvider);
    await moduleRef.close();
  });

  it('should select Ollama when configured', async () => {
    process.env.AI_PROVIDER = 'ollama';
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }), AiModule]
    }).compile();

    expect(moduleRef.get(ASSESSMENT_PROVIDER)).toBeInstanceOf(OllamaAssessmentProvider);
    await moduleRef.close();
  });

  it('should reject unsupported providers', async () => {
    process.env.AI_PROVIDER = 'unknown';
    await expect(
      Test.createTestingModule({
        imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }), AiModule]
      }).compile()
    ).rejects.toThrow('Unsupported AI_PROVIDER "unknown".');
  });
});
