const db = require('./').db;
const _ = require('lodash');

let initUsers = null, initPosts = null;
let dummy_num = 1;

let genUsers = (n) => {
  let users = _.range(dummy_num, dummy_num + n).map( num => {
    return { mail: 'Test user t' + num }
  });
  dummy_num += n;
  return users;
}

let genPosts = (n, userId) => {
  let posts = _.range(dummy_num, dummy_num + n).map( num => {
    return {
      content: 'Test content t' + num, userId
    }
  });
  dummy_num += n;
  return posts;
}

function *initTable() {
  yield db.database.createAllTable();
  yield db.database.truncateAllTable();
}

function *initUsersData() {
  initUsers = genUsers(3);
  yield* initUsers.map((user, i) => {
    return db.users.add(user)
    .then((returnedUser) => {
      initUsers[i] = returnedUser;
    });
  });
  dummy_num = 1;
  initUsers.sort((a, b) => a.id - b.id);
}

function *initPostsData() {
  initPosts = [...genPosts(25, initUsers[0].id), ...genPosts(10, initUsers[1].id)];
  yield* initPosts.map((post, i) => {
    return db.posts.add(post)
    .then((returnedPost) => {
      initPosts[i] = returnedPost;
    });
  });
  dummy_num = 1;
  initPosts.sort((a, b) => a.id - b.id);
}

function *initTestData() {
  yield* initUsersData();
  yield* initPostsData();
}

// delete all table, recreate table, and add test data to tables.
// return id sorted initUsers, initPosts by callback
let initDatabase = (resolver = null) => {
  return db.tx(function *(t) {
    yield* initTable();
    yield* initTestData();
  })
  .then(() => {
    resolver? resolver({initUsers, initPosts}): console.log('init database end');
  });
}

module.exports = {
  initDatabase,
}
