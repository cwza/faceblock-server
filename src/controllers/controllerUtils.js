const utils = require('../utils');
const Errors = require('../Errors');

let validate = (obj , schema) => {
  try {
    obj = utils.validateObjectBySchema(obj, schema);
    return obj;
  } catch(error) {
    let err = Errors.validationError(error);
    throw err;
  }
}

module.exports = {
  validate
}
