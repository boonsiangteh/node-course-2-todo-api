const mongoose = require('mongoose');

// use Promise for mongoose instead of callbacks
mongoose.Promise = global.Promise;
// connect to database
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

module.exports = {mongoose};
