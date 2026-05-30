import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LaunchDetailComponent } from './pages/launch-detail/launch-detail.component';
import { RocketsComponent } from './pages/rockets/rockets.component';
import { PayloadsComponent } from './pages/payloads/payloads.component';
import { LaunchpadsComponent } from './pages/launchpads/launchpads.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'launch/:id', component: LaunchDetailComponent },
  { path: 'rockets', component: RocketsComponent },
  { path: 'payloads', component: PayloadsComponent },
  { path: 'launchpads', component: LaunchpadsComponent },
  { path: '**', redirectTo: '' },
];
