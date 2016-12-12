const PARAMS = require('../Constants').PARAMS;

let findByParamsSchema = {
  'q': {
    in: 'query',
    notEmpty: {}
  },
  'sort': {
    in: 'query',
    optional: true,
    exactlyMatch: {
      options: [[PARAMS.SORT.CREATED_TIME, PARAMS.SORT.ID]]
    }
  },
  'order': {
    in: 'query',
    optional: true,
    exactlyMatch: {
      options: [[PARAMS.ORDER.ASC, PARAMS.ORDER.DESC]]
    }
  },
  'page': {
    in: 'query',
    optional: true,
    isInt: {}
  },
  'limit': {
    in: 'query',
    optional: true,
    isInt: {}
  },
  'upperNearId': {
    in: 'query',
    optional: true,
    isInt: {}
  },
  'underNearId': {
    in: 'query',
    optional: true,
    isInt: {}
  }
}

module.exports = {
  findByParamsSchema
}
