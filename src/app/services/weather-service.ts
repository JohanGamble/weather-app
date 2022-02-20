import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

// Environment variables
import { environment } from 'src/environments/environment'

export class WeatherProperties {
    coord: any = {};
    weather: any[];
    base: string;
    main: any;
    visibility: number;
    wind: any;
    clouds: any;
    dt: number;
    sys: any;
    timezone: number;
    id: number;
    name: string;
    code: number;


    constructor() {
        this.coord = { "lat": 0, "lon": 0 };
        this.weather = [];
        this.base = "";
        this.main = {};
        this.visibility = 0;
        this.wind = {};
        this.clouds = {};
        this.dt = 0;
        this.sys = {};
        this.timezone = 0;
        this.id = 0;
        this.name = "";
        this.code = 0;
    }
}

export class WeatherForecastProperties {
    lon: number;
    lat: number;
    timezone: string;
    timezone_offset: number;
    current: any;
    daily: any[];
    constructor() {
        this.lon = 0;
        this.lat = 0;
        this.timezone = "";
        this.timezone_offset = 0;
        this.daily = [];
    }
}

export class Weather {
    name: string;
    icon: string;
    description: string;
    country: string;
    constructor() {
        this.name = "";
        this.icon = "";
        this.description = "";
        this.country = "";
    }
}

@Injectable()
export class WeatherService {

    private env = environment;

    constructor(private http: HttpClient) { }

    private options = {
        headers: new HttpHeaders({
            "Content-Type": "application/json",
            "X-Requested-With": "xyz",
            "Accept": "application"
        }),
        observe: 'body' as const,
        reportProgress: true,
        responseType: 'json' as const,
        withCredentials: false,
    }

    getCurrentWeather(param: string) {
        // let weatherUrl: string = `https://api.openweathermap.org/data/2.5/weather?q=${param}&appid=${this.env.owmApiKey}`;
        // return this.http.get<WeatherProperties>(weatherUrl).pipe(retry(3), catchError(this.handleError));

        // DUMMY DATA
        let weatherUrl = "./assets/dummy_data_berlin.json";
        return this.http.get<WeatherProperties>(weatherUrl).pipe(retry(3), catchError(this.handleError));
    }

    getSevenDayForecast(lat: number, lon: number) {
        // let weatherUrl: string = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,hourly,minutely&appid=${this.env.owmApiKey}`;
        // return this.http.get<WeatherForecastProperties>(weatherUrl).pipe(retry(3), catchError(this.handleError));

        // DUMMY DATA
        let weatherUrl = "./assets/dummy_daily_data.json";
        return this.http.get<WeatherForecastProperties>(weatherUrl).pipe(retry(3), catchError(this.handleError));
    }

    getNearestCities() {
        // DUMMY DATA
        let cityRequest = "./assets/city.list.json";
        return this.http.get(cityRequest, { responseType: 'text' }).pipe(retry(3), catchError(this.handleError));
    }

    handleError(error: HttpErrorResponse) {
        let message = "";
        if (error.status === 0) {
            message = error.message;
        } else {
            if (error.status === 200) {
                message = error.message;
            }
            if (error.status === 401) {
                message = "You are not authorized. You must have an API Key to search for cities."
            }
            if (error.status === 404)
                message = "City cannot be found";
        }
        return throwError(message);
    }
}