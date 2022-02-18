import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IWeather } from './weather-service';

@Injectable()
export class InputNotificationService {

    // Observable Input source
    private notifySiblingOfKeyboardEvent = new Subject<string>();
    private notifySiblingOfButtonClickEvent = new Subject<IWeather>();

    // Observable Input stream
    inputEventAnnounced$ = this.notifySiblingOfKeyboardEvent.asObservable();
    buttonEventAnnounced$ = this.notifySiblingOfButtonClickEvent.asObservable();

    // Service message command
    inputAnnouncementMade(value: string): void {
        try {
            this.notifySiblingOfKeyboardEvent.next(value);
        } catch (err) {
            this.notifySiblingOfKeyboardEvent.error(err);
        }
    }
    clickAnnouncementMade(value: IWeather): void {
        try {
            this.notifySiblingOfButtonClickEvent.next(value);
        } catch (err) {
            this.notifySiblingOfButtonClickEvent.error(err);
        }
    }
}