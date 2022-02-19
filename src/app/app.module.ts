import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ContentContainerComponent } from './content-container/content-container.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { ModuleComponent } from './module/module.component';
import { UserInputComponent } from './user-input/user-input.component';
import { PopupComponent } from './popup/popup.component';
import { GoogleMapsComponent } from './google-maps/google-maps.component';

// Services
import { WeatherService } from './services/weather-service';
import { WeatherPublishingService } from './services/weather-property-publishing-service';
import { InputNotificationService } from './services/input.service';
import { PopupNotificationService } from './services/popup.service';
import { ContentService } from './services/content-service';
// PrimeNG
import { MessageService } from 'primeng/api';

// Angular Materials
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// PrimeNG
import { ToastModule } from 'primeng/toast'

@NgModule({
  declarations: [
    AppComponent,
    ContentContainerComponent,
    HeaderComponent,
    MenuComponent,
    ModuleComponent,
    UserInputComponent,
    PopupComponent,
    GoogleMapsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // Angular Materials
    MatExpansionModule,
    MatAutocompleteModule,

    // PrimeNG
    ToastModule,
  ],
  providers: [
    ContentService,
    InputNotificationService,
    PopupNotificationService,
    WeatherService,
    WeatherPublishingService,
    // Prime
    MessageService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
