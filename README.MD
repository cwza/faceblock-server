Restful API Server for [faceblock-client](https://github.com/cwza/faceblock-client)

# Features
* posts CRUD
* users CRUD
* followRelations CRUD
* google oauth2 and jwt authentication
* basic graphql query

# Library
* Docker:
  zombodb

* DB:
  postgres, elasticsearch, zombodb, pg-promise

* Restful:
  express

* GraphQL:
  graphql, express-graphql, graphql-relay, join-monster

* Validator:
  Joi

* Authentication:
  google OAuth2.0, jwtwebtoken

* Test:
  Mocha, Chai, supertest

* Log:
  winston

* Deploy:
  Digital Ocean, Namecheap, sslforfree

# API
## Restful
### get posts
Request:
``` js
const API_ROOT = 'http://localhost:3001/api/';
const q = encodeURIComponent(`userId:(${userId}) and replyTo:(null) or #${userName}`);
const queryStr = `q=${q}&sort=createTime&order=desc&limit=5`;
const fullUrl = API_ROOT + 'posts?' + queryStr;
fetch(fullUrl, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "faceblock-token": getFaceblockTokenFromLocalStorage(),
  }
})
```
Response:
``` js
{
  "entities": {
    "posts": [
      {
        "id": 35,
        "userId": 2,
        "content": "Test content t35",
        "createTime": "2016-12-21T07:00:39.650Z",
        "updateTime": "2016-12-21T07:00:39.650Z"
      },
      {
        "id": 34,
        "userId": 2,
        "content": "Test content t34",
        "createTime": "2016-12-21T07:00:39.650Z",
        "updateTime": "2016-12-21T07:00:39.650Z"
      },
    ]
  }
}
```
## graphql
### get users
Request:
``` js
const fullUrl = 'http://localhost:3001/graphql';
const queryStr = ` {
  users {
    id
    mail
    followings {
      id
      mail
    }
    followers {
      id
      mail
    }
  }
}
`
fetch(fullUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "faceblock-token": getFaceblockTokenFromLocalStorage(),
  },
  body: JSON.stringify({ query: queryStr }),
})
```
Response:
``` js
{
  "data": {
    "users": [
      {
        "id": 1,
        "mail": "t1@gmail.com",
        "followings": [
          {
            "id": 20,
            "mail": "t20@gmail.com"
          }
        ],
        "followers": [
          {
            "id": 21,
            "mail": "cwz0205a@gmail.com"
          }
        ]
      },
      {
        "id": 2,
        "mail": "t2@gmail.com",
        "followings": [
          {
            "id": 20,
            "mail": "t20@gmail.com"
          }
        ],
        "followers": []
      },
    ]
  }
}
```
