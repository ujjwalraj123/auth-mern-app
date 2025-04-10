const Joi = require('joi');

const taskCreateValidation = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(100).required(),
        description: Joi.string().max(500).optional()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: "Validation error", error });
    next();
};

const taskUpdateValidation = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(100).optional(),
        description: Joi.string().max(500).optional()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: "Validation error", error });
    next();
};

module.exports = { taskCreateValidation, taskUpdateValidation };