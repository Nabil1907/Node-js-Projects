var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://nabilsalman:KH5vZPXbVedCKh6C@cluster0.z526z.mongodb.net/<dbname>?retryWrites=true&w=majority";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});