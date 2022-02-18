import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

// Services
import { PopupNotificationService } from '../services/popup.service';

@Component({
    selector: 'app-popup',
    templateUrl: 'popup.component.html',
    styleUrls: ['popup.component.sass']
})
export class PopupComponent implements OnInit, OnDestroy {

    state: 'opened' | 'closed' = 'closed';

    @Input()
    get message(): string { return this._message; }
    set message(message: string) {
        this._message = message;
        this.state = 'opened';
    }

    private subscription: Subscription | undefined;
    private _message = '';

    constructor(private popupNotificationService: PopupNotificationService) { }

    ngOnInit(): void {
        this.subscription = this.popupNotificationService.popupServiceRequired.subscribe(
            (e: any) => {
                this.message = e;
            },
            (e: Error) => {
                return new Error("Reqeust error based on: " + e);
            },
            () => { return "Message notification completed" });
        this.subscription = this.popupNotificationService.popupStateUpdateRequired.subscribe(
            (value: boolean) => {
                if (value) {
                    this.changePopupState();
                }
            }
        )
    }

    changePopupState(): void {
        this.message = "";
        this.state = 'closed';
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}