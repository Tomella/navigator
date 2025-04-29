const template = document.createElement('template');

template.innerHTML = `
<style>
wai-number {
    position: absolute;
    top: 68px;
}
.hide {
    display: none;
}
</style>
<div id="target" class="hide">
    <wai-compass id="distCompass" direction="0"></wai-compass>
    <wai-number id="distance"  units="km" label="Distance:"></wai-number>
</div>
`;

customElements.define('wai-endpoint', class WaiEndpoint extends HTMLElement {
    static get observedAttributes() { return ["startlat", "startlng", "endlat", "endlng"]; }

    $(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector(selector)
    }

    constructor() {
        // Do something with the arguments
        super();
        // Normally you are adding the template
        const root = this.attachShadow({ mode: 'open' })
        root.appendChild(template.content.cloneNode(true));
        this._startlat = null;
        this._startlng = null;
        this._endlat   = null;
        this._endlng   = null;
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        // Lets make sure its a number
        if(!newValue) {
            this["_" + attr] = null;
            return;
        }
        this["_" + attr] = +newValue;
        this.calculateLatLng();

    }

    calculateLatLng() {
        this.start = null;
        this.end   = null;

        if(this._startlng !== null && this._startLat !== null) {
            this.start = L.latLng(this._startlat, this._startlng);
        }

        if(this._endlng !== null && this._endLat !== null) {
            this.end = L.latLng(this._endlat, this._endlng);
        }
        
        if(this.start && this.end) {
            this.distance = this.start.distanceTo(this.end);
            this.heading = this.start.bearingTo(this.end);
            this.$("#distance").setAttribute("number", this.distance / 1000); 
            this.$("#distCompass").setAttribute("direction", this.heading);
            this.$("#target").classList.remove("hide");
        } else {

            this.$("#target").classList.add("hide");
        }

    }


    connectedCallback() {
        //this.shadowRoot.addEventListener('jobexpand', (e) => console.log(e));
    }
});