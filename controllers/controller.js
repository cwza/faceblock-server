const utils = require('../utils');

let validate = (obj , schema) => {
  try {
    obj = utils.validateObjectBySchema(obj, schema);
    return obj;
  } catch(error) {
    error.status = 400, error.errorCode = 400;
    throw error;
  }
}

module.exports = {
  validate
}
