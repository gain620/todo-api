var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	desc: "Play 'Dark Souls'",
	completed: false
}, {
	id: 2,
	desc: "Call mom",
	completed: true
}, {
	id: 3,
	desc: "Feed the cat",
	completed: false
}];

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
	var matchTodo;

	// iterate todos array to find the match
	todos.forEach(function(todo) {
		if (todoId === todo.id) {
			matchTodo = todo;
		}
	});

	// if no id match -> send 404
	if (matchTodo) {
		res.json(matchTodo);
	} else {
		res.status(404).send('Error 404!!!');
	}
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!!!');
});