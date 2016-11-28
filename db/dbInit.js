let db = require('./').db;

let initUsers = null, initPosts = null;

function *initTable() {
  yield db.database.dropAllTable();
  yield db.database.createAllTable();
}

function *initTestData() {
  initUsers = [{mail: 'Test user 1'}, {mail: 'Test user 2'}];
  initPosts = [{content: 'Test content1'}, {content: 'Test content2'}];
  yield* initUsers.map((user, i) => {
    return db.users.add(user)
    .then((returnedUser) => {
      initUsers[i] = returnedUser;
    });
  });
  initPosts.forEach((post) => post.userId = initUsers[0].id);
  yield* initPosts.map((post, i) => {
    return db.posts.add(post)
    .then((returnedPost) => {
      initPosts[i] = returnedPost;
    });
  });
}

// delete all table, recreate table, and add test data to tables.
let initDatabase = (resolver = null) => {
  return db.tx(function *(t) {
    yield* initTable();
    yield* initTestData();
  })
  .then(() => {
    initUsers.sort((a, b) => a.id - b.id);
    initPosts.sort((a, b) => a.id - b.id);
    resolver? resolver({initUsers, initPosts}): console.log('init database end'));
  });
}

module.exports = {
  initDatabase,
}
