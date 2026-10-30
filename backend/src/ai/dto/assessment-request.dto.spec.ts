import { plainToInstance } from 'class-transformer';
import { validate, type ValidationError } from 'class-validator';
import { AssessmentRequestDto } from './assessment-request.dto';

describe('AssessmentRequestDto', () => {
  const getConstraintTypes = (errors: ValidationError[]): string[] =>
    errors.flatMap((error) => [
      ...Object.keys(error.constraints ?? {}),
      ...getConstraintTypes(error.children ?? [])
    ]);

  const validRequest = {
    analysis: { totalFeatures: 2, points: 1, lines: 1, polygons: 0 },
    validation: {
      unnamedFeatures: 1,
      missingGeometries: 0,
      emptyGeometries: 0,
      invalidCoordinates: 0,
      duplicatedFeatures: 0,
      warnings: ['Unnamed features: 1']
    }
  };

  it('should accept a valid assessment request', async () => {
    const request = plainToInstance(AssessmentRequestDto, validRequest);

    await expect(validate(request)).resolves.toHaveLength(0);
  });

  it('should reject negative counts and unexpected properties', async () => {
    const request = plainToInstance(AssessmentRequestDto, {
      ...validRequest,
      analysis: { ...validRequest.analysis, points: -1, privateData: 'unexpected' }
    });

    const errors = await validate(request, { whitelist: true, forbidNonWhitelisted: true });

    expect(errors.length).toBeGreaterThan(0);
    expect(getConstraintTypes(errors)).toContain('whitelistValidation');
    expect(getConstraintTypes(errors)).toContain('min');
  });
});
