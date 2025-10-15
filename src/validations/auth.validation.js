const Joi = require("joi");


exports.registerSchema = Joi.object({
    fst_name: Joi.string().min(3).max(30).required().messages({
        "string.base": "First name must be a string",
        "string.empty": "First name is required",
        "string.min": "First name must be at least 3 characters",
        "any.required": "First name is required",
    }),
    lst_name: Joi.string().min(3).max(30).required().messages({
        "string.base": "Last name must be a string",
        "string.empty": "Last name is required",
        "string.min": "Last name must be at least 3 characters",
        "any.required": "Last name is required",
    }),
    account_email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
    password: Joi.string()
        .min(8)
        .max(64)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
        .messages({
            "string.min": "Password must be at least 8 characters",
            "string.max": "Password must not exceed 64 characters",
            "string.pattern.base": "Password must contain at least one letter and one number",
            "any.required": "Password is required",
        })
        .required(),
});

exports.loginSchema = Joi.object({
    account_email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required",
    }),
});

exports.forgotPasswordSchema = Joi.object({
    account_email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
    }),
});

exports.resetPasswordSchema = Joi.object({
    resetToken: Joi.string().required().messages({
        "any.required": "Reset token is required",
    }),
    newPassword: Joi.string()
        .min(8)
        .max(64)
        .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
        .messages({
            "string.min": "New password must be at least 8 characters",
            "string.max": "New password must not exceed 64 characters",
            "string.pattern.base": "New password must contain at least one letter and one number",
            "any.required": "New password is required",
        })
        .required(),
});
