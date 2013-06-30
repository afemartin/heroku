var express = require("express");

var pg = require('pg');

var freebase = require('freebase');

var app = express();

var db = process.env.DATABASE_URL || 'postgres://andres:martin@localhost:5432/postgres';

app.use(express.logger());


// Configuration
///////////////////////////////////////

app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/public'));
	app.use(app.router);
});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});


// Routes
///////////////////////////////////////

app.get('/install', function(request, response) {
	pg.connect(db, function(err, client) {
		var query = client.query('CREATE TABLE IF NOT EXISTS films (id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, description VARCHAR(255), image VARCHAR(255), year INTEGER, genre VARCHAR(255), length INTEGER, country VARCHAR(2))');
		query.on('end', function() {
			client.end();
		});
	});
	response.render('install');
});

app.post('/film/create.json', function(request, response) {
	pg.connect(db, function(err, client) {
		if (request.body.title && request.body.description) {
			client.query('INSERT INTO films (title, description) VALUES ($1, $2)', [request.body.title, request.body.description]);
			response.json({
				'success': true
			});
		} else {
			response.json({
				'success': false
			});
		}
	});
});

app.post('/film/delete.json', function(request, response) {
	pg.connect(db, function(err, client) {
		if (request.body.id) {
			client.query('DELETE FROM films WHERE id = $1', [request.body.id]);
			response.json({
				'success': true
			});
		} else {
			response.json({
				'success': false
			});
		}
	});
});

app.post('/film/search.json', function(request, response) {
	if (request.body.title) {
		freebase.description(request.body.title, {
			type: '/film/film'
		}, function(result) {
			response.json({
				'success': true,
				'data': result
			});
		});
	} else {
		response.json({
			'success': false
		});
	}
});

app.get('/', function(request, response) {
	pg.connect(db, function(err, client) {
		var query = client.query('SELECT * FROM films', function(err, result) {
			response.render('index', {
				'films': result.rows
			});
		});
		query.on('end', function() {
			client.end();
		});
	});
});


// Start server
///////////////////////////////////////

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on port " + port);
});