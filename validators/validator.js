// validate req by schema
// return a promise if validate failed throw error else donothing
let validate = (req, next, schema) => {
  req.check(schema);
  return req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      let error = {
        status: 400,
        message: 'Params Validation Error',
        longMessage: result.array()
      }
      throw error;
    }
  }).catch(error => {throw error});
}

module.exports = validate;
