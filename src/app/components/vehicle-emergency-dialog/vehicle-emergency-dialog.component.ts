import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface VehicleEmergencyContact {
  name?: string;
  mobile?: string;
}

export interface VehicleEmergencyDialogData {
  vehicleNumber: string;
  ownerName?: string;
  customerNumber?: string;
  registeredOn?: string;
  contacts: VehicleEmergencyContact[];
}

@Component({
  selector: 'app-vehicle-emergency-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="dialog-shell">
      <div class="dialog-header">
        <div class="dialog-icon">
          <mat-icon>visibility</mat-icon>
        </div>
        <div>
          <h2>Emergency Contacts</h2>
          <p>{{ data.vehicleNumber }} · {{ data.ownerName || 'Vehicle owner' }}</p>
        </div>
      </div>

      <div class="dialog-meta">
        <div>
          <span class="meta-label">Customer Number</span>
          <span class="meta-value">{{ data.customerNumber || '—' }}</span>
        </div>
        <div>
          <span class="meta-label">Registered On</span>
          <span class="meta-value">{{ data.registeredOn || '—' }}</span>
        </div>
      </div>

      <div *ngIf="data.contacts.length; else noContacts" class="contact-list">
        <div *ngFor="let contact of data.contacts; let i = index" class="contact-card">
          <div class="contact-index">{{ i + 1 }}</div>
          <div class="contact-body">
            <div class="contact-name">{{ contact.name || 'Emergency Contact ' + (i + 1) }}</div>
            <div class="contact-mobile">+91 {{ contact.mobile || '—' }}</div>
          </div>
        </div>
      </div>

      <ng-template #noContacts>
        <div class="empty-state">No emergency contacts available for this vehicle.</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .dialog-shell { background: #12121d; color: #e2e8f0; padding: 1.5rem; min-width: min(92vw, 520px); }
    .dialog-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; }
    .dialog-icon {
      width: 48px; height: 48px;
      border-radius: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(99,102,241,0.14);
      color: #a78bfa;
      flex-shrink: 0;
    }
    .dialog-icon mat-icon { width: 24px; height: 24px; }
    .dialog-header h2 { color: #fff; font-size: 1.2rem; font-weight: 800; margin: 0; }
    .dialog-header p { color: #94a3b8; font-size: 0.88rem; margin: 0.15rem 0 0; }
    .dialog-meta {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
      margin-bottom: 1.1rem;
    }
    .dialog-meta > div {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(99,102,241,0.14);
      border-radius: 14px;
      padding: 0.85rem 0.9rem;
    }
    .meta-label { display: block; color: #64748b; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.25rem; }
    .meta-value { color: #e2e8f0; font-size: 0.9rem; font-weight: 700; }
    .contact-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .contact-card {
      display: flex;
      align-items: center;
      gap: 0.9rem;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(99,102,241,0.14);
      border-radius: 14px;
      padding: 0.9rem;
    }
    .contact-index {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: #fff;
      flex-shrink: 0;
    }
    .contact-name { color: #fff; font-weight: 700; margin-bottom: 0.15rem; }
    .contact-mobile { color: #94a3b8; font-size: 0.88rem; }
    .empty-state {
      background: rgba(255,255,255,0.03);
      border: 1px dashed rgba(99,102,241,0.2);
      border-radius: 14px;
      padding: 1.2rem;
      color: #94a3b8;
      text-align: center;
    }
    @media (max-width: 520px) {
      .dialog-meta { grid-template-columns: 1fr; }
    }
  `]
})
export class VehicleEmergencyDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: VehicleEmergencyDialogData) {}
}