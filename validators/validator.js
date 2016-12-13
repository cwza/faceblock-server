const expressValidator = require('express-validator')({
  customValidators: {
    isArray: function(param) {
      return Array.isArray(JSON.parse(param));
    },
    exactlyMatch: function(param, values) {
      return values.indexOf(param) !== -1;
    },
  }
});
// validate req by schema
// return a promise if validate failed throw error else donothing
let validate = (validator) => {
  req = validator();
  return req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      let error = {
        status: 400,
        errorCode: 400,
        message: 'Params Validation Error',
        longMessage: JSON.stringify(result.array())
      }
      throw error;
    }
  }).catch(error => {throw error});
}

module.exports = {
  expressValidator, validate
}
