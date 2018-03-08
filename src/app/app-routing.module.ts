import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { YourPageComponent }   from './your-page/your-page.component';
import { CourtSearchComponent }      from './court-search/court-search.component';
import { CreateAccountComponent }  from './create-account/create-account.component';
import { CreateEventComponent }   from './create-event/create-event.component';
import { CreateGroupComponent }   from './create-group/create-group.component';
import { CreateCourtComponent }   from './create-court/create-court.component';
import { EventComponent }   from './event/event.component';
import { GroupComponent }   from './group/group.component';
import { CourtComponent }   from './court/court.component';
import { LoginComponent }   from './login/login.component';
import { MessageCenterComponent }   from './message-center/message-center.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login',  component: LoginComponent },
  { path: 'account/:id', component: YourPageComponent, canActivate: [AuthGuard] },
  { path: 'event/:id/:id', component: EventComponent },
  { path: 'group/:id', component: GroupComponent },
  { path: 'court/:id', component: CourtComponent },
  { path: 'courtsearch',     component: CourtSearchComponent },
  { path: 'createaccount',     component: CreateAccountComponent },
  { path: 'createevent',     component: CreateEventComponent },
  { path: 'createevent/:id',     component: CreateEventComponent },
  { path: 'createeventcourt/:id',     component: CreateEventComponent },
  { path: 'createeventgroup/:id',     component: CreateEventComponent },
  { path: 'createcourt',     component: CreateCourtComponent },
  { path: 'createvent',     component: CreateEventComponent },
  { path: 'creategroup',     component: CreateGroupComponent },
  { path: 'messagecenter/:id',     component: MessageCenterComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],

})
export class AppRoutingModule {}
