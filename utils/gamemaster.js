var Player = require("./player");
var Room = require("./room");

module.exports = function(io) {
  var rooms = {};

  // send out a ping every 30 seconds to keep the web socket alive (for Heroku)
  var interval = setInterval(function() {
    io.emit("ping", "Keep Alive")
  }, 30000);

  io.on("connection", function(socket){
    socket.on("join", function(msg){
      var name = msg.room;
      var room = rooms[name];
      var player = new Player(msg.nickname, socket);

      /*
       * Try to join if room already exists
       * if it doesn't exist, create the room
       */ 
      if ( room !== undefined ) {
        room.addPlayer(player, msg.password);
      } else {  
        player.owner = true;
        socket.join(name);
        rooms[name] = new Room(io.to(name), player, name, msg.password);
      }
    });

    socket.on("leave", function(msg){
      var room = rooms[msg.room];
      if ( !room ) {
        return;
      }
      room.removePlayer(socket.id);
      if ( room.shouldDelete() ) {
        delete rooms[msg.room];
      }
    });

    socket.on("gameState", function(msg){
      var name = msg.room;
      var room = rooms[name];
      if ( !room ) {
        return;
      }
      room.updateGame({
        row: msg.row,
        column: msg.column
      }, socket.id);
    });

    socket.on("ready", function(msg){
      var room = rooms[msg.room];
      if ( !room ) {
        return;
      }
      room.toggleReady(socket.id);
    });

    socket.on("set game", function(msg){
      var room = rooms[msg.room];
      if ( !room ) {
        return;
      }
      room.setGame(msg.game, socket.id);
    });

    /*
     * when a user disconnects from a room and no other users are in it, the
     * room is removed. I haven't seen a way to detect that a socket room no
     * longer exists, so iterate over all of them.
     */
    socket.on("disconnect", function() {
      var socketRooms = io.sockets.adapter.rooms;
      for ( var name in rooms ) {
        if ( socketRooms[name] === undefined ) {
          delete rooms[name];
        } else {
          rooms[name].checkPlayers();
        }
      }
    });
  });
};
