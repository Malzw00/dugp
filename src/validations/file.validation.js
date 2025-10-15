const Joi = require('joi');

exports.updateFileSchema = Joi.object({
    // File Validation will be in upload file middleware 
    // -------------------------------------------------
    name: Joi.string()
        .min(1)
        .max(255)
        .messages({
            "string.base": "File name must be a string",
            "string.empty": "File name cannot be empty",
            "string.min": "File name must be at least 1 character",
            "string.max": "File name cannot exceed 255 characters",
        }),
    category: Joi.string()
        .valid('book', 'presentation', 'image', 'reference')
        .messages({
            "any.only": "Category must be one of: book, presentation, image, reference",
        }),
});

exports.uploadFileSchema = Joi.object({
    category: Joi.string()
        .valid('book', 'presentation', 'image', 'reference')
        .required()
        .messages({
            "any.only": "Category must be one of: book, presentation, image, reference",
            "any.required": "Category is required",
        }),
});
