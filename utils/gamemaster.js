module.exports = function(io) {
  var rooms = {};
  io.on('connection', function(socket){
    socket.on('create room', function(room){
      var name = room.name;
      var resp = {
        error: false,
        reason: ""
      };
      if ( rooms[name] ) {
        resp.error = true;
        resp.reason = "A room with that name already exists"
      } else {
        rooms[name] = {
          password: room.password,
          people: [room.nickname]
        };
        socket.join(name, function() {
          // don't emit until we know the socket has been joined
          io.to(name).emit("room", {
            name: name,
            people: rooms[name].people
          });
        });
      }
      socket.emit("room joined", resp);
    });

    socket.on('join room', function(room){
      var name = room.name;
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
        rooms[name].people.push(room.nickname);
        socket.join(name, function() {
          // don't emit until we know the socket has been joined
          io.to(name).emit("room", {
            name: name,
            people: rooms[name].people
          });
        });
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
