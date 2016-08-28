import socket from 'socket.io';
import Player from './player';
import Room from './room';

/*
 * The Game Master takes the server, creates a socket.io socket, and adds a
 * listener for the 'connection' event.
 */
export default function setupSocket(server) {
  const rooms = {};
  const io = socket(server);

  // send out a ping every 30 seconds to keep the web socket alive (for Heroku)
  const interval = setInterval(function() {
    io.emit('ping', 'Keep Alive')
  }, 30000);

  io.on('connection', function(socket){

    socket.on('join', msg => {
      const {
        room,
        password,
        nickname
      } = msg;
      const player = new Player(nickname, socket);

      // Try to join if room already exists. If it doesn't exist, create the room.
      if ( rooms[room] !== undefined ) {
        rooms[room].addPlayer(player, password);
      } else {
        player.owner = true;
        socket.join(room)
        rooms[room] = new Room(io.to(room), player, room, password);
      }
    });

    socket.on('leave', msg => {
      const {
        room
      } = msg;
      const currentRoom = rooms[room];
      if ( !currentRoom ) {
        return;
      }
      currentRoom.removePlayer(socket.id);
      if ( currentRoom.shouldDelete() ) {
        delete rooms[room];
      }
    });

    socket.on('gameState', msg => {
      const {
        room,
        row,
        column
      } = msg;
      if ( !rooms[room] ) {
        return;
      }
      rooms[room].updateGame({
        row,
        column
      }, socket.id);
    });

    socket.on('ready', function(msg){
      const {
        room
      } = msg;
      const currentRoom = rooms[room];
      if ( !currentRoom ) {
        return;
      }
      currentRoom.togglePlayer(socket.id);
    });

    socket.on('set game', function(msg){
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
    socket.on('disconnect', () => {
      const socketRooms = io.sockets.adapter.rooms;
      for ( const room in rooms ) {
        if ( socketRooms[room] === undefined ) {
          delete rooms[room];
        } else {
          rooms[room].updatePlayers();
        }
      }
    });
  });
};
