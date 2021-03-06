const PARAMS = require('../Constants').PARAMS;
const values = require('lodash').values;
const Joi = require('joi');

const queryParamsSchema = Joi.object().keys({
  q: Joi.any().required(),
  sort: Joi.any().valid(values(PARAMS.SORT)).default(PARAMS.SORT.CREATE_TIME),
  order: Joi.any().valid(values(PARAMS.ORDER)).default(PARAMS.ORDER.DESC),
  limit: Joi.number().integer().positive().default(null),
  page: Joi.number().integer().positive().default(1),
  underNearId: Joi.number().integer(),
  upperNearId: Joi.number().integer(),
}).without('underNearId', 'upperNearId')
  .with('limit', 'page');

const addFollowRelationSchema = Joi.object().keys({
  userId: Joi.number().integer().positive().required(),
  followerId: Joi.number().integer().positive().required(),
});

const idSchema = Joi.object().keys({
  id: Joi.number().integer().positive().required(),
});

module.exports = {
  queryParamsSchema, addFollowRelationSchema, idSchema
};
