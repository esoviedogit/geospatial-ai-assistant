export interface ValidationResult {
  readonly unnamedFeatures: number;
  readonly missingGeometries: number;
  readonly emptyGeometries: number;
  readonly invalidCoordinates: number;
  readonly duplicatedFeatures: number;
  readonly warnings: readonly string[];
}
