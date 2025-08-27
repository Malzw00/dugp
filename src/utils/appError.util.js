
class AppError extends Error {
    /**
     * @param {ErrorTypes.ErrorDetails} errorDetails 
     * @param {Object} [extra]   - Optional extra info to override defaults
     *   e.g. { details: "...", meta: {...} }
     */
    constructor({ layer, module, method, publicMessage, severity, code, }, extra = {}) {
        
        this.layer = layer;
        this.module = module;
        this.method = method;
        this.publicMessage = publicMessage;
        this.severity = severity;
        this.message = `${method}${module}Failed`;
        this.code = code;
        this.extra = extra;
    }
}

module.exports = AppError;