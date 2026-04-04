import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-all-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="av-page">
      <div class="av-container">

        <div class="av-header">
          <div>
            <h1>All Registered Vehicles</h1>
            <p>{{ vehicles.length }} vehicles registered on MadadQR</p>
          </div>
          <a routerLink="/dashboard" class="btn-back">← Back to Dashboard</a>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading vehicles…</p>
        </div>

        <!-- Error -->
        <div *ngIf="errorMsg && !loading" class="error-card">
          <p>{{ errorMsg }}</p>
        </div>

        <!-- Search -->
        <div *ngIf="!loading && vehicles.length > 0" class="search-bar">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="filterVehicles()"
            placeholder="Search by vehicle number or owner name…"
            class="search-input"
          />
          <span class="search-count">{{ filtered.length }} results</span>
        </div>

        <!-- Table -->
        <div *ngIf="!loading && filtered.length > 0" class="table-wrap">
          <table class="vehicles-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Vehicle Number</th>
                <th>Owner Name</th>
                <th>Mobile</th>
                <th>Registered On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let v of filtered; let i = index">
                <td class="td-idx">{{ i + 1 }}</td>
                <td><span class="plate">{{ v.vehicle_number }}</span></td>
                <td class="td-owner">{{ v.users?.name || '—' }}</td>
                <td class="td-mobile">{{ v.users?.mobile ? '+91 ' + v.users.mobile : '—' }}</td>
                <td class="td-date">{{ v.created_at | date:'dd MMM yyyy' }}</td>
                <td class="td-actions">
                  <a [routerLink]="['/dashboard']" [queryParams]="{userId: v.users?.id}" class="btn-view">Dashboard</a>
                  <a [routerLink]="['/qr']" [queryParams]="{vehicleId: v.id}" class="btn-qr">QR</a>
                  <a [routerLink]="['/edit-profile']" [queryParams]="{vehicleId: v.id}" class="btn-edit">Edit</a>
                  <button (click)="deleteVehicle(v.id)" class="btn-delete">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="!loading && filtered.length === 0 && vehicles.length > 0" class="empty-msg">
          No vehicles match your search.
        </div>

      </div>
    </div>
  `,
  styles: [`
    .av-page { background: #0a0a14; min-height: calc(100vh - 64px); padding: 2.5rem 1.5rem; }
    .av-container { max-width: 1100px; margin: 0 auto; }
    .av-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .av-header h1 { color: #fff; font-size: 1.8rem; font-weight: 800; margin: 0 0 0.25rem; }
    .av-header p { color: #64748b; font-size: 0.9rem; margin: 0; }
    .btn-back {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      color: #94a3b8;
      padding: 0.5rem 1rem;
      border-radius: 10px;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 600;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .btn-back:hover { border-color: rgba(99,102,241,0.4); color: #fff; }
    .loading-state { text-align: center; padding: 4rem; }
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid rgba(99,102,241,0.2);
      border-top-color: #6366f1;
      border-radius: 50%;
      margin: 0 auto 1rem;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading-state p { color: #64748b; }
    .error-card {
      background: rgba(248,113,113,0.08);
      border: 1px solid rgba(248,113,113,0.2);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      color: #f87171;
    }
    .search-bar {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .search-input {
      flex: 1;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      color: #e2e8f0;
      font-size: 0.95rem;
      padding: 0.65rem 1rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .search-input:focus { border-color: rgba(99,102,241,0.5); }
    .search-input::placeholder { color: #334155; }
    .search-count { color: #475569; font-size: 0.82rem; white-space: nowrap; }
    .table-wrap {
      overflow-x: auto;
      border: 1px solid rgba(99,102,241,0.15);
      border-radius: 14px;
    }
    .vehicles-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.88rem;
    }
    .vehicles-table thead tr { background: rgba(99,102,241,0.08); }
    .vehicles-table th {
      color: #6366f1;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      padding: 0.85rem 1rem;
      text-align: left;
      border-bottom: 1px solid rgba(99,102,241,0.15);
      white-space: nowrap;
    }
    .vehicles-table td {
      padding: 0.8rem 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      vertical-align: middle;
    }
    .vehicles-table tbody tr:last-child td { border-bottom: none; }
    .vehicles-table tbody tr:hover { background: rgba(99,102,241,0.04); }
    .td-idx { color: #475569; font-size: 0.8rem; width: 40px; }
    .plate {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 6px;
      padding: 0.2rem 0.6rem;
      font-family: monospace;
      font-size: 0.9rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }
    .td-owner { color: #e2e8f0; font-weight: 600; }
    .td-mobile { color: #94a3b8; font-family: monospace; }
    .td-date { color: #475569; white-space: nowrap; }
    .td-actions { display: flex; gap: 0.4rem; }
    .btn-view {
      background: rgba(99,102,241,0.12);
      border: 1px solid rgba(99,102,241,0.25);
      color: #a78bfa;
      padding: 0.3rem 0.7rem;
      border-radius: 7px;
      text-decoration: none;
      font-size: 0.78rem;
      font-weight: 700;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .btn-view:hover { background: rgba(99,102,241,0.25); }
    .btn-qr {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      padding: 0.3rem 0.7rem;
      border-radius: 7px;
      text-decoration: none;
      font-size: 0.78rem;
      font-weight: 700;
      white-space: nowrap;
    }
    .empty-msg { color: #475569; text-align: center; padding: 3rem; }
    @media (max-width: 640px) {
      .av-header { flex-direction: column; }
      .td-mobile, .td-date { display: none; }
    }
  `]
})
export class AllVehiclesComponent implements OnInit {
  vehicles: any[] = [];
  filtered: any[] = [];
  searchQuery = '';
  loading = true;
  errorMsg = '';

  constructor(private supa: SupabaseService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    try {
      const { data, error } = await this.supa.getAllVehiclesWithOwners();
      if (error) throw new Error(error.message);
      this.vehicles = data || [];
      this.filtered = [...this.vehicles];
    } catch (err: any) {
      this.errorMsg = err.message || 'Failed to load vehicles.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  filterVehicles() {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) {
      this.filtered = [...this.vehicles];
      return;
    }
    this.filtered = this.vehicles.filter(v =>
      v.vehicle_number?.toLowerCase().includes(q) ||
      v.users?.name?.toLowerCase().includes(q) ||
      v.users?.mobile?.includes(q)
    );
  }
  async deleteVehicle(vehicleId: string) {
    if (!confirm('Are you sure you want to delete this vehicle? This cannot be undone.')) return;
    try {
      const { error } = await this.supa.deleteVehicle(vehicleId);
      if (error) throw new Error(error.message);
      this.vehicles = this.vehicles.filter(v => v.id !== vehicleId);
      this.filterVehicles();
    } catch (err: any) {
      this.errorMsg = err.message || 'Failed to delete vehicle.';
    } finally {
      this.cdr.detectChanges();
    }
  }
}
