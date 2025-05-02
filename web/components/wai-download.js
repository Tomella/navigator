const ICON = `
<svg width="60px" height="60px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <g>
        <path d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
        <g>
           <polyline fill="none" points="7.9 12.3 12 16.3 16.1 12.3" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
           <line fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" x1="12" x2="12" y1="2.7" y2="14.2"/>
        </g>
    </g>
</svg>
`;

const template = document.createElement('template');
template.innerHTML = `
<div style="position:fixed; right:10px; bottom:60px; cursor: pointer" title="Download breadcrumb line as GeoJSON">
    <wai-button id="downloader"></wai-button>
    <a download="breadcrumb.geojson" id="downloaderTarget" style="display: none"></a>
</div>
`;

customElements.define('wai-download', class WaiButton extends HTMLElement {
    static get observedAttributes() { return ['disabled', 'content', 'download']; }

    $(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector(selector)
    }

    constructor() {
        // Do something with the arguments
        super();
        // Normally you are adding the template
        const root = this.attachShadow({ mode: 'open' })
        root.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.$("wai-button").setAttribute("content", ICON);

        this.$("div").addEventListener("click", (e) => {
            let disabled = this.getAttribute("disabled");
            if(disabled) {
                e.cancelBubble = true;
            }
        });
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        this["_" + attr](newValue);
    }

    _content(data) {
        let link = this.$("a");

        let blob = new Blob([data], {type: 'text/plain'});

        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (this.text) {
            window.URL.revokeObjectURL(this.text);
        }
        let date =new Date();
        let name = this.name ? this.name : "data_" + (date.getFullYear() + String(date.getMonth() + 1).padStart(2, 0) + String(date.getDate()).padStart(2, 0)) + ".txt";
        link.download = name;
        link.href = this.text = window.URL.createObjectURL(blob);
        link.click();
    }

    _download(name) {
        this.name = name;
    }

    _disabled(value) {
        let classList = this.$("div").classList;
        if(value) {
            classList.add("disabled");
        } else {
            classList.remove("disabled");
        }
        console.log("disabled = " + value);
    }
});
