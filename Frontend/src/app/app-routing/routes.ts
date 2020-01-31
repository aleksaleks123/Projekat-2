import {Routes} from '@angular/router';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {LocationComponent} from '../location/location.component';
import {ReportsComponent} from '../reports/reports.component';
import {LoginComponent} from '../auth/components/login/login.component';
import {RegisterComponent} from '../auth/components/register/register.component';
import {ReservationComponent} from '../reservation/reservation.component';
import {EventComponent} from '../event/event.component';

export const routes: Routes = [
  {
    path: 'dashboard/:content/preview',
    component: DashboardComponent
  },
  {
    path: 'dashboard/events/:id',
    component: EventComponent,
    pathMatch: 'full'
  },
  {
    path: 'dashboard/locations/:id',
    component: LocationComponent,
    pathMatch: 'full'
  },
  {
    path: 'dashboard/reservations/:id',
    component: ReservationComponent,
    pathMatch: 'full'
  },
  {
    path: 'dashboard/events',
    component: EventComponent,
    pathMatch: 'full'
  },
  {
    path: 'dashboard/locations',
    component: LocationComponent,
    pathMatch: 'full'
  },
  {
    path: 'dashboard/reports',
    component: ReportsComponent,
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    redirectTo: '/dashboard/events/preview',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: '/dashboard/events/preview',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent}
];
