import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { RECOMMENDATION_PROVIDER } from './core/ai/recommendation-provider.token';
import { RulesRecommendationProvider } from './core/ai/rules-recommendation.provider';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: RECOMMENDATION_PROVIDER, useClass: RulesRecommendationProvider }
  ]
};
