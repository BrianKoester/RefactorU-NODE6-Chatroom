
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var socketio = require('socket.io')
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//index route
app.get('/', routes.index);
 
//Create the server
var server = http.createServer(app)

//Start the web socket server
var io = socketio.listen(server);

// create empty object to hold users
var users = {};


//If the client just connected
io.sockets.on('connection', function(socket) {
	console.log('SOMEONE CONNECTED!')
    users[socket.id] = socket.id

    // sending to all clients except sender
    socket.broadcast.emit('message', 'USER '+socket.id+ ' JUST CONNECTED!');

    // display user message
    socket.on('message', function(message){
        // sending to all clients, include sender
        io.sockets.emit('message', message+' (FROM => '+socket.id+')');
    });

	//If the client just disconnected
	socket.on('disconnect', function(){
		console.log('JUST DISCONNECTED!');
		socket.broadcast.emit('message', 'USER '+socket.id+ ' JUST DISCONNECTED!');
	});

});


server.listen(3000, function(){
  console.log('Express server listening on port ' + app.get('port'));
});