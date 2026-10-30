import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { AnalysisResultDto } from './analysis-result.dto';
import { ValidationResultDto } from './validation-result.dto';

export class AssessmentRequestDto {
  @IsObject()
  @ValidateNested()
  @Type(() => AnalysisResultDto)
  analysis!: AnalysisResultDto;

  @IsObject()
  @ValidateNested()
  @Type(() => ValidationResultDto)
  validation!: ValidationResultDto;
}
