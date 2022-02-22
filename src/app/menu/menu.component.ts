import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Weather } from '../services/weather-service';

// Services
import { ContentService } from '../services/content-service';

@Component({
    selector: 'app-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.sass']
})
export class MenuComponent implements OnInit, OnDestroy {

    private subscription: Subscription | undefined;
    @Output() refreshEvent = new EventEmitter<Weather>();
    weather: Weather = new Weather();
    derivedCities: any[] = [];

    constructor(private contentService: ContentService) { }

    ngOnInit(): void {
        this.subscription = this.contentService.initialWeatherAnnounced$.subscribe(
            (w: Weather) => {
                this.weather = w;
            });
        this.subscription = this.contentService.derivedCitiesAnnounced$.subscribe(
            (d: any[]) => {
                this.derivedCities = d;
            });
    }

    refreshWeather(w: Weather): void {
        this.refreshEvent.emit(w);
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}