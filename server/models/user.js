const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// create a user schema to define shape of user document
var UserSchema = new mongoose.Schema({
  // implement validation for email through validator object
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
  }]
});

// create a custom function for our purpose
UserSchema.methods.generateAuthToken = function () {
  /*
  this refers to the user document created
  (documentation recommend not using arrow fn because it prevents binding this i.e we will not have access to the document object)
  */
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'somesecretsalt').toString();
  user.tokens = user.tokens.concat([{access, token}]);
  // return the token
  return user.save().then(() => {
    return token;
  });
}

// limit the information that gets sent back to client (only send id and email)
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
}

// define a custom function to find user by token provided in header
// returns a promise which can be chained
UserSchema.statics.findByToken = function (token) {
  // statics method binds the function to the Model, not the user document
  var User = this;
  var decode;

// user try catch block to catch errors and
// allow code to continue running even though we get errros
  try {
    decode =  jwt.verify(token, 'somesecretsalt');
  } catch (e) {
    // longer version of returning a Promise.reject()
    // return Promise(function (resolve, reject) {
    //   reject();
    // });

    // return reject to prevent code from continuing to User.findOne
    // since we are returning a promise, we can catch this error in the catch call in server.js
    return Promise.reject();
  }

  return User.findOne({
    '_id': decode._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

// create User model
var User = mongoose.model('User', UserSchema);

module.exports = {User};
