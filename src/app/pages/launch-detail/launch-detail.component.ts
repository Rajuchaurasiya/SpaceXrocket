import { Component } from '@angular/core';
import { Launch, Payload, Rocket } from '../../core/interface/Interface';
import { ActivatedRoute, Router } from '@angular/router';
import { SpacexApiService } from '../../core/service/spacex-api.service';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-launch-detail',
  imports: [CommonModule],
  templateUrl: './launch-detail.component.html',
  styleUrl: './launch-detail.component.css',
})
export class LaunchDetailComponent {
  launch!: Launch;
  rocket?: Rocket;
  payloads: Payload[] = [];
  loading = true;
  error = '';
  constructor(
    private route: ActivatedRoute,
    private api: SpacexApiService,
    private router: Router
  ) {}
  ngOnInit() {
    this.load();
  }
  // load() {
  //   this.loading = true;
  //   this.error = '';
  //   const id = this.route.snapshot.paramMap.get('id')!;
  //   this.api.getById(id).subscribe({
  //     next: (l) => {
  //       this.launch = l;
  //       forkJoin([
  //         this.api.getRocket(l.rocket),
  //         forkJoin(l.payloads.map((pid) => this.api.getPayload(pid))),
  //       ]).subscribe({
  //         next: ([r, ps]) => {
  //           this.rocket = r;
  //           this.payloads = ps;
  //           this.loading = false;
  //         },
  //         error: (err) => {
  //           this.error = err.message;
  //           this.loading = false;
  //         },
  //       });
  //     },
  //     error: (err) => {
  //       this.error = err.message;
  //       this.loading = false;
  //     },
  //   });
  // }
  load() {
    this.loading = true;
    this.error = '';

    const id = this.route.snapshot.paramMap.get('id')!;

    this.api.getById(id).subscribe({
      next: (l) => {
        this.launch = l;

        forkJoin([
          this.api.getRocket(l.rocket),
          forkJoin(l.payloads.map((pid: string) => this.api.getPayload(pid))),
        ]).subscribe({
          next: ([r, ps]) => {
            this.payloads = ps;

            console.log('Rocket API Response:', r);

            let images: string[] = [];

            // Direct from rocket object
            if (r?.flickr_images?.length) {
              images = r.flickr_images;
            }

            // Assign rocket object
            this.rocket = {
              id: r.id || '',
              name: r.name || 'Unknown Rocket',
              type: r.type || '',
              stages: r.stages || 0,
              description: r.description || '',
              flickr_images: images,
            };
            this.loading = false;
          },
          error: (err) => {
            this.error = err.message;
            this.loading = false;
          },
        });
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }
  back() {
    this.router.navigate(['/']);
  }
}
