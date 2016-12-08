const db = require('../').db;
const expect = require('chai').expect;
const dbInit = require('../dbInit');
const Constants = require('../../Constants');
const utils = require('../../utils');

describe('db.posts', function() {
  let initUsers = null, initPosts = null;

  beforeEach(function() {
    return dbInit.initDatabase((initData) => {
      initUsers = initData.initUsers;
      initPosts = initData.initPosts;
    });
  });
  describe('#remove() & find()', function() {
    it('should remove Test post 1 and get null', function() {
      return db.tx(function *(t) {
        let deleteCount = yield db.posts.remove(initPosts[0].id);
        expect(deleteCount).to.equal(1);
        let post = yield db.posts.find(initPosts[0].id);
        expect(post).to.equal(null);
      });
    });
  });
  describe('#add() & get()', function() {
    it('add an post and then get it', function() {
      let postToBeAdd = {userId: initUsers[0].id, content: 'Test content3'};
      return db.tx(function *(t) {
        let postBeAdded = yield db.posts.add(postToBeAdd);
        return postBeAdded;
      })
      .then((postBeAdded) => {
        expect(postBeAdded.content).to.equal(postToBeAdd.content);
      });
    });
  });
  describe('#all()', function() {
    it('get all posts', function() {
      return db.posts.all()
      .then((posts) => {
        expect(posts.slice(0).sort((a, b) => a.id - b.id)).to.deep.equal(initPosts);
      });
    });
  });
  describe('#total()', function() {
    it('calculate count', function() {
      return db.posts.total()
      .then((total) => {
        expect(total).to.equal(initPosts.length);
      });
    });
  });
  describe('#findByParams()', function() {
    it('get posts by userIds orderby id asc at page 2 limit 5', function() {
      let expectedPosts = initPosts.filter(post => post.userId === 1).slice(5, 10);
      let params = {
        q: 'userId:(1)',
        sort: 'id',
        order: 'asc',
        page: 2
      };
      return db.posts.findByParams(params)
      .then(posts => {
        let postsWithoutScore = posts.map(post => utils.deletePropertiesFromObject(post, ['score']));
        expect(postsWithoutScore).to.deep.equal(expectedPosts);
      });
    });
  });
});
