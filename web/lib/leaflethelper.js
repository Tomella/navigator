L.LatLng.prototype.bearingTo = function(LatLng) {
    let d2r  = Math.PI / 180;
    let r2d  = 180 / Math.PI;
    let lat1 = this.lat * d2r;
    let lat2 = LatLng.lat * d2r;
    let dLon = (LatLng.lng-this.lng) * d2r;
    let y    = Math.sin(dLon) * Math.cos(lat2);
    let x    = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
    return (parseInt( Math.atan2(y, x) * r2d ) + 360 ) % 360;
};