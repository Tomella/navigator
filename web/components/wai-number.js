const bigFormatter =  new Intl.NumberFormat("en-AU", { stye: "decimal", maximumFractionDigits: 0});
const smallFormatter =  new Intl.NumberFormat("en-AU", { stye: "decimal", maximumFractionDigits: 1, minimumFractionDigits: 1});

const template = document.createElement('template');

template.innerHTML = `
<style> 
    .hide {
        display: none;
    }
</style>
<div style="text-align:center; font-weight:bold">
<span id="label"></span>&nbsp;<span id="number"></span>&nbsp;<span id="units"></span>
</div>
`;

customElements.define('wai-number', class WaiNumber extends HTMLElement {
    static get observedAttributes() { return ["number", "label", "units"]; }

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

    attributeChangedCallback(attr, oldValue, newValue) {
        this["_" + attr](newValue);
    }

    _units(value) {
        this.$("#units").innerHTML = value;
    }

    _label(value) {
        this.$("#label").innerHTML = value;
    }

    _number(value) {
        let container = this.$("div");
        if(value) {
            container.classList.remove("hide");
            let formatter = (Math.abs(value) >= 10)? bigFormatter: smallFormatter;
            this.$("#number").innerHTML = formatter.format(value);
        } else {
            container.classList.add("hide");            
        }
    }

    connectedCallback() {
        //this.shadowRoot.addEventListener('jobexpand', (e) => console.log(e));
    }
});
