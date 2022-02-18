import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { IWeather } from "./weather-service";

@Injectable()
export class ContentService {

    // Observable Content sources
    private initialWeatherAnnouncement = new Subject<IWeather>();
    private optionsListAnnouncement = new Subject<string[]>();

    // Observable Content streams
    initialWeatherAnnounced$ = this.initialWeatherAnnouncement.asObservable();
    optionsListAnnounced$ = this.optionsListAnnouncement.asObservable();

    initialWeatherAnnounced(forecast: IWeather): void {
        try {
            this.initialWeatherAnnouncement.next(forecast);
        } catch (err) {
            this.initialWeatherAnnouncement.error(err);
        }
    }

    cityNamesAnnounced(optionList: string[]): void {
        try {
            this.optionsListAnnouncement.next(optionList);
        } catch (err) {
            this.optionsListAnnouncement.error(err);
        }
    }
}