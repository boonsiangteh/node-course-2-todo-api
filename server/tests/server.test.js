const expect = require('expect');
const request = require('supertest');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todoArr, populateTodos, userArr, populateUsers} = require('./seed/seed');

// populate test database with seed users
beforeEach(populateUsers);

// in order to pass document length test in our test on Todo collection below,
// we will clean up our Todo collection before we test (we'll use beforeEach() hook from mochajs)
beforeEach(populateTodos);

// create test case to test our http post request
describe('POST /todos', () => {

  // create a async test for post request
  it('should create a new todo', (done) => {
    var text = "test todo text";

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((response) => {
        expect(response.body.text).toBe(text);
      })
      .end((err, response) => {
        // stop function execution if there's an error
        if (err) {
          return done(err);
        }
        // perform test on Todo collection to make sure the document is actually added
        // get all the documents in Todo collection matching todo text we sent above ("test todo text")
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1); //this will actually fail if we already have documents in our Todo collection
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  // create test case for empty todo
  it('should not create todo with invalid body data', (done) => {

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      // pass in fn to end cause we have to perform async operations to get todos from mongodb
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('GET /todos', () => {
  it("should get all todo", (done) => {

    // 2nd way to do the same thing
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
      // no need to pass in fn to end cause we're not doing something async like post method above
  });
});

describe("GET /todos/:id", () => {

  // test to make sure correct todo is sent back when we make get request
  it("should get the todo with ID", (done) => {
    request(app)
    .get(`/todos/${todoArr[0]._id.toHexString()}`)
    .expect(200) //expect status code 200 if everything goes well
    .expect((res) => {
      expect(res.body.todo.text).toBe(todoArr[0].text); //expect to get the correct todo back
    })
    .end(done);
  });

  // test to make sure 404 returned when no todo with ID is found
  it("should return 404 with no todo", (done) => {
    var someId = new ObjectID();
    request(app)
    .get(`/todos/${someId.toHexString()}`)
    .expect(404)
    .end(done);
  });

  // test to make sure 400 is returned when ID is invalid
  it("should return 400 bad request", (done) => {
    request(app)
    .get("/todos/123")
    .expect(400)
    .end(done);
  });
});

// delete todo test
describe('DELETE /todo/:id', () => {
  it('should delete and return deleted todo', (done) => {
    var hexId = todoArr[0]._id.toHexString(); //delete first todo
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {  //query the db to ensure document is actually deleted
        if (err) {
          return done();
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeNull();
          done();
        }).catch((e) => done(e));
      });
  });
  it('should return 404 if todo not found', (done) => {
    var randomId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${randomId}`)
      .expect(404)
      .end(done);
  });
  it('should return 400 if ID is invalid', (done) => {
    request(app)
      .delete('/todos/123')
      .expect(400)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {

  // test to see if todo got updated if everything goes well
  it('should return todo with new text', (done) => {
    var hexId = todoArr[0]._id.toHexString();
    var text = "some bloody text";
    var completed = true;

    request(app)
      .patch(`/todos/${hexId}`)
      .send({text, completed})
      .expect(200)
      .expect((res) => {
        // assert that returned todo object contains new text
        expect(res.body.todo._id).toBe(hexId);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBeTruthy();
        expect(typeof _.toNumber(res.body.todo.completedAt)).toBe('number');

      })
      .end(done);

      /*
      this part below was originally written but turns out not needed as we do not actually need to go into db and check our document
      however, we can enhance checking by adding this code to go into collection and check if our document was really updated
      */
      // .end((err, res) => { //quey the db to make sure todo item is really updated
      //   if (err) {
      //     return done(err);
      //   }
      //
      //   Todo.findById(hexId).then((todo) => {
      //     expect(todo.text).toBe(text);
      //     expect(todo.completed).toBeTruthy();
      //
      //     done();
      //   }).catch((e) => done(e));
      // });
  });

  it('should return 404 if todo._id not found', (done) => {
    var id = new ObjectID().toHexString();
    request(app)
      .patch(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should return 400 if invalid id is given', (done) => {
    request(app)
      .patch(`/todos/1233`)
      .expect(400)
      .end(done);
  });

  it('should set completedAt to null when todo not completed', (done) => {
    // get second todo _id
    var hexId = todoArr[1]._id.toHexString();
    var completed = false;
    var text = "some silly second todo";
    request(app)
      .patch(`/todos/${hexId}`)
      .send({text, completed})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completedAt).toBeNull();
        expect(res.body.todo.completed).toBeFalsy();
      })
      .end(done);

      // same as above (no need to go all the way into db to check but can be added to enhance the test)
      // .end((err, res) => {
      //   if (err) {
      //     return done(err);
      //   }
      //   // query db to make sure completedAt is really null
      //   Todo.findById(hexId).then((todo) => {
      //     expect(todo.completedAt).toBeNull();
      //     done();
      //   }).catch((e) => done(e));
      // });
  });
});

describe('GET /users/me', () => {

  // test proper authentication process with userOne
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', userArr[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(userArr[0]._id.toHexString());
        expect(res.body.email).toBe(userArr[0].email);
      })
      .end(done);
  });

  // test for improper authentication with userTwo
  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

// test cases to create users
describe('POST /users', () => {
  it('should create user', (done) => {
    var email = 'abc@email.com';
    var password = 'qwert1234';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.header['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user.email).toBe(email);
          expect(user.password).not.toEqual(password);
          done();
        }).catch((e) => done(e));
      });

  });

  it('should not create user if email already in use', (done) => {
    var email = 'sherlock@email.com'; //same as userOne seed email
    var password = 'abc12456';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should return validation error without proper request properties', (done) => {
    var email = 'gghhhh@email.com'; //same as userOne seed email
    var password = '123'; //email shorter than required minlength

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});
