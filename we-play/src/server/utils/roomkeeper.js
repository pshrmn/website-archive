import socket from 'socket.io';
import Player from './player';
import Room from './room';

/*
 * The Room Keeper manages the all of the players. When a new room is created,
 * it adds the room to its rooms object. All other events passed in through a
 * socket should include the name of the room.
 */
export default function setupSocket(server) {
  const rooms = {};
  const io = socket(server);

  // send out a ping every 30 seconds to keep the web socket alive (for Heroku)
  const interval = setInterval(function() {
    io.emit('ping', 'Keep Alive')
  }, 30000);

  io.on('connection', function(socket){

    // this event is used for adding people to a room. The person who first
    // creates the room will be made the room's "owner" (until he/she leaves)
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

    // this event informs the room that a player has left it. If there are no
    // players left in the room after this happens, the room is deleted.
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

    // this event passes on turn information for a game to a room.
    socket.on('submit turn', msg => {
      const {
        room,
        turn
      } = msg;
      if ( !rooms[room] ) {
        return;
      }
      rooms[room].updateGame(turn, socket.id);
    });

    // this event toggles whether or not a person is ready to play a game
    // once enough players in a room have signalled that they are ready,
    // the game should begin
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

    // this event selects the game that will be played. It can only be
    // controlled by the room's "owner"
    socket.on('set game', function(msg){
      var room = rooms[msg.room];
      if ( !room ) {
        return;
      }
      room.setGame(msg.game, socket.id);
    });

    /*
     * when a user disconnects from a room and no other users are in it, the
     * room is removed, so we should delete the reference to it. If the room
     * still exists after a user has left, we should call the room's updatePlayers
     * method. This will set a new "owner" if the previous owner has left.
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
