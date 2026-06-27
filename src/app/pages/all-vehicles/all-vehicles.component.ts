import { Component, OnInit, ChangeDetectorRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SupabaseService } from '../../services/supabase.service';
import {
  VehicleEmergencyContact,
  VehicleEmergencyDialogComponent,
  VehicleEmergencyDialogData
} from '../../components/vehicle-emergency-dialog/vehicle-emergency-dialog.component';

type VehicleRow = {
  id: string;
  user_id?: string;
  vehicle_number: string;
  created_at?: string;
  users?: { id?: string; name?: string; mobile?: string; created_at?: string } | null;
  emergencyContacts?: VehicleEmergencyContact[];
};

@Component({
  selector: 'app-all-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatDialogModule, MatIconModule],
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
                <th>Customer Number</th>
                <th>Registered On</th>
                <th>Emergency Contact Name</th>
                <th>Emergency Contact Mobile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let v of filtered; let i = index">
                <td class="td-idx" data-label="#">{{ i + 1 }}</td>
                <td data-label="Vehicle Number"><span class="plate">{{ v.vehicle_number }}</span></td>
                <td class="td-owner" data-label="Owner Name">{{ v.users?.name || '—' }}</td>
                <td class="td-mobile" data-label="Customer Number">{{ formatCustomerNumber(v.users?.mobile) }}</td>
                <td class="td-date" data-label="Registered On">{{ getRegisteredOn(v) }}</td>
                <td class="td-emergency" data-label="Emergency Contact Name">
                  <ng-container *ngIf="getPrimaryEmergencyContact(v) as contact; else noEmergencyName">
                    <button type="button" class="contact-pill" (click)="openEmergencyDialog(v)" [title]="'View emergency contacts'">
                      <span class="contact-main">{{ contact.name || 'Emergency Contact' }}</span>
                      <span class="contact-count" *ngIf="getEmergencyContacts(v).length > 1">+{{ getEmergencyContacts(v).length - 1 }}</span>
                    </button>
                  </ng-container>
                  <ng-template #noEmergencyName>—</ng-template>
                </td>
                <td class="td-emergency-mobile" data-label="Emergency Contact Mobile">
                  <ng-container *ngIf="getPrimaryEmergencyContact(v) as contact; else noEmergencyMobile">
                    <button type="button" class="contact-pill contact-pill-mobile" (click)="openEmergencyDialog(v)" [title]="'View emergency contacts'">
                      {{ formatCustomerNumber(contact.mobile) }}
                    </button>
                  </ng-container>
                  <ng-template #noEmergencyMobile>—</ng-template>
                </td>
                <td class="td-actions" data-label="Actions">
                  <a [routerLink]="['/dashboard']" [queryParams]="{userId: v.users?.id}" class="icon-action action-dashboard" title="Open dashboard" aria-label="Open dashboard">
                    <mat-icon>dashboard</mat-icon>
                  </a>
                  <a [routerLink]="['/qr']" [queryParams]="{vehicleId: v.id}" class="icon-action action-qr" title="View QR" aria-label="View QR">
                    <mat-icon>qr_code</mat-icon>
                  </a>
                  <button type="button" class="icon-action action-view" (click)="openEmergencyDialog(v)" title="View emergency contacts" aria-label="View emergency contacts">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <a [routerLink]="['/edit-profile']" [queryParams]="{vehicleId: v.id}" class="icon-action action-edit" title="Edit vehicle" aria-label="Edit vehicle">
                    <mat-icon>edit</mat-icon>
                  </a>
                  <button type="button" (click)="deleteVehicle(v.id)" class="icon-action action-delete" title="Delete vehicle" aria-label="Delete vehicle">
                    <mat-icon>delete</mat-icon>
                  </button>
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
    .td-emergency, .td-emergency-mobile { color: #cbd5e1; }
    .contact-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      max-width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(99,102,241,0.15);
      border-radius: 999px;
      color: #e2e8f0;
      padding: 0.35rem 0.7rem;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .contact-pill:hover { background: rgba(99,102,241,0.08); border-color: rgba(99,102,241,0.35); }
    .contact-pill-mobile { color: #94a3b8; font-family: monospace; }
    .contact-main {
      display: inline-block;
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .contact-count {
      min-width: 22px;
      height: 22px;
      border-radius: 999px;
      background: rgba(99,102,241,0.18);
      color: #a78bfa;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.72rem;
      font-weight: 800;
      flex-shrink: 0;
    }
    .td-actions {
      display: flex;
      gap: 0.35rem;
      justify-content: flex-end;
      align-items: center;
    }
    .icon-action {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(99,102,241,0.16);
      background: rgba(255,255,255,0.03);
      color: #cbd5e1;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
      padding: 0;
    }
    .icon-action:hover { transform: translateY(-1px); border-color: rgba(99,102,241,0.35); background: rgba(99,102,241,0.08); color: #fff; }
    .icon-action mat-icon {
      width: 20px;
      height: 20px;
      font-size: 20px;
      line-height: 20px;
    }
    .action-dashboard { color: #94a3b8; }
    .action-qr { color: #a78bfa; }
    .action-edit { color: #60a5fa; }
    .action-view { color: #34d399; }
    .action-delete { color: #f87171; }
    .empty-msg { color: #475569; text-align: center; padding: 3rem; }
    @media (max-width: 640px) {
      .av-header { flex-direction: column; }
      .search-bar { flex-direction: column; align-items: stretch; }
      .search-count { align-self: flex-start; }
      .table-wrap {
        border: none;
        overflow: visible;
      }
      .vehicles-table,
      .vehicles-table thead,
      .vehicles-table tbody,
      .vehicles-table th,
      .vehicles-table td,
      .vehicles-table tr {
        display: block;
        width: 100%;
      }
      .vehicles-table thead {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
      }
      .vehicles-table tbody tr {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(99,102,241,0.15);
        border-radius: 18px;
        padding: 0.25rem 0;
        margin-bottom: 0.9rem;
        box-shadow: 0 8px 24px rgba(0,0,0,0.18);
      }
      .vehicles-table td {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.7rem 0.9rem;
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }
      .vehicles-table td:last-child { border-bottom: none; }
      .vehicles-table td::before {
        content: attr(data-label);
        color: #64748b;
        font-size: 0.68rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        flex: 0 0 34%;
        max-width: 34%;
        line-height: 1.25;
      }
      .td-idx { width: auto; color: #94a3b8; }
      .td-idx::before { content: '#'; }
      .td-owner, .td-mobile, .td-date, .td-emergency, .td-emergency-mobile, .td-actions { text-align: right; }
      .td-owner, .td-mobile, .td-date { font-family: inherit; }
      .td-actions {
        justify-content: flex-end;
        flex-wrap: nowrap;
        gap: 0.25rem;
        overflow-x: auto;
        scrollbar-width: none;
      }
      .td-actions::-webkit-scrollbar { display: none; }
      .contact-pill {
        justify-content: flex-end;
        text-align: right;
        max-width: 100%;
      }
      .contact-main {
        max-width: 120px;
      }
      .icon-action {
        width: 32px;
        height: 32px;
        border-radius: 9px;
        flex: 0 0 32px;
      }
      .icon-action mat-icon {
        width: 18px;
        height: 18px;
        font-size: 18px;
        line-height: 18px;
      }
    }
  `]
})
export class AllVehiclesComponent implements OnInit {
  vehicles: VehicleRow[] = [];
  filtered: VehicleRow[] = [];
  searchQuery = '';
  loading = true;
  errorMsg = '';

  constructor(
    private supa: SupabaseService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object,
    private dialog: MatDialog
  ) {}

  private getContactList(vehicle: VehicleRow) {
    return vehicle.emergencyContacts || [];
  }

  private formatDate(value?: string) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatCustomerNumber(value?: string) {
    return value ? `+91 ${value}` : '—';
  }

  getRegisteredOn(vehicle: VehicleRow) {
    return this.formatDate(vehicle.created_at || vehicle.users?.created_at);
  }

  getEmergencyContacts(vehicle: VehicleRow) {
    return this.getContactList(vehicle);
  }

  getPrimaryEmergencyContact(vehicle: VehicleRow) {
    return this.getContactList(vehicle)[0] || null;
  }

  openEmergencyDialog(vehicle: VehicleRow) {
    const contacts = this.getContactList(vehicle);
    const dialogData: VehicleEmergencyDialogData = {
      vehicleNumber: vehicle.vehicle_number,
      ownerName: vehicle.users?.name || 'Vehicle owner',
      customerNumber: vehicle.users?.mobile,
      registeredOn: this.getRegisteredOn(vehicle),
      contacts
    };
    this.dialog.open(VehicleEmergencyDialogComponent, {
      width: '560px',
      maxWidth: '92vw',
      panelClass: 'madad-dialog-panel',
      autoFocus: false,
      data: dialogData
    });
  }

  async ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }
    try {
      const { data, error } = await this.supa.getAllVehiclesWithOwners();
      if (error) throw new Error((error as any)?.message || 'Failed to load vehicles.');
      const rawVehicles = (data || []) as VehicleRow[];
      const rows = await Promise.all(
        rawVehicles.map(async vehicle => {
          const { data: contacts } = await this.supa.getEmergencyContacts(vehicle.id);
          return { ...vehicle, emergencyContacts: contacts || [] };
        })
      );
      this.vehicles = rows;
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
      v.users?.mobile?.includes(q) ||
      this.getEmergencyContacts(v).some(contact =>
        contact.name?.toLowerCase().includes(q) || contact.mobile?.includes(q)
      )
    );
  }
  async deleteVehicle(vehicleId: string) {
    if (!confirm('Are you sure you want to delete this vehicle? This cannot be undone.')) return;
    try {
      const { error } = await this.supa.deleteVehicle(vehicleId);
      if (error) throw new Error((error as any)?.message || 'Failed to delete vehicle.');
      this.vehicles = this.vehicles.filter(v => v.id !== vehicleId);
      this.filterVehicles();
    } catch (err: any) {
      this.errorMsg = err.message || 'Failed to delete vehicle.';
    } finally {
      this.cdr.detectChanges();
    }
  }
}
