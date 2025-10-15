const Joi = require('joi');


exports.createProjectSchema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(3).max(512),
    date: Joi.date().required(),
    semester: Joi.valid('Winter', 'Spring', 'Summer', 'Autumn').required(),
    departmentId: Joi.number().positive().required(),
    supervisorId: Joi.number().positive().required(),
});


exports.updateProjectSchema = Joi.object({
    title: Joi.string().min(3).max(255),
    description: Joi.string().min(3).max(512),
    date: Joi.date(),
    semester: Joi.valid('Winter', 'Spring', 'Summer', 'Autumn'),
    departmentId: Joi.number().positive(),
    supervisorId: Joi.number().positive(),
    bookId: Joi.number().positive(),
    imageId: Joi.number().positive(),
    presentationId: Joi.number().positive(),
    grade: Joi.number().min(0).max(5),
    available: Joi.boolean(),
});


exports.createCategorySchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
});


exports.createKeywordSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
});


const Joi = require('joi');

exports.searchProjectSchema = Joi.object({
  // keyword من الـ params
  keyword: Joi.string()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.base': 'Keyword must be a string',
      'string.empty': 'Keyword is required',
      'string.min': 'Keyword must be at least 1 character',
      'string.max': 'Keyword cannot exceed 255 characters',
      'any.required': 'Keyword is required',
    }),

  // filters من query
  filters: Joi.object({
    collages: Joi.array()
      .items(Joi.string())
      .optional()
      .messages({
        'array.base': 'filters.collages must be an array of strings',
      }),

    departments: Joi.array()
      .items(Joi.string())
      .optional()
      .messages({
        'array.base': 'filters.departments must be an array of strings',
      }),

    categories: Joi.array()
      .items(Joi.string())
      .optional()
      .messages({
        'array.base': 'filters.categories must be an array of strings',
      }),

    ratingRange: Joi.object({
      min: Joi.number().min(0).optional(),
      max: Joi.number().max(5).optional(),
    }).optional(),
  }).optional(),

  // order من query
  order: Joi.object({
    by: Joi.string()
      .valid('date', 'ratingAverage', 'likesCount')
      .optional()
      .messages({
        'any.only': "Order.by must be one of: 'date', 'ratingAverage', 'likesCount'",
      }),
    dir: Joi.string()
      .valid('asc', 'desc')
      .optional()
      .messages({
        'any.only': "Order.dir must be either 'asc' or 'desc'",
      }),
  }).optional(),
});