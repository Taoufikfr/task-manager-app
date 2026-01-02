import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  // 1. When the path is empty (homepage), show Dashboard
  { path: '', component: DashboardComponent },
  
  // 2. (Optional) Redirect any unknown paths to Home
  { path: '**', redirectTo: '' }
];