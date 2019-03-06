const {MongoClient} = require('mongodb');

// MongoClient is a client for us to connect to mongodb database to run comments
// like create records and delete records
MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true} ,(err, client) => {
    if (err) {
      return console.log("Unable to connect to database");
    }

    console.log("Successfully connected to database");

    // get a reference to TodoApp database in mongodb
    const db = client.db('TodoApp');

    // now we insert a record into the Todo collection (sort of like a Todo table in TodoApp db)
    // db.collection('Todo').insertOne({
    //   text: "Something to do",
    //   completed: false
    // }, (err, result) => {
    //   if (err) {
    //     return console.log("Unable to insert into Todo collection", err);
    //   }
    //
    //   console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    db.collection('Users').insertOne({
      name: "Tony",
      age: 26,
      location: "Singapore"
    }, (err, result) => {
      if (err) {
        return console.log("Unable to insert into Todo collection", err);
      }

      console.log(result.ops[0]._id.getTimestamp());
    });

    // close connection to db after we are done
    client.close();
});
