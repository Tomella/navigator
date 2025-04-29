/*
    // We use standard geolocation object within breadcrumb.

    timestamp: 1743631242285,
    coords: {
        accuracy: 1046.540898117061,
        latitude: -34.4588288,
        longitude: 138.8085248,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null
    }
*/

export default class Destination {
    static KEY = "destination_latLng"
    constructor() {
        let lastDestination = localStorage.getItem(Destination.KEY);
        if(lastDestination) {
            try {
                this.latLng = JSON.parse(lastDestination);
                return; 
            } catch(e) {
                localStorage.removeItem(Destination.KEY);
            };
        }
        this.latLng = null;
    }

    set(latLng) {
        if(latLng && latLng.lat && latLng.lng) {
            this.latLng = {lat: latLng.lat, lng: latLng.lng};
            localStorage.setItem(Destination.KEY, JSON.stringify(this.latLng));
        } else {
            this.latLng = null;
            localStorage.removeItem(Destination.KEY);
        }
    }

    remove() {
        this.set(null);
    }

    get() {
        return this.latLng;
    }
}
