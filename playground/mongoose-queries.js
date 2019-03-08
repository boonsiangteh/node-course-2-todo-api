<<<<<<< HEAD
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
=======
const mongoose = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');

var id = "5c807a5fc0bf60219a385363";

// if (!ObjectID.isValid(id)) {
//   console.log("ID is invalid");
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log("Todos: ", todos);
// });
//
//
// Todo.findOne({
//   _id: id
// }).then((todos) => {
//   console.log("Todos findOne: ", todos);
// });


// Todo.findById(id).then((todos) => {
//   if (!todos) {
//     return console.log("Could not find todo");
//   }
//   console.log("Todos by Id: ", todos);
// }).catch((e) => console.log(e));


User.findById(id).then((user) => {
  if (!user) {
    console.log("no user found");
  }
  console.log(user);
}).catch((e) => console.log(e));
>>>>>>> 501ae9b7897a39d804cbb5adde81ba963cc9ff88
