const mongoose = require('mongoose');

// use Promise for mongoose instead of callbacks
mongoose.Promise = global.Promise;
// connect to database
mongoose.connect('mongodb://localhost:27017/TodoApp', {newUrlParser: true});

module.exports = {mongoose};
