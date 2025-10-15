const Joi = require('joi');

exports.createCollageSchema = Joi.object({
  collageName: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      "string.base": "Collage name must be a string",
      "string.empty": "Collage name is required",
      "string.min": "Collage name must be at least 2 characters",
      "string.max": "Collage name cannot exceed 255 characters",
      "any.required": "Collage name is required",
    }),
});

exports.createDepartmentSchema = Joi.object({
  departmentName: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      "string.base": "Department name must be a string",
      "string.empty": "Department name is required",
      "string.min": "Department name must be at least 2 characters",
      "string.max": "Department name cannot exceed 255 characters",
      "any.required": "Department name is required",
    }),
});