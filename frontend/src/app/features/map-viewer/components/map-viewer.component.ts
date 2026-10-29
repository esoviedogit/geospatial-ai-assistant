import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import Feature from 'ol/Feature.js';
import { isEmpty } from 'ol/extent.js';
import type Geometry from 'ol/geom/Geometry.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import { OSM } from 'ol/source.js';
import VectorSource from 'ol/source/Vector.js';
import CircleStyle from 'ol/style/Circle.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import Style from 'ol/style/Style.js';
import TileLayer from 'ol/layer/Tile.js';
import VectorLayer from 'ol/layer/Vector.js';

@Component({
  selector: 'app-map-viewer',
  standalone: true,
  template: '<div #mapTarget class="map-target" role="region" aria-label="Uploaded geospatial features map"></div>',
  styleUrl: './map-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapTarget', { static: true }) private mapTarget!: ElementRef<HTMLDivElement>;

  private map?: Map;
  private vectorSource?: VectorSource<Feature<Geometry>>;
  private currentFeatures: Feature<Geometry>[] = [];

  @Input()
  set features(features: Feature<Geometry>[]) {
    this.currentFeatures = features;
    this.updateFeatures();
  }

  ngAfterViewInit(): void {
    this.vectorSource = new VectorSource<Feature<Geometry>>();
    const vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: new Style({
        fill: new Fill({ color: 'rgba(53, 105, 212, 0.18)' }),
        stroke: new Stroke({ color: '#3569d4', width: 2 }),
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: '#3569d4' }),
          stroke: new Stroke({ color: '#ffffff', width: 2 })
        })
      })
    });

    this.map = new Map({
      target: this.mapTarget.nativeElement,
      layers: [new TileLayer({ source: new OSM() }), vectorLayer],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });

    this.updateFeatures();
  }

  ngOnDestroy(): void {
    this.map?.setTarget(undefined);
    this.map = undefined;
    this.vectorSource = undefined;
  }

  private updateFeatures(): void {
    if (!this.vectorSource || !this.map) {
      return;
    }

    this.vectorSource.clear();
    this.vectorSource.addFeatures(this.currentFeatures);

    const extent = this.vectorSource.getExtent();
    const size = this.map.getSize();
    if (extent && !isEmpty(extent) && size) {
      this.map.getView().fit(extent, {
        size,
        padding: [40, 40, 40, 40],
        maxZoom: 16,
        duration: 250
      });
    }
  }
}
