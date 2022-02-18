import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { IWeather } from '../services/weather-service';

// Services
import { ContentService } from "../services/content-service";


@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.sass']
})

export class HeaderComponent implements OnInit, OnDestroy {

    private subscription: Subscription | undefined;
    title: string = "";
    weather: IWeather | undefined;

    constructor(private contentService: ContentService) { }

    ngOnInit(): void {
        this.subscription = this.contentService.initialWeatherAnnounced$.subscribe(
            (w: IWeather) => {
                this.title = w.name + ', ' + w.country;
            }
        )
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}