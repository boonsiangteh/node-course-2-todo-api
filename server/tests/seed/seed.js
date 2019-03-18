const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

// generate seed data for users for testing
const userArr = [{
  _id: userOneId,
  email: 'sherlock@email.com',
  password: 'redbeard',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId.toHexString(), access: 'auth'}, 'somesecretsalt').toString()
  }]
},{
  _id: userTwoId,
  email: 'johwatson@gmail.com',
  password: 'marywatson'
}]

// create a few example todos for testing GET requests
const todoArr = [
  {
    _id: new ObjectID(),
    text: "First todo"
  },
  {
    _id: new ObjectID(),
    text: "Second todo",
    completed: true,
    completedAt: 123
  }
];

const populateTodos = (done) => {
  // remove all the documents in our Todo collection by passing nothing into the object in remove fn
  Todo.remove({}).then(() => {
    return Todo.insertMany(todoArr);
  }).then(() => done());
}

// method to remove all existing user documents in collection and insert seed users for testing
const populateUsers = (done) => {
  User.remove({}).then(() => {
    // note: by calling save only then will middleware for hashing password be triggered. (insertMany will not trigger middleware)
    var userOne = new User(userArr[0]).save();
    var userTwo = new User(userArr[1]).save();

    // we are only going to execute further when userOne & userTwo have been resolved
    return  Promise.all([userOne, userTwo]);
  }).then(() => done());
}

module.exports = {todoArr, populateTodos, userArr, populateUsers};
