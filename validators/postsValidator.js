const PARAMS = require('../Constants').PARAMS;
const values = require('lodash').values;

let validateFindByParams = req => {
  req.checkQuery('q').notEmpty();
  req.checkQuery('sort').optional().exactlyMatch(values(PARAMS.SORT));
  req.checkQuery('order').optional().exactlyMatch(values(PARAMS.ORDER));
  req.checkQuery('page').optional().isInt();
  req.checkQuery('limit').optional().isInt();
  req.checkQuery('upperNearId').optional().isInt();
  req.checkQuery('underNearId').optional().isInt();
}

module.exports = {
  validateFindByParams
}
