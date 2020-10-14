const Joi = require('joi');

const campSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string().required(),
  }).required(),
});

module.exports.campSchema = campSchema;
