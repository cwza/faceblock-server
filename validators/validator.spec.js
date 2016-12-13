const expect = require('chai').expect;
const expressValidator = require('./validator').expressValidator;
const validate = require('./validator').validate;
const postsValidator = require('./postsValidator');

describe('validator', function() {
  let req = {
    query: {}
  };
  beforeEach(function(done) {
    expressValidator(req, {}, () => done());
  });
  describe('#postsSchema.findByParamsSchema', function() {
    req.query = {
      q: 'xxx',
      sort: 'id',
      order: 'esc',
      page: 'd',
      verbos: 'verbos'
    }
    it('should return error 400 for param error', function() {
      let expectedObject = {
        status: 400, errorCode: 400, message: 'Params Validation Error',
        longMessage: '[{"param":"order","msg":"Invalid value","value":"esc"},{"param":"page","msg":"Invalid value","value":"d"}]'
      }
      return validate(req, postsValidator.validateFindByParams)
        .then(() => {

        }).catch( error => {
          // console.log(error);
          expect(error).to.deep.equal(expectedObject);
        });
    });
  });
});
