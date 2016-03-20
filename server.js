var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

// GET root
app.get('/', function(req, res) {
	res.send('Todo API Test');
});

// GET /todos and /todos?completed filter
app.get('/todos', function(req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {completed: true});
	}else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {completed: false});
	}

	res.json(filteredTodos);
});


// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchTodo = _.findWhere(todos, {
		id: todoId
	});

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
	var body = _.pick(req.body, 'description', 'completed');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
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
	var matchTodo = _.findWhere(todos, {
		id: todoId
	});

	// if no id match -> send 404
	if (matchTodo) {
		todos = _.without(todos, matchTodo);
		res.json(matchTodo);
	} else {
		res.status(404).send('Error 404!!!');
	}

});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchTodo = _.findWhere(todos, {
		id: todoId
	});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchTodo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matchTodo, validAttributes);
	res.json(matchTodo);
});

app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT + '!!!');
});