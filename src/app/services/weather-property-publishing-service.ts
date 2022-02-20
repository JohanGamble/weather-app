import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { WeatherForecastProperties, WeatherProperties } from './weather-service';

@Injectable()
export class WeatherPublishingService {

  // Observable WeatherProperties sources
  private announcedWeatherSource = new Subject<WeatherProperties>();
  private announcedWeatherForecastSource = new Subject<WeatherForecastProperties>();
  private confirmedWeatherSource = new Subject<boolean>();

  // Observable WeatherProperties streams
  weatherAnnounced$ = this.announcedWeatherSource.asObservable();
  weatherForecastAnnounced$ = this.announcedWeatherForecastSource.asObservable();
  weatherConfirmed$ = this.confirmedWeatherSource.asObservable();

  // Service message commands
  announceWeather(forecast: WeatherProperties): void {
    try {
      this.announcedWeatherSource.next(forecast);
    } catch (err) {
      this.announcedWeatherSource.error(err);
    }
  }

  announceWeatherForecast(forecast: WeatherForecastProperties): void {
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