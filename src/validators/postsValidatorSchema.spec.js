const expect = require('chai').expect;
const postsValidatorSchema = require('./postsValidatorSchema');
const utils = require('../utils');

describe('postsValidatorSchema', function() {
  let req = {
    query: {}
  };
  describe('#postsValidatorSchema.queryParamsSchema', function() {
    req.query = {
      q: 'xxx',
      sort: 'id',
      order: 'esc',
      page: 'd',
      verbos: 'verbos'
    }
    it('should return Validation Error for order string onlyallow', function() {
      let expectedErrorMessage = 'child "order" fails because ["order" must be one of [asc, desc]]';
      try {
        let result = utils.validateObjectBySchema(req.query, postsValidatorSchema.queryParamsSchema)
      } catch(error) {
        expect(error.message).to.be.equal(expectedErrorMessage);
      }
    });
  });
});
