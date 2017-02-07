const { GraphQLSchema } = require('graphql')

const QueryRoot  = require('./QueryRoot')

module.exports = new GraphQLSchema({
  description: 'faceblock graphql api',
  query: QueryRoot
})
