const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } = require('graphql')

const userType = new GraphQLObjectType({
  description: 'account',
  name: 'User',
  sqlTable: 'users',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    mail: {
      description: 'The mail of this user',
      type: GraphQLString
    },
    picture: {
      description: 'The picture url of this user',
      type: GraphQLString
    },
    followings: {
      description: 'Users that this user is following',
      type: new GraphQLList(userType),
      joinTable: 'follow_relations',
      sqlJoins: [
        (followerTable, followRelationTable) => `${followerTable}.id = ${followRelationTable}.follower_id`,
        (followRelationTable, followeeTable) => `${followRelationTable}.user_id = ${followeeTable}.id`
      ]
    },
    followers: {
      description: 'Users that this user\'s follower',
      type: new GraphQLList(userType),
      joinTable: 'follow_relations',
      sqlJoins: [
        (followerTable, followRelationTable) => `${followerTable}.id = ${followRelationTable}.user_id`,
        (followRelationTable, followeeTable) => `${followRelationTable}.follower_id = ${followeeTable}.id`
      ]
    },
    createTime: {
      description: 'create time',
      type: GraphQLString,
      sqlColumn: 'create_time',
    },
    updateTime: {
      description: 'update time',
      type: GraphQLString,
      sqlColumn: 'update_time',
    }
  })
});

module.exports = userType;
