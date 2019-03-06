const {MongoClient, ObjectID} = require('mongodb');

// MongoClient is a client for us to connect to mongodb database to run comments
// like create records and delete records
MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true} ,(err, client) => {
    if (err) {
      return console.log("Unable to connect to database");
    }

    console.log("Successfully connected to database");

    // get a reference to TodoApp database in mongodb
    const db = client.db('TodoApp');

    // find a document in the collection
    // db.collection('Todo').find({
    //   _id: new ObjectID('5c7f669c0cba5691feb65691')
    // }).toArray().then((docs) => { //toArray returns promise
    //   console.log("Connected to MongoDB Server");
    //   console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //   console.log("Unable to connect to MongoDB server");
    // });

    // get a count of all todos in our Todo collections
    // db.collection('Todo').find().count().then((count) => {
    //   console.log(`Todo Count: ${count}`);
    // }, (err) => {
    //   console.log("Unable to connect to MongoDB server");
    // });

    // find a document in the collection
    db.collection('Users').find({
      name: "Tony"
    }).toArray().then((docs) => { //toArray returns promise
      console.log("Connected to MongoDB Server");
      console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
      console.log("Unable to connect to MongoDB server");
    });

    // close connection to db after we are done
    // client.close();
});
