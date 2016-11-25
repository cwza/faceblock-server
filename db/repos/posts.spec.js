let db = require('../').db;
let expect = require('chai').expect;

describe('db.posts', function() {
  let initUser = null, initPosts = null;

  function *initTable() {
    yield db.database.dropAllTable();
    yield db.database.createAllTable();
  }
  function *initData() {
    initUser = {mail: 'Test user 1'};
    initPosts = [{content: 'Test content1'}, {content: 'Test content2'}];
    yield db.users.add(initUser)
    .then((user) => {
      initUser = user;
    });
    initPosts.forEach((post) => post.userId = initUser.id);
    yield* initPosts.map((post, i) => {
      return db.posts.add(post)
      .then((returnedPost) => {
        initPosts[i] = returnedPost;
      });
    });
  }
  beforeEach(function() {
    return db.tx(function *(t) {
      yield* initTable();
      yield* initData();
    });
  });
  describe('#customFind()', function() {
    it('find all posts by user Test user 1', function() {
      return db.posts.customFind(`where userId = '${initPosts[0].userid}'`)
      .then((posts) => {
        expect(posts).to.deep.equal(initPosts);
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
      let postToBeAdd = {userid: initUser.id, content: 'Test content3'};
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
        expect(posts).to.have.length(initPosts.length);
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
});
