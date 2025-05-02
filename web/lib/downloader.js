export default class Downloader {
    constructor(dataSource) {        
        let target = document.querySelector("wai-download");
        let date =new Date();

        let download = "track_" + (date.getFullYear() +
            String(date.getMonth() + 1).padStart(2, 0) +
            String(date.getDate()).padStart(2, 0)) + ".geojson";
        target.setAttribute("download", download);
    
        target.addEventListener("click", ev => {
            let geoJson = dataSource.toGeoJSON();       
            target.setAttribute("content", JSON.stringify(geoJson));
        })
    }
}
