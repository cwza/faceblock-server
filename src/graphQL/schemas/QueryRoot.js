const { GraphQLObjectType, GraphQLList, GraphQLString } =  require('graphql')
const joinMonster = require('join-monster').default;
const logger = require('../../logger').logger;
const db = require('../../db').dbRaw;
const User = require('./User');
const Post = require('./Post');

const options = { dialect: 'pg' }
module.exports = new GraphQLObjectType({
  description: 'global query object',
  name: 'Query',
  fields: () => ({
    echo: {
      type: GraphQLString,
      resolve: () => `Hello World`
    },
    users: {
      type: new GraphQLList(User),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster(resolveInfo, context, sql => {
          logger.debug('users sql: ', sql);
          return db.any(sql);
        }, options)
      }
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster(resolveInfo, context, sql => {
          logger.debug('posts sql: ', sql);
          return db.any(sql);
        }, options)
      }
    },
  })
})
