const template = document.createElement('template');

template.innerHTML = `
<style>
svg {
    position:absolute;
    left:0; 
    top:0; 
    width:100%; 
    height:100%
}

.rotate {
  transform-box: fill-box;
  transform-origin: center;
}
</style>
<svg xmlns="http://www.w3.org/2000/svg" class="rotate" width="560px" height="560px" viewBox="0 0 560 560">
     <path stroke-width="35" fill="#FFF" stroke="#000" d="M280,40L522,525L280,420L38,525z"/>
</svg>
`;

customElements.define('wai-compass', class WaiCompass extends HTMLElement {
    static get observedAttributes() { return ["direction"]; }

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

    _direction(value) {
        let svg = this.$("svg");
        svg.style.transform = "rotate(" + value + "deg)"
    }

    connectedCallback() {
        //this.shadowRoot.addEventListener('jobexpand', (e) => console.log(e));
    }

});
