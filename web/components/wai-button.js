const template = document.createElement('template');
template.innerHTML = `
<style>
    div {
        width: 80px;
        height: 80px;
        padding: 10px;
        cursor: pointer;
    }

    .disabled {
        cursor: not-allowed;
        opacity: 0.4;
    }
</style>
<div role="button"></div>
`;


customElements.define('wai-button', class WaiButton extends HTMLElement {
    static get observedAttributes() { return ['content', 'disabled']; }

    $(selector) {
        return this.shadowRoot && this.shadowRoot.querySelector(selector);
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

    _content(value) {
        this.$("div").innerHTML = value;
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

    connectedCallback() {
        this.$("div").addEventListener("click", (e) => {
            let disabled = this.getAttribute("disabled");
            if(disabled) {
                e.cancelBubble = true;
            }
        });
    }
});
