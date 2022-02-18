import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { initMap } from '../../extern-functions/google_api'

@Component({
    selector: 'app-google-maps',
    templateUrl: 'google-maps.component.html',
    styleUrls: ['google-maps.component.sass'],
})

export class GoogleMapsComponent implements OnInit, OnDestroy {
    
    @Input() coord = { lat: 0, lng: 0};

    ngOnInit(): void {
        initMap(this.coord.lat, this.coord.lng);
    }

    ngOnDestroy(): void {
        document.getElementById('map')?.remove();
    }
}