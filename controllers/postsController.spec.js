const expect = require('chai').expect;
const postsController = require('./postsController');
const dbInit = require('../db/dbInit');
const configs = require('../configs');

describe('postsController', function() {
  let initUsers = null, initPosts = null;
  beforeEach(function() {
    return dbInit.initDatabase((initData) => {
      initUsers = initData.initUsers;
      initPosts = initData.initPosts;
    });
  });
  describe('#findByParams()', function() {
    it('should return first 5 post by userId:1', function() {
      let params = {
        q: 'userId:(1)',
        sort: 'id',
        order: 'asc',
        page: 2
      }
      let req = {
        query: params,
        originalUrl: `/posts?q=${params.q}&page=${params.page}`
      }
      let expectedResponse = {
        entities: {
          posts: initPosts.filter(post => post.userId === 1).slice(5, 10)
        },
        links: {
          nextPage: configs.app.domain + `/posts?q=${params.q}&page=${params.page + 1}`
        }
      };
      return postsController.findByParams(req)
        .then(data => {
          expect(data).to.deep.equal(expectedResponse);
        });
    });
  });
});
