export class ProcessServerData {

    static sortResults(arr = []) {
        const collator = new Intl.Collator(undefined, {
            numeric: true,
            sensitivity: 'base'
        });
        arr = arr.sort((a, b) => { return collator.compare(a, b) });
        return arr;
    }
    static processServerResponse(data: string): any[] {
        let serverResponse = JSON.parse(data);

        serverResponse = serverResponse.map((city:any) => city['name']);
        serverResponse = this.sortResults(serverResponse);

        // if (serverResponse._coord.length) {
        //     serverResponse = this.sortResults(serverResponse._coord);
        // }
        // if (serverResponse._name.length) {
        //     serverResponse = this.sortResults(serverResponse._name);
        // }
        return serverResponse;
    }
}