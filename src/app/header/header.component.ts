import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { Weather } from '../services/weather-service';

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
    weather: Weather = new Weather();
    indicator: boolean = false

    constructor(private contentService: ContentService) { }

    ngOnInit(): void {
        this.subscription = this.contentService.initialWeatherAnnounced$.subscribe(
            (w: Weather) => {
                this.title = w.name + ', ' + w.country;
            });
        this.subscription = this.contentService.derivedCitiesAnnounced$.subscribe(
            (d: any[]) => {
                if (d.length > 0) {
                    this.indicator = true;
                } else {
                    this.indicator = false;
                }
            }
        )
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}