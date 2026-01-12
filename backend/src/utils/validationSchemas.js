const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const createGigSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    budget: Joi.number().required(),
});

const placeBidSchema = Joi.object({
    gigId: Joi.string().required(),
    message: Joi.string().required(),
    bidPrice: Joi.number().required(),
});

module.exports = {
    registerSchema,
    loginSchema,
    createGigSchema,
    placeBidSchema,
};
