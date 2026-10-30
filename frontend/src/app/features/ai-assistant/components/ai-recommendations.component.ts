import { Component, Input } from '@angular/core';
import type { AiRecommendation } from '../models/ai-recommendation.model';

@Component({
  selector: 'app-ai-recommendations',
  standalone: true,
  templateUrl: './ai-recommendations.component.html',
  styleUrl: './ai-recommendations.component.scss'
})
export class AiRecommendationsComponent {
  @Input({ required: true }) assessment!: AiRecommendation;
}
