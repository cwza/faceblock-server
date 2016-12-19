const utils = require('../utils');
const Constants = require('../Constants');

let validate = (obj , schema) => {
  try {
    obj = utils.validateObjectBySchema(obj, schema);
    return obj;
  } catch(error) {
    error.status = 400, error.errorCode = Constants.ERROR.VALIDATION_ERROR, error.name = 'VALIDATION_ERROR';
    throw error;
  }
}

module.exports = {
  validate
}
