var Player = require("../games/player");
var TicTacToe = require("../games/tictactoe");

module.exports = function(io) {
  var rooms = {};
  io.on('connection', function(socket){
    socket.on('create room', function(room){
      var name = room.room;
      var resp = {
        error: false,
        reason: ""
      };
      if ( rooms[name] ) {
        resp.error = true;
        resp.reason = "A room with that name already exists"
      } else {
        var player = new Player(room.nickname, socket);
        // join so that the room exists
        socket.join(name);
        switch (room.game) {
        case "tic-tac-toe":
          rooms[name] = new TicTacToe(io.to(room), player, name, room.password);
          var info = rooms[name].info();
          io.to(name).emit("info", info)
          break;
        }
      }
      socket.emit("room joined", resp);
    });

    socket.on('join room', function(room){
      var name = room.room;
      var resp = {
        error: false,
        reason: ""
      };
      if ( rooms[name] === undefined ) {
        resp.error = true;
        resp.reason = "room " + name + " does not exist";
      } else if ( rooms[name].password !== room.password  ) {
        resp.error = true,
        resp.reason = "incorrect password"
      } else {
        var player = new Player(room.nickname, socket);
        var added = rooms[name].addPlayer(player);
        if ( !added ) {
          resp.error = true;
          resp.reason = "too many players in the room";
        } else {
          var info = rooms[name].info();
          io.to(name).emit("info", info)
        }
      }
      socket.emit("room joined", resp);
    });

    /*
     * when a user disconnects from a room and no other users are in it, the
     * room is removed. I haven't seen a way to detect that a socket room no
     * longer exists, so iterate over all of them.
     */
    socket.on('disconnect', function() {
      var socketRooms = io.sockets.adapter.rooms;
      for ( var name in rooms ) {
        if ( socketRooms[name] === undefined ) {
          delete rooms[name];
        }
      }
    });
  });
};
