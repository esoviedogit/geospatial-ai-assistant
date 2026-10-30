import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { AssessmentRequestDto } from './dto/assessment-request.dto';
import type { AssessmentResponseDto } from './dto/assessment-response.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('assessment')
  createAssessment(@Body() request: AssessmentRequestDto): Promise<AssessmentResponseDto> {
    return this.aiService.createAssessment(request);
  }
}
