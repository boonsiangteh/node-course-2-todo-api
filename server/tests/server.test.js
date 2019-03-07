const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// in order to pass document length test in our test on Todo collection below,
// we will clean up our Todo collection before we test (we'll use beforeEach() hook from mochajs)
beforeEach((done) => {
  // remove all the documents in our Todo collection by passing nothing into the object in remove fn
  Todo.remove({}).then(() => done());
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
        // get all the documents in Todo collection
        Todo.find().then((todos) => {
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
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(0);
          done();
        }).catch((err) => done(err));
      })
  })
});
