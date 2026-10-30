import { ArrayMaxSize, IsArray, IsInt, IsString, Max, MaxLength, Min } from 'class-validator';

export class ValidationResultDto {
  @IsInt()
  @Min(0)
  @Max(10_000_000)
  unnamedFeatures!: number;

  @IsInt()
  @Min(0)
  @Max(10_000_000)
  missingGeometries!: number;

  @IsInt()
  @Min(0)
  @Max(10_000_000)
  emptyGeometries!: number;

  @IsInt()
  @Min(0)
  @Max(10_000_000)
  invalidCoordinates!: number;

  @IsInt()
  @Min(0)
  @Max(10_000_000)
  duplicatedFeatures!: number;

  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(500, { each: true })
  warnings!: string[];
}
