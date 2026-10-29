import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'analysis',
    pathMatch: 'full'
  },
  {
    path: 'analysis',
    loadComponent: () =>
      import('./features/analysis/pages/analysis-page.component').then(
        c => c.AnalysisPageComponent
      )
  },
  {
    path: 'map-viewer',
    loadComponent: () =>
      import('./features/map-viewer/pages/map-viewer-page.component').then(
        c => c.MapViewerPageComponent
      )
  },
  {
    path: '**',
    redirectTo: 'analysis'
  }
];