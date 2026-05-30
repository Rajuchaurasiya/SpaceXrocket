import { Component } from '@angular/core';
import { Launchpad } from '../../core/interface/Interface';
import { SpacexApiService } from '../../core/service/spacex-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-launchpads',
  imports: [CommonModule],
  templateUrl: './launchpads.component.html',
  styleUrl: './launchpads.component.css',
})
export class LaunchpadsComponent {
  launchpads: Launchpad[] = [];
  loading = false;
  error = '';

  constructor(private api: SpacexApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getAllLaunchpads().subscribe({
      next: (data) => {
        this.launchpads = data;
        this.loading = false;
      },
      error: (_) => {
        this.error = 'Failed to load launchpads.';
        this.loading = false;
      },
    });
  }
}
