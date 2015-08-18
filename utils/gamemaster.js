module.exports = function(io) {
  var rooms = {};
  io.on('connection', function(socket){
    socket.on('create room', function(room){
      var name = room.name;
      var error = false;
      var reason = "";
      if ( rooms[name] ) {
        error = true;
        reason = "A room with that name already exists"
      } else {
        rooms[name] = room.password;
        socket.join(name);
      }
      socket.emit('room created', {
        error: error,
        reason: reason
      });
    });

    socket.on('join room', function(room){
      var name = room.name;
      var error = false;
      var reason = "";
      if ( rooms[name] === undefined ) {
        error = true;
        reason = "room " + name + " does not exist";
      } else if ( rooms[name] !== room.password  ) {
        error = true,
        reason = "incorrect password"
      } else {
        socket.join(name);
        console.log(io.sockets.adapter.rooms[name]);
      }
      socket.emit("room joined", {
          error: error,
          reason: reason
        });
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
