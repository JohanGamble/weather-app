import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class PopupNotificationService {

    // Observable Popup source
    private announcedPopupState = new Subject<Error>();
    private announcedUpdateOfInputState = new Subject<boolean>();

    // Observable Error Streams
    popupServiceRequired = this.announcedPopupState.asObservable();
    popupStateUpdateRequired = this.announcedUpdateOfInputState.asObservable();

    // Service message commands
    announceErrorThroughPopup(e: Error): void {
        try {
            this.announcedPopupState.next(e);
        } catch (err) {
            this.announcedPopupState.error(err);
        }
    }
    announceUpdateOfInputState(value: boolean) {
        try {
            this.announcedUpdateOfInputState.next(value);
        } catch (err) {
            this.announcedUpdateOfInputState.error(err);
        }
    }
}