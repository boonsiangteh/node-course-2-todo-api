const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

const {ObjectID} = require('mongoose');

var id = '5c811c19470ef42d60629ff0';

Todo.find({
  _id: id
}).then((todo) => {
  console.log(todo);
});

Todo.findOne({
  _id: id
}).then((todo) => {
  console.log("todo findOne: ", todo);
});

Todo.findById(id)
  .then((todo) => {
    console.log("todo by ID: ", todo);
  });
