require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT || 3005;
// use bodyParser middleware to parse request bodies into json
app.use(bodyParser.json());

// create /todos and make it private using authenticate
app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })

  todo.save().then((doc) => {
    res.send(doc);
  }, (error) => {
    res.status(400).send(error);
  });
});

// get request for /todos route to get all todos
app.get('/todos', authenticate, (req, res) => {
  // get all documents in Todo collection
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (err) => {
    res.send(err);
  })
});

// get request to get specific todo
app.get('/todos/:id', authenticate ,(req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send();
  }

  Todo.findOne({
    _id: req.params.id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => res.status(400).send());
});

// route to delete todos
app.delete('/todos/:id', authenticate ,(req, res) => {
  // cater for if id is invalid
  if(!ObjectID.isValid(req.params.id)){
    return res.status(400).send();
  }

  Todo.findOneAndRemove({
    _id: req.params.id,
    _creator: req.user._id
  }).then((todo) => {
    // if todo doesn't exist, respond with 404
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo})
  }).catch((e) => res.status(400).send());
});

// route to update todos based on ID
app.patch('/todos/:id', authenticate,(req, res) => {
  var hexId = req.params.id;

  // invalid object ID passed
  if (!ObjectID.isValid(hexId)) {
    return res.status(400).send();
  }

  // create object where we pick only the properties which we allow users to update
  var body = _.pick(req.body, ['text', 'completed']);
  // do some checking to see if todo.completed field is set to true
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
    _id: hexId,
    _creator: req.user._id
  }, {$set: body}, {new: true})
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({todo});
    })
    .catch((e) => res.status(400).send());
});

// POST /users (create new users)
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => res.status(400).send(e));
});

// GET user back after authenticating user through request header (using authenticate middleware)
app.get('/users/me', authenticate ,(req, res) => {
  res.send(req.user);
});

// login functionality for users
app.post('/users/login', (req, res) => {
  if (_.isEmpty(req.body) || req.body.email === "" || req.body.password === "") {
    return res.status(401).send("Must enter email and password");
  }

  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth',token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });

});

// delete token once user signs out
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
