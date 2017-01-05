const db = require('./').db;
const _ = require('lodash');

let initUsers = null, initPosts = null, initFollowRelations = null;
let dummy_num = 1;

let genUsers = (n) => {
  let users = _.range(dummy_num, dummy_num + n).map( num => {
    return { mail: 't' + num + '@gmail.com'}
  });
  dummy_num += n;
  return users;
}

let genPosts = (n, userId) => {
  let posts = _.range(dummy_num, dummy_num + n).map( num => {
    return {
      content: 'Test content t' + num, userId,
    }
  });
  dummy_num += n;
  return posts;
}

let genFollowRelations = (n, userId) => {
  let followRelations = _.range(dummy_num, dummy_num + n).map( num => {
    return {
      userId, followerId: num
    }
  });
  dummy_num += n;
  return followRelations;
}

function *initTable(t) {
  yield t.database.createAllTable();
  yield t.database.truncateAllTable();
}

function *initUsersData(t) {
  initUsers = genUsers(20);
    yield t.users.addMulti(initUsers)
    .then((returnedUsers) => {
      initUsers = returnedUsers;
    });
  dummy_num = 1;
  initUsers.sort((a, b) => a.id - b.id);
}

function *initPostsData(t) {
  initPosts = [...genPosts(25, initUsers[0].id), ...genPosts(10, initUsers[1].id)];
  yield t.posts.addMulti(initPosts)
  .then((returnedPosts) => {
    initPosts = returnedPosts;
  });
  dummy_num = 1;
  initPosts.sort((a, b) => a.id - b.id);
}

function * initFollowRelationsData(t) {
  initFollowRelations = [...genFollowRelations(10, initUsers[19].id)]
  yield t.followRelations.addMulti(initFollowRelations)
  .then((returnedFollowRelations) => {
    initFollowRelations = returnedFollowRelations;
  });
  dummy_num = 1;
  initFollowRelations.sort((a, b) => a.id - b.id);
}

function *initTestData(t) {
  yield* initUsersData(t);
  yield* initPostsData(t);
  yield* initFollowRelationsData(t);
}

// delete all table, recreate table, and add test data to tables.
// return id sorted initUsers, initPosts by callback
let initDatabase = (resolver = null) => {
  return db.tx(function *(t) {
    yield* initTable(t);
    yield* initTestData(t);
  })
  .then(() => {
    resolver? resolver({initUsers, initPosts, initFollowRelations}): console.log('init database end');
  });
}

module.exports = {
  initDatabase, initTestData, initUsersData, initPostsData, initFollowRelationsData
}
