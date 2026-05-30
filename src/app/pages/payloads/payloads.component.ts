import { Component, OnInit } from '@angular/core';
import { Payload } from '../../core/interface/Interface';
import { SpacexApiService } from '../../core/service/spacex-api.service';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';

@Component({
  selector: 'app-payloads',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './payloads.component.html',
  styleUrls: ['./payloads.component.css'],
})
export class PayloadsComponent implements OnInit {
  // payloads: Payload[] = [];
  // loading = false;
  // error = '';

  // constructor(private api: SpacexApiService) {}

  // ngOnInit(): void {
  //   this.loading = true;
  //   this.api.getAllPayloads().subscribe({
  //     next: (data) => {
  //       this.payloads = data;
  //       this.loading = false;
  //     },
  //     error: (_) => {
  //       this.error = 'Failed to load payloads.';
  //       this.loading = false;
  //     },
  //   });
  // }

  payloads: Payload[] = [];
  loading = false;
  error = '';

  columnDefs: ColDef<Payload>[] = [
    // { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Type', field: 'type', sortable: true, filter: true },
    { headerName: 'Orbit', field: 'orbit', sortable: true, filter: true },
    {
      headerName: 'Mass_kg',
      field: 'mass_kg',
      sortable: true,
      filter: true,
    },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  // Pagination
  pageSize = 10;
  currentPage = 1;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.payloads.length / this.pageSize));
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedPayloads(): Payload[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.payloads.slice(start, start + this.pageSize);
  }

  get showStart(): number {
    return this.payloads.length ? (this.currentPage - 1) * this.pageSize + 1 : 0;
  }

  get showEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.payloads.length);
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
    this.api.getAllPayloads().subscribe({
      next: (data) => {
        this.payloads = data;
        this.loading = false;
      },
      error: (_) => {
        this.error = 'Failed to load payloads.';
        this.loading = false;
      },
    });
  }
}
