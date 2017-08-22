const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const expressValidator = require('express-validator');
const jsonfile = require('jsonfile');
const morgan = require('morgan');
const mongoose = require('mongoose');

// let todoFile = './todo_list.json'

let Todo = require('./models/todos.js');

let app = express();

app.use(morgan('combined'));

app.use(express.static('public'));

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');

app.use(bodyParser.urlencoded({ extended: false}));

app.use(expressValidator());

app.get('/', (req, res, next) => {
  Todo.find()
    .then( (docs) => {
      console.log('* => found all the todos');
      console.log(docs);
      res.send('found all todos')
    })
    .catch( (err) => {
      console.error(err);
      res.send('encountered errors')
    })
})

app.get('/todo', (req,res) => {
  res.render('todos', todos);
})

app.post('/todo', (req, res) => {
  console.log(`Add todo ${req.body.todo}`);
  // insert the todo
  // need to find a unique id
  req.checkBody("todo", "Todo was blank.").notEmpty();
  let errors = req.validationErrors();
  console.log(errors);

  if( errors ){
    res.redirect('/todo');
  } else {
    let largest = todos.todos.length;

    todos.todos.push({id: largest+1, name: req.body.todo, completed: false});
    jsonfile.writeFile(todoFile, todos, (err) => {
      console.log(err);
      res.redirect('/todo');
    })
  }
})

app.post('/todo/:id', (req, res) => {
  console.log('need to update todo: ' + req.params.id);
  // changed the completed flag
  todos.todos.forEach( (todo) => {
    if( todo.id === Number(req.params.id) ) {
      todo.completed = true;
    }
  });

  jsonfile.writeFile(todoFile, todos, (err) => {
    console.log(err);
    res.redirect('/todo');
  })
})

app.listen(3000, () => {
  console.log('Server running on 3000');
})
