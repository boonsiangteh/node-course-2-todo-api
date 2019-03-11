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
