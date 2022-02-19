import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

// Services
import { ContentService } from "../services/content-service";
import { InputNotificationService } from "../services/input.service";
import { PopupNotificationService } from "../services/popup.service";
import { WeatherPublishingService } from "../services/weather-property-publishing-service";
import { IWeather, IWeatherForecastProperties, IWeatherProperties, WeatherService } from "../services/weather-service";

// Helper function
import { extractProperty, IJSONProperties } from 'src/extern-functions/extern-functions';
import { ProcessServerData } from 'src/extern-functions/app-worker-processes';

@Component({
    selector: 'app-content-container',
    templateUrl: 'content-container.component.html',
    styleUrls: ['content-container.component.sass']
})

export class ContentContainerComponent implements OnInit, OnDestroy {

    private subscription: Subscription | undefined;
    private param = "";
    weather: IWeather[] = [];
    cityNames: string[] = []

    constructor(
        private contentService: ContentService,
        private weatherService: WeatherService,
        private weatherPublishingService: WeatherPublishingService,
        private inputNotificationService: InputNotificationService,
        private popupNotificationService: PopupNotificationService
    ) { }

    ngOnInit(): void {
        this.subscription = this.inputNotificationService.inputEventAnnounced$.subscribe(
            (input: string) => {
                this.param = input;
                if (this.param) {
                    this.cityWeatherRequest();
                }
            },
            (e: Error) => { return new Error("Request error based on: " + e); },
            () => { return "Request call completed" });
        this.subscription = this.weatherService.getNearestCities().subscribe(
            (result: any) => {
                this.activateWorker(result);
            }
        )
    }

    cityWeatherRequest(param = ""): void {
        if (param != "") {
            this.param = param;
        }
        this.subscription = this.weatherService.getCurrentWeather(this.param).subscribe(
            (wp: IWeatherProperties) => {
                let jpi: IJSONProperties = {
                    container: wp.weather, prop: "icon"
                }
                let jpd: IJSONProperties = {
                    container: wp.weather, prop: "description"
                }
                let cityName = wp.name;
                let country = wp.sys.country;
                let iconkey = extractProperty(jpi);
                let desc = extractProperty(jpd);
                this.weather[0] = { name: cityName, icon: iconkey, description: desc, country: country };
                this.contentService.initialWeatherAnnounced(this.weather[0]);
                this.weatherPublishingService.confirmedWeather(true);
                this.weatherPublishingService.announceWeather(wp);
                this.cityWeatherForecastRequest(wp.coord.lat, wp.coord.lon);
                this.popupNotificationService.announceUpdateOfInputState(true);
            },
            (e: Error) => {
                this.popupNotificationService.announceErrorThroughPopup(e);
                return new Error("Request error based on: " + e);
            },
            () => { return "Request call completed" });
    }

    cityWeatherForecastRequest(lat: number, lon: number): void {
        this.subscription = this.weatherService.getSevenDayForecast(lat, lon).subscribe(
            (wFP: IWeatherForecastProperties) => {
                this.weatherPublishingService.announceWeatherForecast(wFP);
            });
    }

    // A published event from the menu child component
    refreshWeatherService(w: IWeather): void {
        for (let cityName = 0; cityName < this.weather.length; cityName++) {
            if (this.weather[cityName].name == w.name) {
                this.inputNotificationService.clickAnnouncementMade(w);
                this.cityWeatherRequest(w.name);
                let result = this.weather.indexOf(w);
                this.weather.splice(result, 1);
                break;
            }
        }
    }

    private activateWorker(result: string) {
        if (typeof Worker !== 'undefined') {
            // Create a new
            const worker = new Worker(new URL('../app.worker', import.meta.url));
            worker.onmessage = ({ data }) => {
                this.cityNames = data;
                this.contentService.cityNamesAnnounced(this.cityNames);
                console.log("List of cities available");
            };
            worker.postMessage(result);
        } else {
            let processedResults = ProcessServerData.processServerResponse(result);
            this.cityNames = processedResults;
            this.contentService.cityNamesAnnounced(this.cityNames);
        }
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}
