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

export default class BreadCrumb {
    constructor(map, config) {
        this.config = config;
        this.map = map;
        this.trail = [];
    }


    // Make up some arbitrary rules about which to keep. All driven from the config.
    // The distance has to be greater than the accuracy.
    // The time has to be greater than a threshold.
    // The distamce travelled has to greater than some lower limit.
    add(geolocation) {
        try {
            let coords = geolocation.coords;
            let lat = coords.latitude;
            let lng = coords.longitude;

            // Bail out early if the accuracy isn't good. Bigger is worse accuracy.
            if (coords.accuracy > this.config.accuracy) {
                console.log("Accuracy too low by ", coords.accuracy - this.config.accuracy);
                return;
            }

            let latLng = L.latLng(lat, lng);
            if (this.trail.length) {
                // We dont want all points there is a threshold in the config for how often we update the breadcrumb.
                let lastLocation = this.trail[this.trail.length - 1];
                if (this.config.minimumPeriod && geolocation.timestamp - lastLocation.timestamp >= this.config.minimumPeriod) {
                    // We don't really want to record an update unless we have travelled a minimum distance.
                    let lastLatLng = L.latLng(lastLocation.coords.latitude, lastLocation.coords.longitude);
                    if (this.config.minimumTravel < lastLatLng.distanceTo(latLng)) {
                        this.trail.push(geolocation);
                        this.polyline.addLatLng(latLng);
                        updateStorage(this);
                        console.log("Updated trail for breadcrumb.")
                    }
                }
            } else {
                // Do we have web storage?
                if (this.config.storage) {
                    let now = new Date();
                    let monthDay = now.getMonth() * 12 + now.getDate();
                    let tempTrail = localStorage.getItem("breadcrumbData");
                    try {
                        tempTrail = tempTrail ? JSON.parse(tempTrail) : tempTrail;
                        console.log("We have local storage", tempTrail);
                    } catch (e) {
                        console.log("Oh dear. The data was corrupt", tempTrail);
                        localStorage.removeItem("breadcrumbData");
                        tempTrail = null;
                    }
                    if (tempTrail) {
                        try {
                            this.trail = tempTrail.filter(location => {
                                let pointTime = new Date(location.timestamp);
                                let locationmonthDay = pointTime.getMonth() * 12 + pointTime.getDate();
                                return locationmonthDay == monthDay;
                            });
                        } catch (e) {
                            console.log("We've had difficulty filtering the locations", e);
                            localStorage.removeItem("breadcrumbData");
                            this.trail = [];
                        }
                    }
                    console.log("We have local storage 2", tempTrail);
                }
                this.trail.push(geolocation);
                this.polyline = L.polyline(this.all(), this.config.lineStyle).addTo(map);

                updateStorage(this);
                console.log("Started storage of breadcrumbs");
            }

            if(!this.marker) {
                this.marker = L.circleMarker(latLng, {radius: 6}).addTo(map);
            } else {
                this.marker.setLatLng(latLng);
            }

            function updateStorage(context) {
                console.log("Updating storage");
                if (context.config.storage) {
                    localStorage.setItem("breadcrumbData", JSON.stringify(context.trail));
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    all() {
        return this.trail.map(location => [location.coords.latitude, location.coords.longitude]);
    }
}
