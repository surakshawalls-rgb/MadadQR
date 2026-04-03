import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'v/:vehicleId',
    renderMode: RenderMode.Server
  },
  {
    path: 'dashboard',
    renderMode: RenderMode.Server
  },
  {
    path: 'qr',
    renderMode: RenderMode.Server
  },
  {
    path: 'edit-profile',
    renderMode: RenderMode.Server
  },
  {
    path: 'scan-qr',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
