const Joi = require('joi');

exports.postReplySchema = Joi.object({
    content: Joi.string()
        .min(1)
        .max(255)
        .required()
        .messages({
            "string.base": "Content must be a string",
            "string.empty": "Content is required",
            "string.min": "Content must be at least 1 character",
            "string.max": "Content cannot exceed 255 characters",
            "any.required": "Content is required",
        }),
});
