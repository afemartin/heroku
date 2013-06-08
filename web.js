var express = require("express");

var app = express();

app.use(express.logger());


// Configuration
///////////////////////////////////////

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/public'));
	app.use(app.router);
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});


// Routes
///////////////////////////////////////

app.get('/', function(request, response) {
	response.render('index');
});


// Start server
///////////////////////////////////////

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});