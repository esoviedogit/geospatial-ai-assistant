import { TestBed } from '@angular/core/testing';
import type { AnalysisResult } from '../models/analysis-result.model';
import { FileAnalysisService } from './file-analysis.service';
import { GeoJsonAnalysisService } from './geojson-analysis.service';
import { KmlAnalysisService } from './kml-analysis.service';

describe('FileAnalysisService', () => {
  let service: FileAnalysisService;
  let kmlAnalysisService: jasmine.SpyObj<KmlAnalysisService>;
  let geoJsonAnalysisService: jasmine.SpyObj<GeoJsonAnalysisService>;

  const result: AnalysisResult = {
    totalFeatures: 1,
    points: 1,
    lines: 0,
    polygons: 0
  };

  const createFile = (name: string): File => new File([''], name);

  beforeEach(() => {
    kmlAnalysisService = jasmine.createSpyObj<KmlAnalysisService>('KmlAnalysisService', ['analyze']);
    geoJsonAnalysisService = jasmine.createSpyObj<GeoJsonAnalysisService>('GeoJsonAnalysisService', [
      'analyze'
    ]);
    kmlAnalysisService.analyze.and.resolveTo(result);
    geoJsonAnalysisService.analyze.and.resolveTo(result);

    TestBed.configureTestingModule({
      providers: [
        FileAnalysisService,
        { provide: KmlAnalysisService, useValue: kmlAnalysisService },
        { provide: GeoJsonAnalysisService, useValue: geoJsonAnalysisService }
      ]
    });
    service = TestBed.inject(FileAnalysisService);
  });

  it('should delegate KML files to KmlAnalysisService', async () => {
    const file = createFile('map.kml');

    await expectAsync(service.analyze(file)).toBeResolvedTo(result);
    expect(kmlAnalysisService.analyze).toHaveBeenCalledOnceWith(file);
    expect(geoJsonAnalysisService.analyze).not.toHaveBeenCalled();
  });

  it('should delegate GeoJSON files to GeoJsonAnalysisService', async () => {
    const file = createFile('map.geojson');

    await expectAsync(service.analyze(file)).toBeResolvedTo(result);
    expect(geoJsonAnalysisService.analyze).toHaveBeenCalledOnceWith(file);
    expect(kmlAnalysisService.analyze).not.toHaveBeenCalled();
  });

  it('should delegate JSON files to GeoJsonAnalysisService regardless of extension case', async () => {
    const file = createFile('map.JSON');

    await expectAsync(service.analyze(file)).toBeResolvedTo(result);
    expect(geoJsonAnalysisService.analyze).toHaveBeenCalledOnceWith(file);
    expect(kmlAnalysisService.analyze).not.toHaveBeenCalled();
  });

  it('should reject files with unsupported extensions', () => {
    expect(() => service.analyze(createFile('map.txt'))).toThrowError(
      'Unsupported file type: map.txt'
    );
    expect(kmlAnalysisService.analyze).not.toHaveBeenCalled();
    expect(geoJsonAnalysisService.analyze).not.toHaveBeenCalled();
  });
});
