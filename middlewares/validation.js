const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// Custom validation for URLs
const validateURL = (value, helpers) => {
  if (
    validator.isURL(value, { protocols: ["http", "https"], require_tld: true })
  ) {
    return value;
  }
  return helpers.error("string.uri");
};

// Custom validation for emails
const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error("string.email");
};

// Custom validation for ObjectID (MongoDB ID)
const validateObjectId = (value, helpers) => {
  if (/^[a-f\d]{24}$/i.test(value)) {
    return value;
  }
  return helpers.error("string.hex");
};

// Validate clothing item creation (Added `weather` field)
const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required().messages({
      "any.only": 'The "weather" field must be one of: hot, warm, cold',
      "string.empty": 'The "weather" field must be filled in',
    }),
  }),
});

// Validate user registration
const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "Avatar URL is required.",
      "string.uri": "Avatar must be a valid URL.",
    }),
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": "Email is required.",
      "string.email": "Invalid email format.",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required.",
    }),
  }),
});

//  Validate user login
const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": "Email is required.",
      "string.email": "Invalid email format.",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required.",
    }),
  }),
});

// Validate ID params for routes (Renamed `id` → `itemId`)
const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().custom(validateObjectId).messages({
      "string.empty": "Item ID is required.",
      "string.hex": "Invalid ID format. Must be a 24-character hex string.",
    }),
  }),
});

module.exports = {
  validateClothingItem,
  validateUserInfo,
  validateUserLogin,
  validateId,
};
