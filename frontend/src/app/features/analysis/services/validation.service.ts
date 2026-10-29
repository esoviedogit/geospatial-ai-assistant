import { Injectable, inject } from '@angular/core';
import type Feature from 'ol/Feature.js';
import type { ValidationSummary } from '../models/validation-summary.model';
import { ValidationRulesService } from './validation-rules.service';

@Injectable({ providedIn: 'root' })
export class ValidationService {
  private readonly validationRulesService = inject(ValidationRulesService);

  validate(features: Feature[]): ValidationSummary {
    return {
      featuresAnalyzed: features.length,
      result: this.validationRulesService.validate(features)
    };
  }
}
