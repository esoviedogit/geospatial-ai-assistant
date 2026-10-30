import { Injectable } from '@nestjs/common';
import { AssessmentRequestDto } from './dto/assessment-request.dto';
import type { AssessmentResponseDto } from './dto/assessment-response.dto';
import { OpenAiAssessmentProvider } from './providers/openai-assessment.provider';

@Injectable()
export class AiService {
  constructor(private readonly openAiProvider: OpenAiAssessmentProvider) {}

  createAssessment(request: AssessmentRequestDto): Promise<AssessmentResponseDto> {
    return this.openAiProvider.generateAssessment(request);
  }
}
