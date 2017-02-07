const PARAMS = require('../Constants').PARAMS;
const values = require('lodash').values;
const Joi = require('joi');

const queryParamsSchema = Joi.object().keys({
  q: Joi.any().required(),
  sort: Joi.any().valid(values(PARAMS.SORT)).default(PARAMS.SORT.CREATE_TIME),
  order: Joi.any().valid(values(PARAMS.ORDER)).default(PARAMS.ORDER.DESC),
  limit: Joi.number().integer().positive().default(5),
  page: Joi.number().integer().positive().default(1),
  underNearId: Joi.number().integer(),
  upperNearId: Joi.number().integer(),
}).without('underNearId', 'upperNearId');

const idSchema = Joi.object().keys({
  id: Joi.number().integer().positive().required(),
});

const updateUserSchema = Joi.object().keys({
  id: Joi.number().integer().positive(),
  mail: Joi.string(),
  createTime: Joi.date(),
  updateTime: Joi.date(),
});

module.exports = {
  queryParamsSchema, idSchema, updateUserSchema
};
