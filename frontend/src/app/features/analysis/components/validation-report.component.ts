import { Component, Input } from '@angular/core';
import type { ValidationSummary } from '../models/validation-summary.model';

@Component({
  selector: 'app-validation-report',
  standalone: true,
  templateUrl: './validation-report.component.html',
  styleUrl: './validation-report.component.scss'
})
export class ValidationReportComponent {
  @Input({ required: true }) summary!: ValidationSummary;
}
