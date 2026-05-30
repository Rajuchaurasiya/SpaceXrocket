import { Component, OnInit } from '@angular/core';
import { Rocket } from '../../core/interface/Interface';
import { SpacexApiService } from '../../core/service/spacex-api.service';
import { CommonModule } from '@angular/common';
import { ColDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';

@Component({
  selector: 'app-rockets',
  imports: [CommonModule, AgGridModule],
  templateUrl: './rockets.component.html',
  styleUrl: './rockets.component.css',
})
export class RocketsComponent implements OnInit {
  //   rockets: Rocket[] = [];
  //   loading = false;
  //   error = '';

  //   constructor(private api: SpacexApiService) {}

  //   ngOnInit(): void {
  //     this.loading = true;
  //     this.api.getAllRockets().subscribe({
  //       next: (data) => {
  //         this.rockets = data;
  //         this.loading = false;
  //       },
  //       error: (_) => {
  //         this.error = 'Failed to load rockets.';
  //         this.loading = false;
  //       },
  //     });
  //   }
  // }

  rockets: Rocket[] = [];
  loading = false;
  error = '';
  columnDefs: ColDef<Rocket>[] = [
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Type', field: 'type', sortable: true, filter: true },
    { headerName: 'Stages', field: 'stages', sortable: true, filter: true },
    {
      headerName: 'Description',
      field: 'description',
      flex: 2,
      wrapText: true,
      autoHeight: true,
      valueFormatter: (params) => {
        const desc = params.value || '';
        return desc.length > 150 ? desc.slice(0, 150) + '...' : desc;
      },
    },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
    resizable: true,
  };

  // Pagination
  pageSize = 10;
  currentPage = 1;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.rockets.length / this.pageSize));
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedRockets(): Rocket[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.rockets.slice(start, start + this.pageSize);
  }

  get showStart(): number {
    return this.rockets.length ? (this.currentPage - 1) * this.pageSize + 1 : 0;
  }

  get showEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.rockets.length);
  }

  setPage(page: number) {
    if (!page || page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    this.currentPage = page;
  }

  prevPage() {
    this.setPage(this.currentPage - 1);
  }

  nextPage() {
    this.setPage(this.currentPage + 1);
  }

  constructor(private api: SpacexApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getAllRockets().subscribe({
      next: (data) => {
        this.rockets = data;
        this.loading = false;
      },
      error: (_) => {
        this.error = 'Failed to load rockets.';
        this.loading = false;
      },
    });
  }
}
