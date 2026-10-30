import { Injectable } from '@angular/core';
import type { AnalysisResult } from '../../features/analysis/models/analysis-result.model';
import type { ValidationResult } from '../../features/analysis/models/validation-result.model';
import type { AiRecommendation } from '../../features/ai-assistant/models/ai-recommendation.model';
import type { RecommendationProvider } from './recommendation-provider';

@Injectable({ providedIn: 'root' })
export class RulesRecommendationProvider implements RecommendationProvider {
  async generateAssessment(
    analysis: AnalysisResult,
    validation: ValidationResult
  ): Promise<AiRecommendation> {
    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (validation.unnamedFeatures > 0) {
      warnings.push(
        validation.unnamedFeatures === 1
          ? '1 feature is missing its name.'
          : `${validation.unnamedFeatures} features are missing their names.`
      );
      recommendations.push('Review features without names.');
    }

    if (validation.missingGeometries > 0) {
      warnings.push(
        validation.missingGeometries === 1
          ? '1 feature is missing its geometry.'
          : `${validation.missingGeometries} features are missing their geometries.`
      );
      recommendations.push('Add geometry to features that need spatial analysis.');
    }

    if (validation.emptyGeometries > 0) {
      warnings.push(
        validation.emptyGeometries === 1
          ? '1 feature has an empty geometry.'
          : `${validation.emptyGeometries} features have empty geometries.`
      );
      recommendations.push('Review empty geometries and add valid coordinates.');
    }

    if (validation.invalidCoordinates > 0) {
      warnings.push(
        validation.invalidCoordinates === 1
          ? '1 feature has invalid coordinates.'
          : `${validation.invalidCoordinates} features have invalid coordinates.`
      );
      recommendations.push('Invalid coordinates were detected and should be corrected.');
    }

    if (validation.duplicatedFeatures > 0) {
      warnings.push(
        validation.duplicatedFeatures === 1
          ? '1 duplicate geometry was detected.'
          : `${validation.duplicatedFeatures} duplicate geometries were detected.`
      );
      recommendations.push('Duplicated geometries may affect visualization and analysis.');
    }

    if (analysis.totalFeatures > 1000) {
      recommendations.push('Large dataset detected. Consider scale-dependent rendering.');
    }

    return {
      summary: this.createSummary(analysis.totalFeatures, warnings.length),
      warnings,
      recommendations
    };
  }

  private createSummary(totalFeatures: number, warningCount: number): string {
    if (warningCount === 0) {
      return `The dataset contains ${totalFeatures} features and no data quality warnings were found.`;
    }

    return `The dataset contains ${totalFeatures} features and has ${warningCount} data quality warning${warningCount === 1 ? '' : 's'}.`;
  }
}
