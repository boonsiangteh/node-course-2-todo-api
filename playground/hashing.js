const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

// we will use the jsonwebtoken library to help us authenticate users
var data = {
  id: 10
}
// to create a hash (this is actually more complicated than our basic implementation)
var token = jwt.sign(data, 'somesecretsalt');
console.log("json web token: ",token);

var decoded = jwt.verify(token, 'somesecretsalt');
console.log('decoded:  ', decoded);


// /*
// the code below only serve to illustrate the basics of how authentication and web tokens work :)
// we will actually be using the jsonwebtoken library above to help us do a better job
// */
// var message = 'i am user 3';
// var hash = SHA256(message).toString();
// console.log(hash);
//
// // concept of jason web token authentication
// var data = {
//   id: 4
// }
// /*
// instead of sending data object back to user, we send a web token with the data and hash of the data object
// usually the hash will be added with a salt for enhanced security purposes
// (this makes it harder for users to manipulate and trick our system)
// */
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecretsalt').toString()
// }
//
// // when users submit a request (e.g delete todos), we will compare the web token
// var resultHash =  SHA256(JSON.stringify(token.data) + 'somesecretsalt').toString();
// /*
// this is basically the way we verify the data that the user sent to us,
// users won't have the salt and the hash will be different if they manipulate the web token we sent to them
// */
// if (resultHash === token.hash) {
//   console.log("data is secure");
// } else {
//   console.log("data was changed");
// }
//
// // e.g if user manipulate the web token and they don't know our secret salt
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data.id)).toString();
// var resultHash =  SHA256(JSON.stringify(token.data) + 'somesecretsalt').toString();
// // the comparison below will fail
// if (resultHash === token.hash) {
//   console.log("data is secure");
// } else {
//   console.log("data was changed"); //this will fire
// }
