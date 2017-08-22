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
  res.redirect('/todo');
})

app.get('/todo', (req,res) => {
  Todo.find()
    .then( (docs) => {
      console.log('* => found all the todos');
      console.log(docs);
      res.render('todos', {todos: docs});
    })
    .catch( (err) => {
      console.error(err);
      res.send('encountered errors')
    })
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
    // create the new todo
    let newTodo = new Todo({
      text: req.body.todo,
      completed: false,
      dateCreated: Date(),
    });
    newTodo.save()
    .then( (doc) => {
      console.log('* => saved new todo to db');
      console.log(doc);
      res.redirect('/');
    })
  }
})

app.post('/todo/:id', (req, res) => {
  console.log('need to mark completed: ' + req.params.id);
  let query = {'_id': req.params.id};
  Todo.findByIdAndUpdate(
    req.params.id,
    { $set: { completed: true, dateCompleted: Date() }},
    { new: true },
    (err, doc) => {
      console.log('Marked todo as completed');
      console.log(doc);
      res.redirect('/');
    })
});


app.listen(3000, () => {
  console.log('Server running on 3000');
})
