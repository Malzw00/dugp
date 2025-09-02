const log = require("@utils/errorLogger.util");

module.exports = class ServiceErrorLogger {

    #layer;
    #module;

    constructor ({ module }) {
        this.#layer  = 'Service';
        this.#module = module;
    }

    log (method, error) {
        log({ layer: this.#layer, module: this.#module, method, error, });
        error.layer = this.#layer;
        error.module = this.#module;
        return error;
    }
}