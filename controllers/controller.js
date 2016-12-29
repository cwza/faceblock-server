const utils = require('../utils');
const Constants = require('../Constants');
const Errors = require('../Errors');

let validate = (obj , schema) => {
  try {
    obj = utils.validateObjectBySchema(obj, schema);
    return obj;
  } catch(error) {
    error = Errors.validationError(error);
    throw error;
  }
}

module.exports = {
  validate
}
