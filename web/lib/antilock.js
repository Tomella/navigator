export default class AntiLock {
    constructor() { 
        this.wakeLock = null;
    }

    set enable(value) {
        this._enable(value);
        return value;
    }

    async _enable(value) {
        if(this.isSupported) {
            if(value && !this.wakeLock) {
                try {
                    this.wakeLock = await navigator.wakeLock.request("screen");
                    return true;
                } catch (err) {
                    // The Wake Lock request has failed - usually system related, such as battery.
                    this.wakeLock = null;
                    return false;
                }
            } 
            if(!value && this.wakeLock) {
                await this.wakeLock.release();
                this.wakeLock = null;
                return value;
            }
            // Already in requested state
            return value;
        } else {
            return false;
        }
    }

    get isSupported() {
        return navigator && "wakeLock" in navigator;
    }
}
