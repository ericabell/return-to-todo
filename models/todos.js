const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost/todos-project', { useMongoClient: true });

let Schema = mongoose.Schema;

let todo = new Schema({
  text: String,
  completed: Boolean,
  dateCreated: {type: Date, default: Date.now },
  dateCompleted: {type: Date, default: null },
});

let Todo = mongoose.model('Todo', todo);

module.exports = Todo;
