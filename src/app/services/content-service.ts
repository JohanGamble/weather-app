import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { Weather } from "./weather-service";

@Injectable()
export class ContentService {

    // Observable Content sources
    private initialWeatherAnnouncement = new Subject<Weather>();
    private optionsListAnnouncement = new Subject<string[]>();
    private derivedCitiesAnnouncement = new Subject<string[]>();

    // Observable Content streams
    initialWeatherAnnounced$ = this.initialWeatherAnnouncement.asObservable();
    optionsListAnnounced$ = this.optionsListAnnouncement.asObservable();
    derivedCitiesAnnounced$ = this.derivedCitiesAnnouncement.asObservable();

    initialWeatherAnnounced(forecast: Weather): void {
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

    derivedCitiesAnnounced(derivedList: any[]): void {
        try {
            this.derivedCitiesAnnouncement.next(derivedList);
        } catch (err) {
            this.derivedCitiesAnnouncement.error(err);
        }
    }
}