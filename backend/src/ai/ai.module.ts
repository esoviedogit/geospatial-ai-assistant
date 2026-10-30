import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ASSESSMENT_PROVIDER } from './assessment-provider.token';
import { OpenAiAssessmentProvider } from './providers/openai-assessment.provider';
import { OllamaAssessmentProvider } from './providers/ollama-assessment.provider';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    OpenAiAssessmentProvider,
    OllamaAssessmentProvider,
    {
      provide: ASSESSMENT_PROVIDER,
      inject: [ConfigService, OpenAiAssessmentProvider, OllamaAssessmentProvider],
      useFactory: (
        configService: ConfigService,
        openAiProvider: OpenAiAssessmentProvider,
        ollamaProvider: OllamaAssessmentProvider
      ) => {
        const provider = configService.get<string>('AI_PROVIDER') ?? 'openai';
        if (provider === 'openai') {
          return openAiProvider;
        }
        if (provider === 'ollama') {
          return ollamaProvider;
        }

        throw new Error(`Unsupported AI_PROVIDER "${provider}". Use "openai" or "ollama".`);
      }
    }
  ]
})
export class AiModule {}
