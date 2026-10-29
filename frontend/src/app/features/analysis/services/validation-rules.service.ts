import { Injectable } from '@angular/core';
import type Feature from 'ol/Feature.js';
import GeometryCollection from 'ol/geom/GeometryCollection.js';
import type Geometry from 'ol/geom/Geometry.js';
import SimpleGeometry from 'ol/geom/SimpleGeometry.js';
import type { ValidationResult } from '../models/validation-result.model';

@Injectable({ providedIn: 'root' })
export class ValidationRulesService {
  validate(features: Feature[]): ValidationResult {
    let unnamedFeatures = 0;
    let missingGeometries = 0;
    let emptyGeometries = 0;
    let invalidCoordinates = 0;
    let duplicatedFeatures = 0;
    const seenGeometries = new Set<string>();

    for (const feature of features) {
      const name = feature.get('name');
      if (typeof name !== 'string' || name.trim().length === 0) {
        unnamedFeatures += 1;
      }

      const geometry = feature.getGeometry();
      if (!geometry) {
        missingGeometries += 1;
        continue;
      }

      if (this.isEmptyGeometry(geometry)) {
        emptyGeometries += 1;
        continue;
      }

      if (this.hasInvalidCoordinates(geometry)) {
        invalidCoordinates += 1;
      }

      const geometryKey = this.getGeometryKey(geometry);
      if (seenGeometries.has(geometryKey)) {
        duplicatedFeatures += 1;
      } else {
        seenGeometries.add(geometryKey);
      }
    }

    const warnings = [
      this.createWarning('Unnamed features', unnamedFeatures),
      this.createWarning('Missing geometries', missingGeometries),
      this.createWarning('Empty geometries', emptyGeometries),
      this.createWarning('Invalid coordinates', invalidCoordinates),
      this.createWarning('Duplicated features', duplicatedFeatures)
    ].filter((warning): warning is string => warning !== null);

    return {
      unnamedFeatures,
      missingGeometries,
      emptyGeometries,
      invalidCoordinates,
      duplicatedFeatures,
      warnings
    };
  }

  private isEmptyGeometry(geometry: Geometry): boolean {
    if (geometry instanceof GeometryCollection) {
      const geometries = geometry.getGeometries();
      return geometries.length === 0 || geometries.every((child) => this.isEmptyGeometry(child));
    }
    return !(geometry instanceof SimpleGeometry) || !this.hasCoordinatePair(geometry.getCoordinates());
  }

  private hasInvalidCoordinates(geometry: Geometry): boolean {
    if (geometry instanceof GeometryCollection) {
      return geometry.getGeometries().some((child) => this.hasInvalidCoordinates(child));
    }
    return geometry instanceof SimpleGeometry && this.containsInvalidCoordinate(geometry.getCoordinates());
  }

  private hasCoordinatePair(coordinates: unknown): boolean {
    if (!Array.isArray(coordinates)) {
      return false;
    }
    if (coordinates.length >= 2 && coordinates.every((value) => typeof value === 'number')) {
      return true;
    }
    return coordinates.some((coordinate) => this.hasCoordinatePair(coordinate));
  }

  private containsInvalidCoordinate(coordinates: unknown): boolean {
    if (!Array.isArray(coordinates)) {
      return false;
    }
    if (coordinates.length >= 2 && coordinates.every((value) => typeof value === 'number')) {
      const [longitude, latitude] = coordinates;
      return (
        !Number.isFinite(longitude) ||
        !Number.isFinite(latitude) ||
        longitude < -180 ||
        longitude > 180 ||
        latitude < -90 ||
        latitude > 90
      );
    }
    return coordinates.some((coordinate) => this.containsInvalidCoordinate(coordinate));
  }

  private getGeometryKey(geometry: Geometry): string {
    if (geometry instanceof GeometryCollection) {
      const children = geometry
        .getGeometries()
        .map((child) => this.getGeometryKey(child))
        .sort();
      return JSON.stringify([geometry.getType(), children]);
    }
    const coordinates = geometry instanceof SimpleGeometry ? geometry.getCoordinates() : [];
    return JSON.stringify([geometry.getType(), coordinates]);
  }

  private createWarning(label: string, count: number): string | null {
    return count > 0 ? `${label}: ${count}` : null;
  }
}
