export interface AiRecommendation {
  readonly summary: string;
  readonly warnings: readonly string[];
  readonly recommendations: readonly string[];
}
