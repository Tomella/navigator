export default class Eventer {
    on(type, fn) {
		if (typeof fn !== 'function') {
			console.warn(`wrong listener type: ${typeof fn}`);
			return;
		}

        this._events = this._events || {};
		this._events[type] = this._events[type] || [];
        if(!this._events[type].find(el => el === fn)) {
            this._events[type].push(fn);
        }
	}

    dispatchEvent(event) {
		if (!this._events) {
			return;
		}

        let type = event.type;
		let listeners = this._events[type];

		if (!listeners) {
			return;
		}

        listeners.forEach(element => {
            element(event);
        });
    }
    
	off(type, fn = null) {
		if (!this._events) {
			return;
		}

		let listeners = this._events[type];
		if (!listeners) {
			return;
		}

		if(!fn) { // remove all
			// clear all listeners for a type if function isn't specified
			delete this._events[type];
			return;
		}

        this.events[type] = listeners.reduce((acc, el) => {
            if(el !== fn) {
                acc.push(fn);
            }
            return acc;
        });
	}
}