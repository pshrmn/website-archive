var Player = require("../games/player");
var Room = require("../games/room");

module.exports = function(io) {
  var rooms = {};
  io.on('connection', function(socket){
    socket.on('enter room', function(msg){
      var name = msg.room;
      var room = rooms[name];
      var player = new Player(msg.nickname, socket);

      // if room already exists, check if password matches
      // if room doesn't exist, create the room
      if ( room !== undefined ) {
        if ( room.password === msg.password) {
          room.addPlayer(player);
        } else {
          socket.emit("join", {
            error: true,
            reason: "A room with that name already exists and your password doesn't match"
          });
        }
      } else {  
        // join so that the room exists
        socket.join(name);
        rooms[name] = new Room(io.to(name), player, name, msg.password);
      }
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
        } else {
          rooms[name].checkPlayers();
        }
      }
    });
  });
};
