module.exports = function(db) {
    const { MongoClient, ObjectId } = require('mongodb');
    const bcrypt = require('bcrypt');
  
    // Define a function to create a user
    async function createUser(username, password) {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user document
      const user = { username, password: hashedPassword };
  
      // Insert the new user into the 'users' collection
      const result = await db.collection('users').insertOne(user);
  
      return result;
    }
  
    async function validatePassword(username, password) {
        const user = await findUser(username);
        if (!user) {
          return false;
        }
        const isValid = await bcrypt.compare(password, user.password);
        return isValid;
      }

    // Define a function to find a user by username
    async function findUser(username) {
      const user = await db.collection('users').findOne({ username });
      return user;
    }
  
  return {
  createUser,
  findUser,
  validatePassword
};
  };
  