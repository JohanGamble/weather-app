import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

// Services
import { ContentService } from "../services/content-service";
import { InputNotificationService } from "../services/input.service";
import { PopupNotificationService } from "../services/popup.service";
import { WeatherPublishingService } from "../services/weather-property-publishing-service";
import { Weather, WeatherForecastProperties, WeatherProperties, WeatherService } from "../services/weather-service";
// PrimeNG
import { MessageService } from 'primeng/api';

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
    weather: Weather = new Weather();
    listOfCities: any[] = [];
    cityNames: string[] = [];

    constructor(
        private contentService: ContentService,
        private weatherService: WeatherService,
        private weatherPublishingService: WeatherPublishingService,
        private inputNotificationService: InputNotificationService,
        private messageService: MessageService,
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
                this.listOfCities = result;
                this.activateWorker(result);
            }
        )
    }

    cityWeatherRequest(param = ""): void {
        if (param != "") {
            this.param = param;
        }
        this.subscription = this.weatherService.getCurrentWeather(this.param).subscribe(
            (wp: WeatherProperties) => {
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
                this.weather = { name: cityName, icon: iconkey, description: desc, country: country };
                this.contentService.initialWeatherAnnounced(this.weather);
                this.weatherPublishingService.confirmedWeather(true);
                this.weatherPublishingService.announceWeather(wp);
                this.activeLatWorker(wp.coord);
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
            (wFP: WeatherForecastProperties) => {
                this.weatherPublishingService.announceWeatherForecast(wFP);
            });
    }

    // A published event from the menu child component
    refreshWeatherService(w: Weather): void {
        if (this.weather?.name == w.name) {
            this.inputNotificationService.clickAnnouncementMade(w);
            this.cityWeatherRequest(w.name);
        } else {
            this.inputNotificationService.clickAnnouncementMade(w);
            this.cityWeatherRequest(w.name);
        }
    }

    private activateWorker(result: string) {
        if (typeof Worker !== 'undefined') {
            // Create a new
            const cityWorker = new Worker(new URL('../app.cityWorker', import.meta.url));
            cityWorker.onmessage = ({ data }) => {
                this.cityNames = data;
                this.contentService.cityNamesAnnounced(this.cityNames);
                this.showTopLeft();
            };
            cityWorker.postMessage(result);
        } else {
            let processedResults = ProcessServerData.processServerResponse(result);
            this.cityNames = processedResults;
            this.contentService.cityNamesAnnounced(this.cityNames);
        }
    }

    private activeLatWorker(coord: any) {
        if (typeof Worker !== 'undefined') {
            const latWorker = new Worker(new URL('../app.latWorker', import.meta.url));
            latWorker.onmessage = ({ data }) => {
                this.contentService.derivedCitiesAnnounced(data);
            };
            latWorker.postMessage({ cities: this.listOfCities, currentCoords: coord });
        } else {
            let processedResults = ProcessServerData.deriveNearbyCities({ cities: this.listOfCities, currentCoords: coord });
            this.contentService.derivedCitiesAnnounced(processedResults);
        }
    }

    showTopLeft() {
        this.messageService.add({ key: 'tl', severity: 'info', detail: 'List of cities are now available.' });
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}
