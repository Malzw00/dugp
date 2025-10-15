const Joi = require('joi');


exports.updateRoleSchema = Joi.object({
    role: Joi.string()
        .valid('admin', 'user', 'manager')
        .required()
        .messages({
            "any.only": "Role must be one of: admin, user, or manager",
            "any.required": "Role is required",
            "string.base": "Role must be a string",
        }),
});


exports.grantPermissionSchema = Joi.object({
    permissionId: Joi.string().required().messages({
        "string.base": "Permission ID must be a string",
        "string.guid": "Permission ID must be a valid UUID",
        "any.required": "Permission ID is required",
    }),
});