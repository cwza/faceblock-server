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

const addPostSchema = Joi.object().keys({
  userId: Joi.number().integer().positive().required(),
  content: Joi.string().required(),
  replyTo: Joi.number().integer().positive().allow(null),
});

const idSchema = Joi.object().keys({
  id: Joi.number().integer().positive().required(),
});

const updatePostSchema = Joi.object().keys({
  id: Joi.number().integer().positive(),
  userId: Joi.number().integer().positive(),
  content: Joi.string(),
  replyTo: Joi.number().integer().positive().allow(null),
  createTime: Joi.date(),
  updateTime: Joi.date(),
});

module.exports = {
  queryParamsSchema, addPostSchema, idSchema, updatePostSchema
};
