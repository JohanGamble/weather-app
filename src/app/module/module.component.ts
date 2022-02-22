import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { WeatherForecastProperties, WeatherProperties } from '../services/weather-service';

// Services
import { PopupNotificationService } from '../services/popup.service';
import { WeatherPublishingService } from '../services/weather-property-publishing-service';

@Component({
    selector: 'app-module',
    templateUrl: 'module.component.html',
    styleUrls: ['module.component.sass']
})
export class ModuleComponent implements OnInit, OnDestroy {

    private subscription: Subscription | undefined;
    wP: WeatherProperties = new WeatherProperties();
    wFP: WeatherForecastProperties = new WeatherForecastProperties();
    panelOpenState: boolean = true;
    weatherDetailAvailability: boolean = false;
    coord = { lat: 0, lng: 0 };
    dateTime = (new Date).getTime();

    constructor(
        private weatherPublishingService: WeatherPublishingService,
        private popupNotificationService: PopupNotificationService) { }

    ngOnInit(): void {
        this.subscription = this.weatherPublishingService.weatherConfirmed$.subscribe(
            (confirmed: boolean) => {
                this.weatherDetailAvailability = confirmed;
            },
            (e: Error) => {
                return new Error("Reqeust error based on: " + e);
            },
            () => { return "Request call completed"; });
        this.subscription = this.weatherPublishingService.weatherAnnounced$.subscribe(
            (forecast: WeatherProperties) => {
                this.wP = forecast;
                // Google maps uses the property "lng"
                this.coord = { lat: forecast.coord.lat, lng: forecast.coord.lon };
            },
            (e: Error) => {
                this.popupNotificationService.announceErrorThroughPopup(e);
                return new Error("Request error based on: " + e);
            },
            () => { return "Request call completed"; });
        this.subscription = this.weatherPublishingService.weatherForecastAnnounced$.subscribe(
            (wFP: WeatherForecastProperties) => {
                this.wFP = wFP;
                this.wFP.daily = this.weatherIndicator(wFP.daily);
            },
            (e: Error) => {
                return new Error("Reqeust error based on: " + e);
            },
            () => { return "Request call completed"; });
    }

    weatherIndicator(daily: any[]): any[] {
        // Accounting for winter in the northern hemisphere
        for (let i = 0; i < daily.length; i++) {
            if (daily[i].temp.max - 272 < 0)
                daily[i].temp.weatherIndicator = "cold";
            if ((0 < daily[i].temp.max - 272) && (daily[i].temp.max - 272 < 4))
                daily[i].temp.weatherIndicator = "mild";
            if ((4 < daily[i].temp.max - 272) && (daily[i].temp.max - 272 < 8))
                daily[i].temp.weatherIndicator = "warm";
            if ((8 < daily[i].temp.max - 272) && (daily[i].temp.max - 272 < 14))
                daily[i].temp.weatherIndicator = "hot";
        }
        return daily;
    }

    removeModule(ev: any) {
        let evt = undefined;
        if (ev.path) {
            evt = ev.path[1] as HTMLDivElement;
            evt.remove();
        }
        else {
            evt = ev.composedPath()[1] as HTMLDivElement;
            evt.remove();
        }
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}