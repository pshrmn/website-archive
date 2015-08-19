var express = require('express');
var http = require('http');
var socket = require('socket.io');
var routes = require('./routes');
var gamemaster = require('./utils/gamemaster');
var nunjucks = require('nunjucks');

var app = express();
var server = http.Server(app);
var io = socket(server);

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.get('/', routes.index);
app.use('/static', express.static(__dirname + "/public/"));
gamemaster(io);

var port = process.env.port || 3000
server.listen(port, function(){
  console.log('listening on *:' + port);
});