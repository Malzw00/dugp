/**
 * @middleware requestLogger
 * @description Logs incoming HTTP requests with method, full URL, params, query, and body.
 *              Intended for debugging and development purposes.
 */

const SENSITIVE_FIELDS = [
    'password',
    'token',
    'accessToken',
    'refreshToken',
    'authorization'
];

/**
 * Masks sensitive fields in an object.
 * @param {Object} data
 * @returns {Object}
 */
function maskSensitiveData(data) {
    if (!data || typeof data !== 'object') return data;

    const cloned = Array.isArray(data) ? [...data] : { ...data };

    for (const key of Object.keys(cloned)) {
        if (SENSITIVE_FIELDS.includes(key.toLowerCase())) {
            cloned[key] = '***MASKED***';
        } else if (typeof cloned[key] === 'object') {
            cloned[key] = maskSensitiveData(cloned[key]);
        }
    }

    return cloned;
}

/**
 * Pretty print helper
 * @param {Object} data
 * @returns {string}
 */
function pretty(data) {
    return JSON.stringify(data, null, 2);
}

module.exports = function requestLogger(req, res, next) {

    // يمكن تعطيله في الإنتاج إن رغبت
    if (process.env.NODE_ENV === 'production') {
        return next();
    }

    const startTime = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - startTime;

        console.log('\n═══════════════ HTTP REQUEST ═══════════════');
        console.log('🕒 Time      :', new Date().toISOString());
        console.log('➡️  Method   :', req.method);
        console.log('🌐 URL      :', req.originalUrl);
        console.log('📦 Status   :', res.statusCode);
        console.log('⏱️  Duration :', `${duration} ms`);
        console.log('🔗 Params   :', pretty(req.params));
        console.log('🔍 Query    :', pretty(req.query));
        console.log(
            '📝 Body     :',
            pretty(maskSensitiveData(req.body))
        );
        console.log('════════════════════════════════════════════\n');
    });

    next();
};
