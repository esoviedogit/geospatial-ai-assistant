import { Inject, Injectable } from '@nestjs/common';
import { ASSESSMENT_PROVIDER } from './assessment-provider.token';
import type { AssessmentProvider } from './assessment-provider';
import { AssessmentRequestDto } from './dto/assessment-request.dto';
import type { AssessmentResponseDto } from './dto/assessment-response.dto';

@Injectable()
export class AiService {
  constructor(
    @Inject(ASSESSMENT_PROVIDER)
    private readonly assessmentProvider: AssessmentProvider
  ) {}

  createAssessment(request: AssessmentRequestDto): Promise<AssessmentResponseDto> {
    return this.assessmentProvider.generateAssessment(request);
  }
}
