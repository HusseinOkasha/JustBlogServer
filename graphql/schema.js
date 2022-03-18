const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    
    type Post{
        id:ID!
        body : String!
    }
    type authData{
        token:String!
        userId: String!
    }
    input UserInputData{
        email: String!
        firstName: String!
        lastName: String!
        password: String!
    }
    type PostData{
        posts:[Post!]!
    }
    type User{
        id:ID!
        name: String!
        email: String!
        password: String!
        status: String!
        firstName: String!
        posts: [Post!]!
    }
    type rootMutation{
        createUser(userInput: UserInputData):User! 
        createPost(body: String!): Post! 
    }
    type rootQuery{
        login(email: String!, password:String!): authData!
        posts:PostData!
    }
    schema{
        mutation: rootMutation
        query: rootQuery 
    }
`);
