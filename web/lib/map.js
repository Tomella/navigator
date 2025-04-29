import Eventer from "./eventer.js";

export default class Map extends Eventer {
   constructor(config) {
      super(); 
      this.config = config;
   }
   create() {
      let config = this.config;
      this.map = L.map(config.id, config.options);
      window.map = this.map;
      config.layers.forEach(layer => {
         this.addLayer(layer);
      });

      if(config.scale) {
         L.control.scale(config.scale).addTo(this.map);
      }

      if(config.measure) {
         L.control.polylineMeasure(config.measure).addTo(this.map);
         this.map.on('polylinemeasure:start', currentLine => {
            this.dispatchEvent(new CustomEvent("measure-start", {
               composed: true,
               bubbles: true,
               detail: {name: "measure-start"}
            }));
         });
         this.map.on('polylinemeasure:finish', currentLine => {
            this.dispatchEvent(new CustomEvent("measure-finish", {
               composed: true,
               bubbles: true,
               detail: {name: "measure-finish"}
            }));
         });
         this.map.on('polylinemeasure:toggle', evt => {
            this.dispatchEvent(new CustomEvent("measure-toggle", {
               composed: true,
               bubbles: true,
               detail: {name: "measure-toggle", enabled: evt.status}
            }));
         });
      }
   }

   addLayer(config) {
      let layer =  L[config.type](config.url, config.options);
      layer.addTo(this.map);
      return layer;
   }
}