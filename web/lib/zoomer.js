/*
 In the config, we expect
 1. map: A leaflet map
 2. zoominContent: The inner HTMl for the zoom in button
 3. zoomoutContent: The inner HTMl for the zoom out button button
 4. zoominId: ID of the zoom in button
 5. zoomoutId: ID of the zoom out button
 6. zoomLevels: An optional array of valid zooms for the events
*/

const DEFAULT_ZOOMS = [5, 7, 10, 13, 16, 18]

export default class Zoomer {
    constructor(config) {
        this.config = config;
        this.map = config.map;
        this.zoomLevels = config.zoomLevels ? config.zoomLevels : DEFAULT_ZOOMS;

        this.zoomIn = document.getElementById(config.zoominId);
        this.zoomOut = document.getElementById(config.zoomoutId);
        
        this.zoomIn.setAttribute("content", config.zoominContent);
        this.zoomOut.setAttribute("content", config.zoomoutContent);

        this.checkZoomRange();

        this.map.on("zoom", (ev) => {
            this.checkZoomRange();
        });

        this.zoomIn.addEventListener("click", (e) => {
            this.checkZoomRange(1);
        });
        
        this.zoomOut.addEventListener("click", (e) => {
            this.checkZoomRange(-1);
        });
    }

    checkZoomRange(inc = 0) {
        let zoom = this.map.getZoom();
        let levels = this.zoomLevels;

        if(inc) {
	        let value;
	        if(inc > 0) {
		        value = levels.find(e => e > zoom);
	        } else {
		        value = levels.findLast(e => e < zoom);
 	        }
            if(value != -1 && zoom != value) {
                zoom = value;
                this.map.setZoom(zoom);                
            }
        }

        if(zoom < levels[levels.length - 1]) {
            // Then max zoom is enabled
            this.zoomIn.removeAttribute("disabled");
        } else {
            // Max zoom to be disabled
            this.zoomIn.setAttribute("disabled", true);
        }

        if(zoom > levels[0]) {
            // Then min zoom is enabled
            this.zoomOut.removeAttribute("disabled");
        } else {
            // Min zoom to be disabled
            this.zoomOut.setAttribute("disabled", true);
        }
    }
}