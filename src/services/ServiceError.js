class ServiceError extends Error {


    /**
     * 
     * @param {string} serviceName 
     * @param {string} methodName 
     * @param {{
     *  message: string,
     *  code: string,
     *  type: string,
     *  details: string,
     *  original: string
     * }} error 
     */
    constructor(serviceName, methodName, error) {
        super(error.message || "Unknown Service Error");

        this.name = "ServiceError";
        this.service = serviceName;
        this.method = methodName;
        this.type = error.type || "UNKNOWN_ERROR_TYPE";
        this.code = 'S' + serviceName.charAt(0) + methodName.charAt(0);
        this.details = error.details || null;
        this.original = error.original || null;
        this.timestamp = new Date();
    }

    toJSON() {
        return {
            name: this.name,
            service: this.service,
            method: this.method,
            code: this.code,
            message: this.message,
            details: this.details,
            timestamp: this.timestamp,
        };
    }
}

module.exports = ServiceError;
