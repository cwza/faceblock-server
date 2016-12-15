const PARAMS = require('../Constants').PARAMS;
const values = require('lodash').values;
const Joi = require('joi');

const queryParamsSchema = Joi.object().keys({
  q: Joi.string().required(),
  sort: Joi.any().valid(values(PARAMS.SORT)).default(PARAMS.SORT.CREATE_TIME),
  order: Joi.any().valid(values(PARAMS.ORDER)).default(PARAMS.ORDER.DESC),
  limit: Joi.number().integer().positive().default(5),
  page: Joi.number().integer().positive().default(1),
  underNearId: Joi.number().integer(),
  upperNearId: Joi.number().integer(),
}).without('underNearId', 'upperNearId');

module.exports = {
  queryParamsSchema
}
