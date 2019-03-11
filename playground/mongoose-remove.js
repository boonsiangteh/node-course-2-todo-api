const mongoose = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');

// 3 ways to remove document in collection
// Todo.remove({}).then((todo) => {
//   if (!todo) {
//     console.log("no user found");
//   }
//   console.log(todo);
// }).catch((e) => console.log(e));

// Todo.findOneAndRemove({_id: "5c867374448bdd1686aa65e3"}).then((todo) => {
//   console.log(todo);
// });
//
Todo.findByIdAndRemove("5c865f03e9f289089424bd11").then((todo) => {
  console.log(todo);
});
