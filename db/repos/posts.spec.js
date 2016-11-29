const db = require('../').db;
const expect = require('chai').expect;
const dbInit = require('../dbInit');
const Constants = require('../../Constants');

describe('db.posts', function() {
  let initUsers = null, initPosts = null;

  beforeEach(function() {
    return dbInit.initDatabase((initData) => {
      initUsers = initData.initUsers;
      initPosts = initData.initPosts;
    });
  });
  describe('#customFind()', function() {
    it('find all posts by user Test user 1', function() {
      return db.posts.customFind(`where userId = '${initPosts[0].userid}'`)
      .then((posts) => {
        expect(posts.slice(0).sort((a, b) => a.id - b.id)).to.deep.equal(initPosts);
      });
    });
  });
  describe('#remove() & find()', function() {
    it('remove Test content1 and get null', function() {
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
      let postToBeAdd = {userid: initUsers[0].id, content: 'Test content3'};
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
    it('get posts by userIds orderby recent', function() {
      let params = Object.assign({}, db.posts.defaultParams, {userIds: initUsers.map((user) => user.id)});
      return db.posts.findByParams(params)
      .then((posts) => {
        expect(posts.slice(0).sort((a, b) => a.id - b.id)).to.deep.equal(initPosts);
      });
    });
  });
});
