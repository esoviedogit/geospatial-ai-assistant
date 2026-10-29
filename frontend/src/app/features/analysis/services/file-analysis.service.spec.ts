import { TestBed } from '@angular/core/testing';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { FileAnalysisService } from './file-analysis.service';
import { GeoJsonAnalysisService } from './geojson-analysis.service';
import { KmlAnalysisService } from './kml-analysis.service';
import { ValidationService } from './validation.service';

describe('FileAnalysisService', () => {
  let service: FileAnalysisService;
  let kmlAnalysisService: jasmine.SpyObj<KmlAnalysisService>;
  let geoJsonAnalysisService: jasmine.SpyObj<GeoJsonAnalysisService>;
  let validationService: jasmine.SpyObj<ValidationService>;

  const features = [new Feature({ name: 'Point', geometry: new Point([1, 2]) })];

  const createFile = (name: string): File => new File([''], name);

  beforeEach(() => {
    kmlAnalysisService = jasmine.createSpyObj<KmlAnalysisService>('KmlAnalysisService', [
      'readFeatures'
    ]);
    geoJsonAnalysisService = jasmine.createSpyObj<GeoJsonAnalysisService>('GeoJsonAnalysisService', [
      'readFeatures'
    ]);
    validationService = jasmine.createSpyObj<ValidationService>('ValidationService', ['validate']);
    kmlAnalysisService.readFeatures.and.resolveTo(features);
    geoJsonAnalysisService.readFeatures.and.resolveTo(features);
    validationService.validate.and.returnValue({
      featuresAnalyzed: features.length,
      result: {
        unnamedFeatures: 0,
        missingGeometries: 0,
        emptyGeometries: 0,
        invalidCoordinates: 0,
        duplicatedFeatures: 0,
        warnings: []
      }
    });

    TestBed.configureTestingModule({
      providers: [
        FileAnalysisService,
        { provide: KmlAnalysisService, useValue: kmlAnalysisService },
        { provide: GeoJsonAnalysisService, useValue: geoJsonAnalysisService },
        { provide: ValidationService, useValue: validationService }
      ]
    });
    service = TestBed.inject(FileAnalysisService);
  });

  it('should delegate KML files to KmlAnalysisService', async () => {
    const file = createFile('map.kml');

    await expectAsync(service.analyze(file)).toBeResolvedTo({
      totalFeatures: 1,
      points: 1,
      lines: 0,
      polygons: 0
    });
    expect(kmlAnalysisService.readFeatures).toHaveBeenCalledOnceWith(file);
    expect(geoJsonAnalysisService.readFeatures).not.toHaveBeenCalled();
  });

  it('should delegate GeoJSON files to GeoJsonAnalysisService', async () => {
    const file = createFile('map.geojson');

    await expectAsync(service.analyze(file)).toBeResolvedTo({
      totalFeatures: 1,
      points: 1,
      lines: 0,
      polygons: 0
    });
    expect(geoJsonAnalysisService.readFeatures).toHaveBeenCalledOnceWith(file);
    expect(kmlAnalysisService.readFeatures).not.toHaveBeenCalled();
  });

  it('should delegate JSON files to GeoJsonAnalysisService regardless of extension case', async () => {
    const file = createFile('map.JSON');

    await expectAsync(service.analyze(file)).toBeResolvedTo({
      totalFeatures: 1,
      points: 1,
      lines: 0,
      polygons: 0
    });
    expect(geoJsonAnalysisService.readFeatures).toHaveBeenCalledOnceWith(file);
    expect(kmlAnalysisService.readFeatures).not.toHaveBeenCalled();
  });

  it('should analyze and validate the same parsed features', async () => {
    const file = createFile('map.geojson');

    await expectAsync(service.analyzeWithValidation(file)).toBeResolvedTo({
      analysis: {
        totalFeatures: 1,
        points: 1,
        lines: 0,
        polygons: 0
      },
      validation: {
        featuresAnalyzed: 1,
        result: {
          unnamedFeatures: 0,
          missingGeometries: 0,
          emptyGeometries: 0,
          invalidCoordinates: 0,
          duplicatedFeatures: 0,
          warnings: []
        }
      }
    });
    expect(geoJsonAnalysisService.readFeatures).toHaveBeenCalledOnceWith(file);
    expect(validationService.validate).toHaveBeenCalledOnceWith(features);
  });

  it('should reject files with unsupported extensions', () => {
    expect(() => service.analyze(createFile('map.txt'))).toThrowError(
      'Unsupported file type: map.txt'
    );
    expect(kmlAnalysisService.readFeatures).not.toHaveBeenCalled();
    expect(geoJsonAnalysisService.readFeatures).not.toHaveBeenCalled();
  });
});
