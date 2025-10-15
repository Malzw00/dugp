const Joi = require('joi');

exports.createSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name cannot exceed 30 characters",
    "any.required": "Name is required",
  }),
  fatherName: Joi.string().min(3).max(30).required().messages({
    "string.base": "Father name must be a string",
    "string.empty": "Father name is required",
    "string.min": "Father name must be at least 3 characters",
    "string.max": "Father name cannot exceed 30 characters",
    "any.required": "Father name is required",
  }),
  grandFatherName: Joi.string().min(3).max(30).required().messages({
    "string.base": "Grandfather name must be a string",
    "string.empty": "Grandfather name is required",
    "string.min": "Grandfather name must be at least 3 characters",
    "string.max": "Grandfather name cannot exceed 30 characters",
    "any.required": "Grandfather name is required",
  }),
  familyName: Joi.string().min(3).max(30).required().messages({
    "string.base": "Family name must be a string",
    "string.empty": "Family name is required",
    "string.min": "Family name must be at least 3 characters",
    "string.max": "Family name cannot exceed 30 characters",
    "any.required": "Family name is required",
  }),
  departmentId: Joi.number().required().messages({
    "number.base": "Department ID must be a number",
    "any.required": "Department ID is required",
  }),
});

exports.updateSchema = Joi.object({
  name: Joi.string().min(3).max(30).messages({
    "string.base": "Name must be a string",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name cannot exceed 30 characters",
  }),
  fatherName: Joi.string().min(3).max(30).messages({
    "string.base": "Father name must be a string",
    "string.min": "Father name must be at least 3 characters",
    "string.max": "Father name cannot exceed 30 characters",
  }),
  grandFatherName: Joi.string().min(3).max(30).messages({
    "string.base": "Grandfather name must be a string",
    "string.min": "Grandfather name must be at least 3 characters",
    "string.max": "Grandfather name cannot exceed 30 characters",
  }),
  familyName: Joi.string().min(3).max(30).messages({
    "string.base": "Family name must be a string",
    "string.min": "Family name must be at least 3 characters",
    "string.max": "Family name cannot exceed 30 characters",
  }),
  departmentId: Joi.number().messages({
    "number.base": "Department ID must be a number",
  }),
  accountId: Joi.number().messages({
    "number.base": "Account ID must be a number",
  }),
  imageId: Joi.number().messages({
    "number.base": "Image ID must be a number",
  }),
  title: Joi.string().min(1).max(50).messages({
    "string.base": "Title must be a string",
    "string.min": "Title must be at least 1 character",
    "string.max": "Title cannot exceed 50 characters",
  }),
});
