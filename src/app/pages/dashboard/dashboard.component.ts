import { Component } from '@angular/core';
import { Launch, Rocket } from '../../core/interface/Interface';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { SpacexApiService } from '../../core/service/spacex-api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  CellClickedEvent,
  GridReadyEvent,
  SideBarDef,
} from 'ag-grid-community';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AgGridModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  gridApi!: GridApi;
  launches: Launch[] = [];
  rockets = new Map<string, Rocket>();
  filteredLaunches: Launch[] = [];
  displayed: Launch[] = [];
  hiddenColumns: string[] = [];
  yearlyLaunches: { year: number; count: number }[] = [];
  rocketUsage: { name: string; count: number }[] = [];

  view: 'past' | 'upcoming' = 'past';
  sortKey: 'date' | 'name' = 'date';
  sortAsc = true;
  pageSize = 12;
  currentPage = 1;

  filterForm = new FormGroup({
    year: new FormControl(''),
    status: new FormControl('all'),
  });

  columnDefs: ColDef[] = [
    {
      headerName: 'Name',
      field: 'name',
      sortable: true,
      filter: true,
      cellClass: 'text-center',
    },
    {
      headerName: 'Date',
      field: 'date_utc',
      sortable: true,
      filter: true,
      cellClass: 'text-center',
      valueFormatter: (p) =>
        p.value
          ? new Date(p.value).toLocaleDateString('en-IN', { dateStyle: 'long' })
          : '',
    },
    {
      headerName: 'Rocket',
      field: 'rocket',
      sortable: true,
      filter: true,
      cellClass: 'text-center',
      valueGetter: (p) => this.rockets.get(p.data.rocket)?.name || '',
    },
    {
      headerName: 'Status',
      field: 'success',
      cellClass: 'text-center',
      cellRenderer: (p: any) => {
        if (p.data.upcoming) return `<span style="color: gray">Upcoming</span>`;
        if (p.value === true)
          return `<span style="color: green">Success</span>`;
        if (p.value === false) return `<span style="color: red">Failure</span>`;
        return `<span style="color: orange">Unknown</span>`;
      },
    },
    {
      headerName: 'Action',
      field: 'id',
      cellClass: 'text-center',
      cellRenderer: (p: any) =>
        `<a href="/launch/${p.data.id}" class="btn btn-sm btn-primary rounded-pill">View Details</a>`,
    },
  ];

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    flex: 1,
  };

  constructor(private api: SpacexApiService) {}

  ngOnInit(): void {
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
    this.loadLaunches();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  toggleColumn(field: string, event: Event) {
    const input = event.target as HTMLInputElement; // cast target to input element
    const show = input.checked;

    this.gridApi.setColumnsVisible([field], show);

    if (!show) {
      this.hiddenColumns.push(field);
    } else {
      this.hiddenColumns = this.hiddenColumns.filter((f) => f !== field);
    }
  }

  showAllColumns() {
    const allFields = this.columnDefs.map((col) => col.field!).filter((f) => f); // get all field names
    this.gridApi.setColumnsVisible(allFields, true); // set all columns visible
    this.hiddenColumns = [];
  }

  toggleView(v: 'past' | 'upcoming') {
    this.view = v;
    this.currentPage = 1;
    this.filterForm.patchValue({ year: '', status: 'all' }, { emitEvent: false });
    this.loadLaunches();
  }

  loadLaunches() {
    this.loading = true;
    this.error = '';
    const loader = this.view === 'past' ? this.api.getPast(200, 0) : this.api.getUpcoming();

    loader.subscribe({
      next: (data) => {
        this.launches = data;
        this.filteredLaunches = [...data];
        this.currentPage = 1;
        this.loadRockets();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Unable to load launches';
      },
    });
  }

  loadRockets() {
    const ids = [...new Set(this.launches.map((l) => l.rocket))].filter(
      (id) => !this.rockets.has(id)
    );

    if (ids.length) {
      forkJoin(ids.map((id) => this.api.getRocket(id))).subscribe({
        next: (rockets) => {
          rockets.forEach((r) => this.rockets.set(r.id, r));
          this.applyFilters();
        },
      });
    }
  }

  applyFilters() {
    const { year, status } = this.filterForm.value;
    let filtered = [...this.launches];

    if (year) {
      filtered = filtered.filter(
        (l) => new Date(l.date_utc).getFullYear().toString() === year
      );
    }

    if (status !== 'all' && this.view === 'past') {
      filtered = filtered.filter((l) => {
        if (status === 'success') return l.success === true;
        if (status === 'failure') return l.success === false;
        return true;
      });
    }

    filtered.sort((a, b) => {
      const key = this.sortKey === 'date' ? 'date_utc' : 'name';
      const aVal = (a[key] as string) || '';
      const bVal = (b[key] as string) || '';
      return this.sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    this.filteredLaunches = filtered;
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayed = filtered.slice(start, end);
    this.updateCharts();
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredLaunches.length / this.pageSize));
  }

  get pageStart(): number {
    return this.filteredLaunches.length ? (this.currentPage - 1) * this.pageSize + 1 : 0;
  }

  get pageEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredLaunches.length);
  }

  get pastLaunchCount(): number {
    return this.launches.filter((l) => !l.upcoming).length;
  }

  get upcomingLaunchCount(): number {
    return this.launches.filter((l) => l.upcoming).length;
  }

  get successRate(): number {
    if (!this.launches.length) return 0;
    const executed = this.launches.filter((l) => l.success !== null);
    if (!executed.length) return 0;
    const success = executed.filter((l) => l.success).length;
    return Math.round((success / executed.length) * 100);
  }

  get topRockets(): { name: string; count: number }[] {
    return this.rocketUsage.slice(0, 5);
  }

  updateCharts() {
    const yearCounts = new Map<number, number>();
    const rocketCounts = new Map<string, number>();

    this.filteredLaunches.forEach((launch) => {
      const year = new Date(launch.date_utc).getFullYear();
      yearCounts.set(year, (yearCounts.get(year) || 0) + 1);
      const rocketName = this.rockets.get(launch.rocket)?.name || 'Unknown';
      rocketCounts.set(rocketName, (rocketCounts.get(rocketName) || 0) + 1);
    });

    this.yearlyLaunches = Array.from(yearCounts.entries())
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year - b.year);

    this.rocketUsage = Array.from(rocketCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  get yearMaxCount(): number {
    return this.yearlyLaunches.reduce((max, item) => Math.max(max, item.count), 1);
  }

  get rocketMaxCount(): number {
    return this.rocketUsage.reduce((max, item) => Math.max(max, item.count), 1);
  }

  loading: boolean = false;
  error: string = '';
  changeSort(key: 'date' | 'name') {
    if (this.sortKey === key) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortKey = key;
      this.sortAsc = true;
    }
    this.applyFilters();
  }
  retry() {
    this.loadLaunches();
  }
  goPage(n: number) {
    if (n < 1 || n > this.totalPages) return;
    this.currentPage = n;
    this.applyFilters();
  }
}
