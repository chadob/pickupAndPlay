import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AgmCoreModule } from '@agm/core'; //google maps angular

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from './../environments/environment';

import { AuthGuardService } from './auth/auth-guard.service';
import { AuthService } from './auth/auth.service';
import { GoToPage } from './go-to-page/go-to-page.service';
import {MessageService} from './message-service/message.service';
import {GetService} from './server-service/get.service';

import { NavbarComponent } from './navbar/navbar.component';
import { AppComponent } from './app.component';
import { YourPageComponent }   from './your-page/your-page.component';
import { CourtSearchComponent }      from './court-search/court-search.component';
import { CreateAccountComponent }  from './create-account/create-account.component';
import { CreateCourtComponent }  from './create-court/create-court.component';
import { CreateEventComponent }   from './create-event/create-event.component';
import { CreateGroupComponent }   from './create-group/create-group.component';
import { EventComponent }   from './event/event.component';
import { GroupComponent }   from './group/group.component';
import { LoginComponent }   from './login/login.component';
import { YourPageCourtsComponent } from './your-page-courts/your-page-courts.component';
import { YourPageEventsComponent } from './your-page-events/your-page-events.component';
import { YourPageGroupsComponent } from './your-page-groups/your-page-groups.component';
import { YourPageMessagesComponent } from './your-page-messages/your-page-messages.component';
import { MessageCenterComponent } from './message-center/message-center.component';
import {TreeNodeGroupComponent} from './tree-node/tree-node-group.component';
import {TreeNodeCourtComponent} from './tree-node/tree-node-court.component';
import {TreeNodeEventComponent} from './tree-node/tree-node-event.component';
import { CourtComponent } from './court/court.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    YourPageComponent,
    CourtSearchComponent,
    CreateAccountComponent,
    CreateEventComponent,
    CreateGroupComponent,
    EventComponent,
    GroupComponent,
    LoginComponent,
    YourPageCourtsComponent,
    YourPageEventsComponent,
    YourPageGroupsComponent,
    YourPageMessagesComponent,
    MessageCenterComponent,
    TreeNodeGroupComponent,
    TreeNodeCourtComponent,
    TreeNodeEventComponent,
    CreateCourtComponent,
    CourtComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB_l8twMsQhOVqIp8Olss7SHTfNX-K_2zc'
    })
  ],
  providers: [
    AuthGuardService,
    AuthService,
    GoToPage,
    GetService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
