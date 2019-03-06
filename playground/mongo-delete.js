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

    // delete documents inside our collection
    // deleteMany
    // db.collection('Todo').deleteMany({text: 'have lunch'}).then((result) => {
    //   console.log(result);
    // });

    // deleteOne (delete first item that matches criteria)
    // db.collection('Todo').deleteOne({text: "have lunch"}).then((result) => {
    //   console.log(result);
    // });

    // findOneAndDelete (delete first document which matches criteria and return deleted document)
    // db.collection('Todo').findOneAndDelete({completed: false}).then((result) => {
    //   console.log(result);
    // });

    // delete duplicate names in Users collection
    db.collection('Users').deleteMany({name: "Tony"}).then((result) => {
      console.log(result);
    });

    // delete an object based on _id
    db.collection('Users').findOneAndDelete({
      _id: new ObjectID('5c7f60adf379681e71ac7210')
    }).then((result) => {
      console.log(result);
    })

    // close connection to db after we are done
    // client.close();
});
