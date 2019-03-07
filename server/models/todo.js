const mongoose = require('mongoose');

// create a Todo model using mongoose and specify its properties and types of properties
const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: String,
    default: null
  }
});

module.exports = {Todo};
