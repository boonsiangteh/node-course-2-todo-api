require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();

const port = process.env.PORT || 3005;
// use bodyParser middleware to
app.use(bodyParser.json());

// create a /todos route for post requests to create todos in our Todo collection in Mongodb
app.post("/todos", (req, res) => {
  var todo = new Todo({
    text: req.body.text
  })

  todo.save().then((doc) => {
    res.send(doc);
  }, (error) => {
    res.status(400).send(error);
  });
});

// get request for /todos route to get all todos
app.get('/todos', (req, res) => {
  // get all documents in Todo collection
  Todo.find().then((todos) => {
    res.send({todos});
  }, (err) => {
    res.send(err);
  })
})

// get request to get specific todo
app.get('/todos/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send();
  }
  // res.send(`id Valid: ${req.params.id}`);
  Todo.findById(req.params.id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => res.status(400).send());
});

// route to delete todos
app.delete('/todos/:id', (req, res) => {
  // cater for if id is invalid
  if(!ObjectID.isValid(req.params.id)){
    return res.status(400).send();
  }

  Todo.findByIdAndRemove(req.params.id).then((todo) => {
    // if todo doesn't exist, respond with 404
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo})
  }).catch((e) => res.status(400).send());
});

// route to update todos based on ID
app.patch('/todos/:id', (req, res) => {
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

  Todo.findByIdAndUpdate(hexId, {$set: body}, {new: true})
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({todo});
    })
    .catch((e) => res.status(400).send());


});


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});


module.exports = {app};
