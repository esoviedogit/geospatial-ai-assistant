import { TestBed } from '@angular/core/testing';
import Feature from 'ol/Feature.js';
import GeometryCollection from 'ol/geom/GeometryCollection.js';
import LineString from 'ol/geom/LineString.js';
import Point from 'ol/geom/Point.js';
import Polygon from 'ol/geom/Polygon.js';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationService);
  });

  it('should count features without names', () => {
    const features = [
      new Feature({ name: 'Named feature', geometry: new Point([1, 2]) }),
      new Feature({ geometry: new Point([3, 4]) }),
      new Feature({ name: '   ', geometry: new Point([5, 6]) })
    ];

    expect(service.validate(features)).toEqual({
      featuresAnalyzed: 3,
      result: {
        unnamedFeatures: 2,
        missingGeometries: 0,
        emptyGeometries: 0,
        invalidCoordinates: 0,
        duplicatedFeatures: 0,
        warnings: ['Unnamed features: 2']
      }
    });
  });

  it('should count features without geometries', () => {
    const features = [
      new Feature({ name: 'No geometry' }),
      new Feature({ name: 'With geometry', geometry: new Point([1, 2]) })
    ];

    expect(service.validate(features).result).toEqual({
      unnamedFeatures: 0,
      missingGeometries: 1,
      emptyGeometries: 0,
      invalidCoordinates: 0,
      duplicatedFeatures: 0,
      warnings: ['Missing geometries: 1']
    });
  });

  it('should count invalid coordinates outside longitude and latitude bounds', () => {
    const features = [
      new Feature({ name: 'Invalid longitude', geometry: new Point([181, 45]) }),
      new Feature({ name: 'Invalid latitude', geometry: new Point([-120, -91]) }),
      new Feature({ name: 'Valid boundary', geometry: new Point([180, 90]) })
    ];

    expect(service.validate(features).result).toEqual({
      unnamedFeatures: 0,
      missingGeometries: 0,
      emptyGeometries: 0,
      invalidCoordinates: 2,
      duplicatedFeatures: 0,
      warnings: ['Invalid coordinates: 2']
    });
  });

  it('should count duplicated geometries after their first occurrence', () => {
    const features = [
      new Feature({ name: 'First', geometry: new Point([10, 20]) }),
      new Feature({ name: 'Duplicate', geometry: new Point([10, 20]) }),
      new Feature({ name: 'Different', geometry: new Point([11, 20]) })
    ];

    expect(service.validate(features).result).toEqual({
      unnamedFeatures: 0,
      missingGeometries: 0,
      emptyGeometries: 0,
      invalidCoordinates: 0,
      duplicatedFeatures: 1,
      warnings: ['Duplicated features: 1']
    });
  });

  it('should count empty geometries, including empty geometry collections', () => {
    const features = [
      new Feature({ name: 'Empty line', geometry: new LineString([]) }),
      new Feature({ name: 'Empty polygon', geometry: new Polygon([]) }),
      new Feature({ name: 'Empty collection', geometry: new GeometryCollection([]) })
    ];

    expect(service.validate(features).result).toEqual({
      unnamedFeatures: 0,
      missingGeometries: 0,
      emptyGeometries: 3,
      invalidCoordinates: 0,
      duplicatedFeatures: 0,
      warnings: ['Empty geometries: 3']
    });
  });
});
