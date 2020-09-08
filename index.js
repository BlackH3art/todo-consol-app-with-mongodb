const mongo = require('mongodb');

const client = new mongo.MongoClient('mongodb://localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true})

// **************************************************************
// **************** adding

function addNewTodo(todosCollection, todo) { 

  todosCollection.insertOne({
    todo,
    done: false,
  }, err => {
    if(err) {
      console.log('błąd przy dodawaniu', err);
    } else {
      console.log('dodano zadanie: ', todo);
    }
    client.close();
  })
}

// **************************************************************
// **************** listing

function showAllTodos(todosCollection) {
  todosCollection.find({}).toArray((err, todos) => {

    if(err) {
      console.log('błąd przy wczytywaniu danych', err);
    } else {

      const todosToDo = todos.filter(todo => !todo.done)
      const todosDone = todos.filter(todo => todo.done)

      console.log('Lista zadan do wykonania !!');

      for (const todo of todosToDo) {
        console.log(`- ${todo._id} ${todo.todo} `);
      }

      console.log('Lista wykonanych zadań:');

      for (const todo of todosDone) {
        console.log(`- ${todo._id} ${todo.todo} `);
      }
    }
    client.close();
  });
}


// **************************************************************
// **************** mark as done

function markAsDone(todosCollection, id) {

  todosCollection.find({
    _id: mongo.ObjectID(id)
  }).toArray((err, todos) => {
    if(err) {
      console.log('Błąd podczas pobierania');
    } else if(todos.length !== 1) { 
      console.log('Nie znaleziono zadania o takim ID');
      client.close();
    } else if(todos[0].done) {
      console.log('To zadanie, zostało zrobione wcześniej');
      client.close();
    } else {
      todosCollection.updateOne({
        _id: mongo.ObjectID(id)
      }, { 
        $set: {done: true}
      }, err => {
    
        console.log(id);
        if(err) {
          console.log('Błąd przy aktualizacji zadania!', err);
        } else {
          console.log('Zadanie zaktualizowano');
          client.close()
        }
      } )
    
    }
  })
}

  
// **************************************************************
// **************** delete todod item


function deleteTodoItem(todosCollection, id) { 
  todosCollection.find({
    _id: mongo.ObjectID(id)
  }).toArray((err, todo) => {
    if(err) {
      console.log('Błąd przy usuwaniu');
    } else if(todo.length !== 1) {
      console.log('Nie da się usunąć nieistniejącego elementu');
      client.close();
    } else {
      todosCollection.deleteOne({
        _id: mongo.ObjectID(id)
      }, err => {
        if(err) {
          console.log('Błąd przy usuwaniu');
        } else {
          console.log(`Zadanie o id: ${id} zostało usunięte`);
          client.close();
        }
      })
    }
  })
}


  

  

      

function doTheTodo(todosCollection) {
  const [command, ...args] = process.argv.splice(2);

  switch(command) {
    case 'add': 
      addNewTodo(todosCollection, args[0]);
      break;
    case 'list': 
      showAllTodos(todosCollection);
      break
    case 'done': 
      markAsDone(todosCollection, args[0]);
      break
    case 'delete': 
      deleteTodoItem(todosCollection, args[0]);
      break
  }

  // client.close();

}


client.connect(error => {
  if (error) {
    console.log('Połączenie się nie powiodło', error);
  } else {
    console.log('Połączenie nawiązane');

    const db = client.db('test');
    const todosCollection = db.collection('todos');

    doTheTodo(todosCollection)


  }
})