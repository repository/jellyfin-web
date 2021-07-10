/**
 * Module that manages SyncPlay settings.
 * @module components/syncPlay/core/Settings
 */

import { Events, AppStorage } from 'jellyfin-apiclient';

/**
 * Class that manages SyncPlay settings.
 */
class SyncPlaySettings {
    constructor() {
        // Do nothing
    }

    /**
     * Gets the key used to store a setting in the App Storage.
     * @param {string} name The name of the setting.
     * @returns {string} The key.
     */
    getKey(name) {
        return 'syncPlay-' + name;
    }

    /**
     * Gets the value of a setting.
     * @param {string} name The name of the setting.
     * @returns {string} The value.
     */
    get(name) {
        return AppStorage.getItem(this.getKey(name));
    }

    /**
     * Sets the value of a setting. Triggers an update if the new value differs from the old one.
     * @param {string} name The name of the setting.
     * @param {Object} value The value of the setting.
     */
    set(name, value) {
        const oldValue = this.get(name);
        AppStorage.setItem(this.getKey(name), value);
        const newValue = this.get(name);

        if (oldValue !== newValue) {
            Events.trigger(this, name, [newValue, oldValue]);
        }

        console.debug(`SyncPlay Settings set: '${name}' from '${oldValue}' to '${newValue}'.`);
    }

    /**
     * Gets the value of a setting as boolean.
     * @param {string} name The name of the setting.
     * @param {boolean} defaultValue The default value if the setting does not exist.
     * @returns {boolean} The value.
     */
    getBool(name, defaultValue = false) {
        const value = this.get(name);
        if (value !== 'true' && value !== 'false') {
            return defaultValue;
        } else {
            return this.get(name) !== 'false';
        }
    }

    /**
     * Gets the value of a setting as float number.
     * @param {string} name The name of the setting.
     * @param {number} defaultValue The default value if the setting does not exist.
     * @returns {number} The value.
     */
    getFloat(name, defaultValue = 0) {
        const value = this.get(name);
        if (value === null || value === '' || isNaN(value)) {
            return defaultValue;
        } else {
            return Number.parseFloat(value);
        }
    }
}

/** SyncPlaySettings singleton. */
const Settings = new SyncPlaySettings();
export default Settings;
