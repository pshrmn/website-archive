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
  this.playing = false;

  this.info();
}

/*
 * Check if a user with the given name already exists in the room
 */
Room.prototype.hasPlayer = function(name) {
  return this.players.some(function(p){
    return p.name === name;
  });
}

/*
 * Return a list of sockets connected to the room
 */
Room.prototype.socketIDs = function() {
  return Object.keys(this.socket.connected);
}

/*
 * Add a new player if the room is under capacity and the correct password
 * is given.
 */
Room.prototype.addPlayer = function(player, password) {
  if ( password !== this.password ) {
    player.send("joined", {
      error: true,
      reason: "Room " + this.name + " exists, but you entered the incorrect password"
    });
    return false;
  } else if ( this.players.length >= this.maxPlayers ) {
    player.send("joined", {
      error: true,
      reason: "The room is full"
    });
    return false;
  } else if ( this.hasPlayer(player.name) ) {
    player.send("joined", {
      error: true,
      reason: "There is already a player with this nickname in the room"
    });
    return false;
  } else {
    this.players.push(player);
    player.join(this.name);
    this.info();
    player.send("joined", {
      error: false,
      reason: ""
    });
    return true;
  }
};

/*
 * Remove a player from the room using the player's socket id
 */
Room.prototype.removePlayer = function(playerID) {
  var leavingPlayer;
  var connected = this.socketIDs();
  // filter out the player being removed
  this.players = this.players.filter(function(player){
    var is = player.is(playerID);
    if ( is ) {
      leavingPlayer = player;
    }
    return !is
  });
  // remove the player from the socket.io room
  if ( leavingPlayer ) {
    // if the owner has left, the person who has been in the room the next
    // longest is made the new owner. not a perfect system, but good enough
    // of course, if the owner is the only person in the room, the room should
    // be destructed
    if ( this.owner.name === leavingPlayer.name && this.players.length ) {
      this.owner = this.players[0];
    }
    leavingPlayer.leave(this.name, function() {
      leavingPlayer.send("left", "left room");
    });
    this.info();
    return true;
  }
  return false;
};

/*
 * Check to see if all of the players are still in the room.
 */
Room.prototype.checkPlayers = function() {
  var connected = this.socketIDs();
  if ( connected.length !== this.players.length ) {
    // filter down players to only ones still in the room
    this.players = this.players.filter(function(player){
      return connected.some(function(socketID){
        return player.is(socketID);
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
    return p.description();
  });
  // send out to each player so they can see their own information
  this.players.forEach(function(p){
    p.send("info", {
      room: {
        name: this.name,
        owner: this.owner.name,
        players: players
      },
      player: {
        name: p.name,
        ready: p.ready,
        playing: this.playing
      }
    });
  }, this);
};

Room.prototype.toggleReady = function(socketID) {
  // can't toggle while playing
  if ( this.playing ) {
    return;
  }
  // find the player in the players array
  this.players.some(function(p) {
    if ( p.is(socketID) ) {
      p.ready = !p.ready;
      return true;
    }
    return false;
  });
  // figure out if everyone is ready
  var allReady = this.players.every(function(p){
    return p.ready;
  })
  if ( allReady && this.players.length >= this.minPlayers ) {
    this.playing = true;
    this.players.forEach(function(p){
      p.send("gameState", {
        name: "Super Fun Game! Hooray!"
      });
    });
  }
  this.info();
};

Room.prototype.endGame = function() {
  this.players.forEach(function(p){
    p.ready = false;
  });
  this.playing = false;
  this.info();
}

module.exports = Room;
