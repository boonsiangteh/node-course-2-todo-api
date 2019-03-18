const {User} = require('../models/user');

// middleware for handling authentication
const authenticate = (req, res, next) => {
  // get token from x-auth header
  var token = req.header('x-auth');

  // find User by token (use custom function)
  User.findByToken(token).then((user) => {
    if (!user) {
      // by returning a reject(), the catch error can
      return Promise.reject();
    }

    // modify request object so that our get request can access it as well 
    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });
}

module.exports = {authenticate};
