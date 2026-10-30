import { BadGatewayException } from '@nestjs/common';
import type { AssessmentResponseDto } from './dto/assessment-response.dto';

export function parseAssessmentResponse(content: string): AssessmentResponseDto {
  let response: unknown;
  try {
    response = JSON.parse(content);
  } catch {
    throw new BadGatewayException('AI assessment provider returned invalid JSON.');
  }

  if (
    typeof response !== 'object' ||
    response === null ||
    !('summary' in response) ||
    !('warnings' in response) ||
    !('recommendations' in response)
  ) {
    throw new BadGatewayException('AI assessment provider returned an invalid response shape.');
  }

  const { summary, warnings, recommendations } = response;
  if (
    typeof summary !== 'string' ||
    summary.trim().length === 0 ||
    summary.length > 2000 ||
    !isStringArray(warnings) ||
    !isStringArray(recommendations)
  ) {
    throw new BadGatewayException('AI assessment provider returned invalid assessment fields.');
  }

  return {
    summary: summary.trim(),
    warnings: warnings.map((item) => item.trim()).filter(Boolean).slice(0, 20),
    recommendations: recommendations.map((item) => item.trim()).filter(Boolean).slice(0, 20)
  };
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= 20 &&
    value.every((item) => typeof item === 'string' && item.length <= 1000)
  );
}
