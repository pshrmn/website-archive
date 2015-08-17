var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var routes = require('./routes');
var gamemaster = require('./utils/gamemaster');

app.get('/', routes.index);

gamemaster(io);

var port = process.env.port || 3000
http.listen(port, function(){
  console.log('listening on *:' + port);
});