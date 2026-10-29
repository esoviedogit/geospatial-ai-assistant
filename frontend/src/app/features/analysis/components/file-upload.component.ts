import { Component, output } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  template: `
    <label for="kml-file">Select a KML file</label>
    <input
      id="kml-file"
      type="file"
      accept=".kml,application/vnd.google-earth.kml+xml"
      (change)="onFileChange($event)"
    />
  `
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
