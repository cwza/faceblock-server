const expect = require('chai').expect;
const postsController = require('./postsController');
const dbInit = require('../db/dbInit');

describe('postsController', function() {
  let initUsers = null, initPosts = null;
  beforeEach(function() {
    return dbInit.initDatabase((initData) => {
      initUsers = initData.initUsers;
      initPosts = initData.initPosts;
    });
  });
  describe('#findByParams()', function() {
    it('just test', function() {
      let params = {
        userids: [1],
        sort: 'id',
        order: 'asc',
        page: 2
      }
      let req = {
        query: params
      }
      let expectedResponse = initPosts.filter(post => params.userids.indexOf(post.userid) !== -1).slice(5, 10);
      return postsController.findByParams(req)
        .then(data => {
          expect(data).to.deep.equal(expectedResponse);
        });
    });
  });
});
