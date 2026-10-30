import { InjectionToken } from '@angular/core';
import type { RecommendationProvider } from './recommendation-provider';

export const RECOMMENDATION_PROVIDER = new InjectionToken<RecommendationProvider>(
  'RECOMMENDATION_PROVIDER'
);
