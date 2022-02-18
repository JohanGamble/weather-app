import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { IWeatherForecastProperties, IWeatherProperties } from './weather-service';

@Injectable()
export class WeatherPublishingService {

  // Observable WeatherProperties sources
  private announcedWeatherSource = new Subject<IWeatherProperties>();
  private announcedWeatherForecastSource = new Subject<IWeatherForecastProperties>();
  private confirmedWeatherSource = new Subject<boolean>();

  // Observable WeatherProperties streams
  weatherAnnounced$ = this.announcedWeatherSource.asObservable();
  weatherForecastAnnounced$ = this.announcedWeatherForecastSource.asObservable();
  weatherConfirmed$ = this.confirmedWeatherSource.asObservable();

  // Service message commands
  announceWeather(forecast: IWeatherProperties): void {
    try {
      this.announcedWeatherSource.next(forecast);
    } catch (err) {
      this.announcedWeatherSource.error(err);
    }
  }

  announceWeatherForecast(forecast: IWeatherForecastProperties): void {
    try {
      this.announcedWeatherForecastSource.next(forecast);
    } catch (err) {
      this.announcedWeatherForecastSource.error(err);
    }
  }

  confirmedWeather(forecast: boolean): void {
    try {
      this.confirmedWeatherSource.next(forecast);
    } catch (err) {
      this.confirmedWeatherSource.error(err);
    }
  }
}