import { isRange } from 'src/extern-functions/extern-functions';

export class ProcessServerData {

    static sortResults(arr = []): any[] {
        const collator = new Intl.Collator(undefined, {
            numeric: true,
            sensitivity: 'base'
        });
        arr = arr.sort((a, b) => { return collator.compare(a, b) });
        return arr;
    }
    static sortCoords(arr: any[]): any[] {
        arr = arr.sort((a: any, b: any) => { return a.coord.lat - b.coord.lat });
        return arr;
    }

    static nearestCities(data: any): any[] {
        let scale: number = 0.0001;
        let latRange: any = {
            lower: data.currentCoords.lat - scale,
            upper: data.currentCoords.lat + scale
        };
        let lonRange: any = {
            lower: data.currentCoords.lon - scale,
            upper: data.currentCoords.lon + scale
        };
        let latResults = data.cities.filter((v: any) => isRange(v.coord.lat, latRange));
        let lonResults = data.cities.filter((v: any) => isRange(v.coord.lat, lonRange));
        return this.focusView([latResults, lonResults]);
    }


    static focusView([latResults, lonResults]: any): any[] {
        if (latResults.length) {
            return latResults;
        } else {
            return lonResults;
        }
    }

    static processServerResponse(data: string): any[] {
        let serverResponse = JSON.parse(data);
        serverResponse = serverResponse.map((city: any) => city['name']);
        serverResponse = this.sortResults(serverResponse);
        return serverResponse;
    }

    static deriveNearbyCities(data: any): any[] {
        data.cities = JSON.parse(data.cities);
        this.sortCoords(data.cities);
        return this.nearestCities(data);
    }
}