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

    // findOneAndUpdate (update specific document and return the document)
    // db.collection('Todo').findOneAndUpdate(
    //   {
    //     _id: new ObjectID('5c7f7b360cba5691feb65b53')
    //   },
    //   // must use MongoDB update operator to update documents (cannot do direct assignment!!)
    //   {
    //     $set: {
    //       completed: true
    //     }
    //   },
    //   {
    //     returnOriginal: false
    //   }
    // ).then((result) => {
    //   console.log(result);
    // });

    // update Users
    db.collection('Users').findOneAndUpdate(
      { name : "Jason"},
      {
        $set: { name: "Hogwarts" },
        $inc: { age: 1 }
      },
      { returnOriginal: false }
    ).then((result) => {
      console.log(result);
    });

    // close connection to db after we are done
    // client.close();
});
