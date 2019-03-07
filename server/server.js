const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();

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

app.listen(3005, () => {
  console.log("Started on port 3005");
})

module.exports = {app};
