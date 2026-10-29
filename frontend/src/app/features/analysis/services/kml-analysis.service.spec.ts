import { TestBed } from '@angular/core/testing';
import type { AnalysisResult } from '../models/analysis-result.model';
import { KmlAnalysisService } from './kml-analysis.service';

describe('KmlAnalysisService', () => {
  let service: KmlAnalysisService;

  const analyzeKml = (placemarks: string): Promise<AnalysisResult> => {
    const file = new File(
      [
        `<kml xmlns="http://www.opengis.net/kml/2.2">
          <Document>${placemarks}</Document>
        </kml>`
      ],
      'sample.kml',
      { type: 'application/vnd.google-earth.kml+xml' }
    );

    return service.analyze(file);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KmlAnalysisService);
  });

  it('should count polygons correctly', async () => {
    expect(
      await analyzeKml(`
        <Placemark>
          <Polygon>
            <outerBoundaryIs>
              <LinearRing>
                <coordinates>0,0 0,1 1,1 1,0 0,0</coordinates>
              </LinearRing>
            </outerBoundaryIs>
          </Polygon>
        </Placemark>
        <Placemark>
          <Polygon>
            <outerBoundaryIs>
              <LinearRing>
                <coordinates>2,2 2,3 3,3 3,2 2,2</coordinates>
              </LinearRing>
            </outerBoundaryIs>
          </Polygon>
        </Placemark>
      `)
    ).toEqual({
      totalFeatures: 2,
      points: 0,
      lines: 0,
      polygons: 2
    });
  });

  it('should count points correctly', async () => {
    expect(
      await analyzeKml(`
        <Placemark><Point><coordinates>-122.1,37.4</coordinates></Point></Placemark>
        <Placemark><Point><coordinates>-121.9,37.6</coordinates></Point></Placemark>
        <Placemark><Point><coordinates>-121.7,37.8</coordinates></Point></Placemark>
      `)
    ).toEqual({
      totalFeatures: 3,
      points: 3,
      lines: 0,
      polygons: 0
    });
  });

  it('should count line strings correctly', async () => {
    expect(
      await analyzeKml(`
        <Placemark>
          <LineString><coordinates>0,0 1,1 2,2</coordinates></LineString>
        </Placemark>
        <Placemark>
          <LineString><coordinates>3,3 4,4 5,5</coordinates></LineString>
        </Placemark>
      `)
    ).toEqual({
      totalFeatures: 2,
      points: 0,
      lines: 2,
      polygons: 0
    });
  });

  it('should count mixed geometries correctly', async () => {
    expect(
      await analyzeKml(`
        <Placemark><Point><coordinates>0,0</coordinates></Point></Placemark>
        <Placemark>
          <LineString><coordinates>0,0 1,1</coordinates></LineString>
        </Placemark>
        <Placemark>
          <Polygon>
            <outerBoundaryIs>
              <LinearRing>
                <coordinates>0,0 0,1 1,1 1,0 0,0</coordinates>
              </LinearRing>
            </outerBoundaryIs>
          </Polygon>
        </Placemark>
        <Placemark><Point><coordinates>2,2</coordinates></Point></Placemark>
      `)
    ).toEqual({
      totalFeatures: 4,
      points: 2,
      lines: 1,
      polygons: 1
    });
  });

  it('should return zero counts for an empty KML document', async () => {
    expect(await analyzeKml('')).toEqual({
      totalFeatures: 0,
      points: 0,
      lines: 0,
      polygons: 0
    });
  });

  it('should ignore features without geometry', async () => {
    expect(
      await analyzeKml(`
        <Placemark><name>Feature without geometry</name></Placemark>
        <Placemark><Point><coordinates>1,2</coordinates></Point></Placemark>
      `)
    ).toEqual({
      totalFeatures: 2,
      points: 1,
      lines: 0,
      polygons: 0
    });
  });
});
