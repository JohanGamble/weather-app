import { } from 'google.maps';

let map: google.maps.Map;

function initMap(lat: number, lng: number): void {
    map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: { lat: lat, lng: lng },
        zoom: 8,
    });
}

export { initMap }