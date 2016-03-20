var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

// GET root
app.get('/', function (req, res) {
	res.send('Todo API Test');
});

// GET /todos
app.get('/todos', function(req, res) {
	res.json(todos);
});


// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchTodo = _.findWhere(todos, {id:todoId});

	// iterate todos array to find the match
	// todos.forEach(function(todo) {
	// 	if (todoId === todo.id) {
	// 		matchTodo = todo;
	// 	}
	// });

	// if no id match -> send 404
	if (matchTodo) {
		res.json(matchTodo);
	} else {
		res.status(404).send('Error 404!!!');
	}
});


// POST /todos
app.post('/todos', function(req, res) {
	// use _.pick()
	var body = _.pick(req.body, 'description','completed');

	if(!_.isBoolean(body.completed)||!_.isString(body.description)||body.description.trim().length === 0) {
		return res.status(400).send('Error 400!!!');
	}

	// set body.description to be trimmed value
	body.description = body.description.trim();

	// add id field
	body.id = todoNextId++;

	// push body into todos
	todos.push(body);

	res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchTodo = _.findWhere(todos, {id:todoId});

	// if no id match -> send 404
	if (matchTodo) {
		todos = _.without(todos, matchTodo);
		res.json(matchTodo);
	} else {
		res.status(404).send('Error 404!!!');
	}

});


app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!!!');
});