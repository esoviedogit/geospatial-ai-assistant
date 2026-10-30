import { IsInt, Max, Min } from 'class-validator';

export class AnalysisResultDto {
  @IsInt()
  @Min(0)
  @Max(10_000_000)
  totalFeatures!: number;

  @IsInt()
  @Min(0)
  @Max(10_000_000)
  points!: number;

  @IsInt()
  @Min(0)
  @Max(10_000_000)
  lines!: number;

  @IsInt()
  @Min(0)
  @Max(10_000_000)
  polygons!: number;
}
