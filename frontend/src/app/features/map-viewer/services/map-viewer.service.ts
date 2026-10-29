import { Injectable } from '@angular/core';
import Feature from 'ol/Feature.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import KML from 'ol/format/KML.js';
import type Geometry from 'ol/geom/Geometry.js';

@Injectable({ providedIn: 'root' })
export class MapViewerService {
  async readFeatures(file: File): Promise<Feature<Geometry>[]> {
    const content = await file.text();
    const projection = { featureProjection: 'EPSG:3857' };
    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'kml':
        return new KML().readFeatures(content, projection);
      case 'geojson':
      case 'json':
        return new GeoJSON().readFeatures(content, projection);
      default:
        throw new Error(`Unsupported map file type: ${file.name}`);
    }
  }
}
