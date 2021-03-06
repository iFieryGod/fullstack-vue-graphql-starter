const { ApolloServer, AuthenticationError } = require('apollo-server');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Import typeDefs and resolvers
const filePath = path.join(__dirname, 'typeDefs.gql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');
const resolvers = require('./resolvers');

// Import Enviroment Variables and Mongoose Models
require('dotenv').config({ path: '.env'});
const User = require('./models/User');
const Post = require('./models/Post');

// Connect to Mongoose 
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
})
.then(() => { console.log("DB Connected") })
.catch((err) => { console.log(err) });

// Verify JWT Token passed from client
const getUser = async token => {
  if(token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (err) {
      throw new AuthenticationError('Your session has ended. sign in again.');
    }
  }
}

// Create Apollo/GraphQl Server using typeDefs, resolvers, context object
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => ({ name: error.name, message: error.message.replace("Context creation failed:", '')}),
  context: async ({ req }) => {
    const token = req.headers['authorization'];
    return { User, Post, currentUser: await getUser(token) }
    } 
});

server.listen().then(({url}) =>{
  console.log(`Server is listening on port ${url}`)
});