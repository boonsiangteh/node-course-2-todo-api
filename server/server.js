const mongoose = require('mongoose');

// use Promise for mongoose instead of callbacks
mongoose.Promise = global.Promise;
// connect to database
mongoose.connect('mongodb://localhost:27017/TodoApp', {newUrlParser: true});

// create a Todo model using mongoose and specify its properties and types of properties
var Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: String
  }
});

// // create a document by creeating an instance of Todo model
// var newTodo = Todo({
//   text: "Cook dinner"
// });
//
// // save our new document to database
// newTodo.save().then((result) => {
//   console.log("Saved todo: ", result);
// }, (err) => {
//   console.log('unable to save todo');
// })

var otherTodo = Todo({
  text: "Play basketball",
  completed: true,
  completedAt: 120
});

otherTodo.save().then((result) => {
  console.log(JSON.stringify(result, undefined, 2));
}, (err) => {
  console.log("Unable to save to Todo");
});
