const Joi = require('joi');


exports.offsetLimitSchema = Joi.object({
    offset: Joi.number().positive(),
    limit:  Joi.number().positive(),
});