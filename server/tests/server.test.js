const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// create a few example todos for testing GET requests
const todoArr = [
  {text: "First todo"},
  {text: "Second todo"}
];

// in order to pass document length test in our test on Todo collection below,
// we will clean up our Todo collection before we test (we'll use beforeEach() hook from mochajs)
beforeEach((done) => {
  // remove all the documents in our Todo collection by passing nothing into the object in remove fn
  Todo.remove({}).then(() => {
    return Todo.insertMany(todoArr);
  }).then(() => done());
});

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

    // request(app)
    //   .get('/todos')
    //   .expect(200)
    //   .end((err, res) => {
    //     if (err) {
    //       return done(err);
    //     }
    //
    //     Todo.find().then((todos) => {
    //       expect(todos.length).toBe(2);
    //       done();
    //     }).catch((err) => done(err));
    //   });

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
})
