import { TestBed } from '@angular/core/testing';
import type { AnalysisResult } from '../models/analysis-result.model';
import { GeoJsonAnalysisService } from './geojson-analysis.service';

describe('GeoJsonAnalysisService', () => {
  let service: GeoJsonAnalysisService;

  const createGeoJsonFile = (features: string): File =>
    new File(
      [`{"type":"FeatureCollection","features":[${features}]}`],
      'sample.geojson',
      { type: 'application/geo+json' }
    );

  const analyzeFeatures = (features: string): Promise<AnalysisResult> =>
    service.analyze(createGeoJsonFile(features));

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoJsonAnalysisService);
  });

  it('should count point features', async () => {
    expect(
      await analyzeFeatures(`
        {"type":"Feature","geometry":{"type":"Point","coordinates":[-122.1,37.4]},"properties":{}}
      `)
    ).toEqual({
      totalFeatures: 1,
      points: 1,
      lines: 0,
      polygons: 0
    });
  });

  it('should count line string features', async () => {
    expect(
      await analyzeFeatures(`
        {"type":"Feature","geometry":{"type":"LineString","coordinates":[[0,0],[1,1],[2,2]]},"properties":{}}
      `)
    ).toEqual({
      totalFeatures: 1,
      points: 0,
      lines: 1,
      polygons: 0
    });
  });

  it('should count polygon features', async () => {
    expect(
      await analyzeFeatures(`
        {"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[0,0],[0,1],[1,1],[1,0],[0,0]]]},"properties":{}}
      `)
    ).toEqual({
      totalFeatures: 1,
      points: 0,
      lines: 0,
      polygons: 1
    });
  });

  it('should count mixed geometry features', async () => {
    expect(
      await analyzeFeatures(`
        {"type":"Feature","geometry":{"type":"Point","coordinates":[0,0]},"properties":{}},
        {"type":"Feature","geometry":{"type":"LineString","coordinates":[[0,0],[1,1]]},"properties":{}},
        {"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[0,0],[0,1],[1,1],[1,0],[0,0]]]},"properties":{}},
        {"type":"Feature","geometry":{"type":"MultiPoint","coordinates":[[2,2],[3,3]]},"properties":{}},
        {"type":"Feature","geometry":{"type":"MultiLineString","coordinates":[[[0,0],[1,1]],[[2,2],[3,3]]]},"properties":{}},
        {"type":"Feature","geometry":{"type":"MultiPolygon","coordinates":[[[[4,4],[4,5],[5,5],[5,4],[4,4]]]]},"properties":{}}
      `)
    ).toEqual({
      totalFeatures: 6,
      points: 2,
      lines: 2,
      polygons: 2
    });
  });

  it('should return zero counts for an empty feature collection', async () => {
    expect(await analyzeFeatures('')).toEqual({
      totalFeatures: 0,
      points: 0,
      lines: 0,
      polygons: 0
    });
  });

  it('should count geometries in a geometry collection', async () => {
    expect(
      await analyzeFeatures(`
        {"type":"Feature","geometry":{"type":"GeometryCollection","geometries":[
          {"type":"Point","coordinates":[0,0]},
          {"type":"LineString","coordinates":[[0,0],[1,1]]},
          {"type":"Polygon","coordinates":[[[0,0],[0,1],[1,1],[1,0],[0,0]]]}
        ]},"properties":{}}
      `)
    ).toEqual({
      totalFeatures: 1,
      points: 1,
      lines: 1,
      polygons: 1
    });
  });
});
