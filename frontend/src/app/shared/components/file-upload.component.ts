import { Component, output } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  template: `
    <div class="upload-control">
      <input
        id="analysis-file"
        class="upload-control__input"
        type="file"
        accept=".kml,.geojson,.json,application/vnd.google-earth.kml+xml,application/geo+json,application/json"
        aria-label="Choose a KML or GeoJSON file"
        (change)="onFileChange($event)"
      />
      <label class="upload-control__button" for="analysis-file">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 15V4m0 0L8 8m4-4 4 4" />
          <path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
        </svg>
        Choose KML or GeoJSON file
      </label>
      <span class="upload-control__format">KML / GeoJSON</span>
    </div>
  `,
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  readonly fileSelected = output<File>();

  onFileChange(event: Event): void {
    const input = event.target;
    if (input instanceof HTMLInputElement && input.files?.[0]) {
      this.fileSelected.emit(input.files[0]);
      input.value = '';
    }
  }
}
