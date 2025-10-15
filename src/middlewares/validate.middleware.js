// middleware/validate.middleware.js
// const Joi = require("joi");

/**
 * @middleware validate
 * @description Validates request data (body, query, params) using a Joi schema.
 * 
 * @usage
 *  router.post('/register', validate({ body: registerSchema }), controller);
 */
function validate(schemas = {}) {
    return (req, res, next) => {
        try {
            // Collect validation results
            const validations = [];

            if (schemas.body) {
                const { error } = schemas.body.validate(req.body, { abortEarly: false });
                if (error) validations.push(...error.details);
            }

            if (schemas.query) {
                const { error } = schemas.query.validate(req.query, { abortEarly: false });
                if (error) validations.push(...error.details);
            }

            if (schemas.params) {
                const { error } = schemas.params.validate(req.params, { abortEarly: false });
                if (error) validations.push(...error.details);
            }

            if (validations.length > 0) {
                return res.status(400).json({
                    success: false,
                    validationFailed: true,
                    message: "Validation failed",
                    errors: validations.map(v => ({
                        field: v.context?.key,
                        message: v.message.replace(/["]/g, ""),
                    })),
                });
            }

            next();

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error during validation",
            });
        }
    };
}

module.exports = validate;
