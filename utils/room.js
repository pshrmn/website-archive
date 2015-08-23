/*
 * A room is used for 2+ people to play a game.
 */
function Room(socket, owner, name, password) {
  this.socket = socket;
  this.name = name;
  this.owner = owner;
  this.password = password;

  this.players = [owner];
  this.minPlayers = 2;
  this.maxPlayers = 2;

  this.info();
}

/*
 * Check if a user with the given name already exists in the room
 */
Room.prototype.hasPlayer = function(name) {
  return this.players.some(function(p){
    return p.nickname === name;
  });
}

/*
 * Add a new player if the room is under capacity and the correct password
 * is given.
 */
Room.prototype.addPlayer = function(player, password) {
  if ( password !== this.password ) {
    player.socket.emit("joined", {
      error: true,
      reason: "Room " + this.name + " exists, but you entered the incorrect password"
    });
  } else if ( this.players.length >= this.maxPlayers ) {
    player.socket.emit("joined", {
      error: true,
      reason: "Too many players already in the room"
    });
  } else if ( this.hasPlayer(player.nickname) ) {
    player.socket.emit("joined", {
      error: true,
      reason: "There is already a player with this nickname in the room"
    });
  } else {
    this.players.push(player);
    player.socket.join(this.name);
    this.info();
    player.socket.emit("joined", {
      error: false,
      reason: ""
    });
  }
};

/*
 * Remove a player from the room using the player's socket id
 */
Room.prototype.removePlayer = function(playerID) {
  var leavingPlayer;
  var connected = Object.keys(this.socket.connected);
  // filter out the player being removed
  this.players = this.players.filter(function(player){
    var id = player.socket.id;
    if ( playerID === id ) {
      leavingPlayer = player;
    }
    return playerID !== id;
  });
  // remove the player from the socket.io room
  if ( leavingPlayer ) {
    // if the owner has left, the person who has been in the room the next
    // longest is made the new owner. not a perfect system, but good enough
    // of course, if the owner is the only person in the room, the room should
    // be destructed
    if ( this.owner.nickname === leavingPlayer.nickname && this.players.length ) {
      this.owner = this.players[0];
    }
    leavingPlayer.socket.leave(this.name, function() {
      leavingPlayer.socket.emit("left", "left room");
    });
    this.info();
  }
};

/*
 * Check to see if all of the players are still in the room.
 */
Room.prototype.checkPlayers = function() {
  var connected = Object.keys(this.socket.connected);
  if ( connected.length !== this.players.length ) {
    // filter down players to only ones still in the room
    this.players = this.players.filter(function(player){
      var id = player.socket.id;
      return connected.some(function(socketID){
        return socketID === id;
      });
    });
    this.info();
  }
};

Room.prototype.shouldDelete = function() {
  return this.players.length === 0;
};

/*
 * Send information about the room to everyone in it.
 */
Room.prototype.info = function() {
  var players = this.players.map(function(p){
    return {
      name: p.nickname,
      ready: p.ready
    };
  });
  this.socket.to(this.name).emit("info", {
    name: this.name,
    owner: this.owner.nickname,
    players: players,
    canPlay: this.players.length >= this.minPlayers
  });
};

Room.prototype.addReady = function(socketID) {
  this.players.some(function(p) {
    if ( p.socket.id === socketID ) {
      p.ready = true;
      return true;
    }
    return false;
  });
  var allReady = this.players.every(function(p){
    return p.ready;
  })
  if ( allReady && this.players.length >= this.minPlayers ) {
    this.socket.to(this.name).emit("start game", "the game is starting");
  }
  this.info();
};

Room.prototype.endGame = function() {
  this.players.forEach(function(p){
    p.ready = false;
  });
  this.info();
}



module.exports = Room;
