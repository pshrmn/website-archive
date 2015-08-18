var express = require('express');
var http = require('http');
var socket = require('socket.io');
var routes = require('./routes');
var gamemaster = require('./utils/gamemaster');
var handlebars = require('express-handlebars');

var app = express();
var server = http.Server(app);
var io = socket(server);

app.engine('handlebars', handlebars({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.get('/', routes.index);
app.get('/room/:code', routes.room);
app.use('/static', express.static(__dirname + "/public/"));
gamemaster(io);

var port = process.env.port || 3000
server.listen(port, function(){
  console.log('listening on *:' + port);
});