const PARAMS = require('../Constants').PARAMS;

let findByParamsSchema = {
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
}

module.exports = {
  findByParamsSchema
}
