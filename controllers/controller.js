const utils = require('../utils');
const Constants = require('../Constants');

let validate = (obj , schema) => {
  try {
    obj = utils.validateObjectBySchema(obj, schema);
    return obj;
  } catch(error) {
    error.status = 400, error.errorCode = Constants.ERROR.VALIDATION_ERROR.code, error.name = Constants.ERROR.VALIDATION_ERROR.name;
    throw error;
  }
}

module.exports = {
  validate
}
