import { AssessmentRequestDto } from './dto/assessment-request.dto';
import type { AssessmentResponseDto } from './dto/assessment-response.dto';

export interface AssessmentProvider {
  generateAssessment(request: AssessmentRequestDto): Promise<AssessmentResponseDto>;
}
