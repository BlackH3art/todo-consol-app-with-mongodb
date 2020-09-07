const mongo = require('mongodb');

const client = new mongo.MongoClient('mongodb://localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true})

client.connect(error => {
  if (error) {
    console.log('Połączenie się nie powiodło', error);
  } else {
    console.log('Połączenie nawiązane');

    const db = client.db('test');
    const todosCollection = db.collection('todos');

    


    client.close()
  }
})