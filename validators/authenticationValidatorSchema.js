const Joi = require('joi');

const loginSchema = Joi.object().keys({
  socialSite: Joi.string().required(),
  socialToken: Joi.string().required(),
});

module.exports = {
  loginSchema
}
