// /middleware/GeneralRateLimiter.js
const { RateLimiterMemory } = require('rate-limiter-flexible');

const generalRateLimiter = new RateLimiterMemory({
    points: 100,     // عدد الطلبات المسموح بها
    duration: 60     // خلال 60 ثانية
});



module.exports = () => {
    return async function GeneralRateLimiter(req, res, next) {
    
        try {
            
            // check for ip's points
            await generalRateLimiter.consume(req.ip);
            
            // go to next middleware
            next();
            
        } catch (rateLimiterRes) {
            
            // return retry-after to client. 
            res.set('Retry-After', String(Math.ceil(rateLimiterRes.msBeforeNext / 1000)));

            // error message. 
            res.status(429).json({
                message: 'You have exceeded the maximum number of requests. Please try again later.',
            });
            
            // print ip of exceeder. 
            console.warn(`Rate limit exceeded: ${req.ip}`);
        }
    }
};
