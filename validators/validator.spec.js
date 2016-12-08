const expect = require('chai').expect;
const expressValidator = require('./validator').expressValidator;
const validate = require('./validator').validate;
const postsSchemas = require('./postsSchemas');

describe('validator', function() {
  let req = {
    query: {}
  };
  beforeEach(function(done) {
    expressValidator(req, {}, () => done());
  });
  describe('#postsSchema.findByParamsSchema', function() {
    req.query = {
      sort: 'id',
      order: 'esc',
      page: 'd',
    }
    it('should return error 400 for param error', function() {
      let expectedObject = {
        status: 400, errorCode: 400, message: 'Params Validation Error',
        longMessage: '[{"param":"order","msg":"Invalid param","value":"esc"},{"param":"page","msg":"Invalid param","value":"d"}]'
      }
      return validate(req, postsSchemas.findByParamsSchema)
        .then(() => {

        }).catch( error => {
          expect(error).to.deep.equal(expectedObject);
        });
    });
  });
});
