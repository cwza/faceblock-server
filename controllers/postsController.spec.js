const expect = require('chai').expect;
const postsController = require('./postsController');
const dbInit = require('../db/dbInit');

describe('db.posts', function() {
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
      return postsController.findByParams(params)
        .then(data => {
          console.log(data);
        });
    });
  });
});
