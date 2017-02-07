const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt } = require('graphql')
const logger = require('../../logger').logger;
const User = require('./User');

const postType = new GraphQLObjectType({
  description: 'A post from a user',
  name: 'Post',
  sqlTable: 'posts',
  uniqueKey: 'id',
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    content: {
      description: 'The content of the post',
      type: GraphQLString
    },
    user: {
      description: 'The user that created the post',
      type: User,
      sqlJoin: (postTable, userTable) => `${postTable}.user_id = ${userTable}.id`,
    },
    replyTo: {
      description: 'The post that reply to',
      type: postType,
      sqlColumn: 'reply_to',
      sqlJoin: (postTable, postTable2) => `${postTable}.reply_to = ${postTable2}.id`
    },
    createTime: {
      description: 'create time',
      sqlColumn: 'create_time',
      type: GraphQLString
    },
    updateTime: {
      description: 'update time',
      sqlColumn: 'update_time',
      type: GraphQLString
    }
  })
});

module.exports = postType;
