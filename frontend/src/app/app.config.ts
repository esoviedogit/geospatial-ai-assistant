import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { RECOMMENDATION_PROVIDER } from './core/ai/recommendation-provider.token';
import { OpenAiRecommendationProvider } from './core/ai/openai-recommendation.provider';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    { provide: RECOMMENDATION_PROVIDER, useClass: OpenAiRecommendationProvider }
  ]
};
