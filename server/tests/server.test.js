const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// create a few example todos for testing GET requests
const todoArr = [
  {
    _id: new ObjectID(),
    text: "First todo"
  },
  {
    _id: new ObjectID(),
    text: "Second todo"
  }
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
