import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { IWeather } from '../services/weather-service';

// Services
import { ContentService } from '../services/content-service';


@Component({
    selector: 'app-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.sass']
})
export class MenuComponent implements OnInit, OnDestroy {

    private subscription: Subscription | undefined;
    @Output() refreshEvent = new EventEmitter<IWeather>();
    weather: IWeather[] = [];

    constructor(private contentService: ContentService) { }

    ngOnInit(): void {
        this.subscription = this.contentService.initialWeatherAnnounced$.subscribe(
            (w: IWeather) => {
                this.weather[0] = w;
            }
        )
    }

    refreshWeather(w: IWeather): void {
        this.refreshEvent.emit(w);
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}