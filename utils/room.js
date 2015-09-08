var GameManager = require("./manager");

/*
 * A room is used for 2+ people to play a game.
 */
function Room(socket, owner, name, password) {
  this.socket = socket;
  this.name = name;
  this.owner = owner;
  this.password = password;

  this.people = [owner];

  this.gameManager = new GameManager(this);

  this.playerState();
}

/*
 * Check if a user with the given name already exists in the room
 */
Room.prototype.nameTaken = function(name) {
  return this.people.some(function(p){
    return p.name === name;
  });
};

/*
 * Add a new player if the room is under capacity and the correct password
 * is given.
 */
Room.prototype.addPlayer = function(player, password) {
  var error = false;
  var reason = "";
  if ( password !== this.password ) {
    error = true;
    reason = "Room " + this.name + " exists, but you entered the incorrect password";
  } else if ( this.nameTaken(player.name) ) {
    error = true;
    reason = "There is already a player with this nickname in the room";
  } else {
    this.people.push(player);
    player.join(this.name);
    this.playerState();
  }
  player.send("joined", {
    error: error,
    reason: reason
  });
  return !error;
};

/*
 * Remove a player from the room using the player's socket id
 */
Room.prototype.removePlayer = function(playerID) {
  var found = false;
  var wasOwner = false;
  var spliceIndex;
  // filter out the player being removed
  this.people.forEach(function(player, index){
    if ( player.is(playerID) ) {
      if ( this.owner.name === player.name ) {
        wasOwner = true;
      }
      player.leave(this.name, function() {
        player.send("left", "left room");
      });
      found = true;
      spliceIndex = index;
    }
  }, this);

  if ( found ) {
    this.people.splice(spliceIndex, 1);
    // if the owner has left, the person who has been in the room the next
    // longest is made the new owner. not a perfect system, but good enough.
    if ( wasOwner && this.people.length ) {
      this.owner = this.people[0];
    }
    this.gameManager.playerLeft(playerID);
    this.playerState();
  }
  return found;
};

/*
 * Check to see if all of the players are still in the room.
 */
Room.prototype.checkPlayers = function() {
  var connected = Object.keys(this.socket.connected);
  var setNewOwner = false;
  if ( connected.length !== this.people.length ) {
    // filter down players to only ones still in the room
    this.people = this.people.filter(function(player){
      var stillConnected = connected.some(function(socketID){
        return player.is(socketID);
      });
      if ( player.owner && !stillConnected ) {
        setNewOwner = true;
      }
      return stillConnected;
    }, this);
    if ( setNewOwner && this.people.length ) {
      this.owner = this.people[0];
      this.people[0].owner = true;
    }
    this.playerState();
  }
};

Room.prototype.shouldDelete = function() {
  return this.people.length === 0;
};

Room.prototype.playerState = function() {
  var roomState = this.state();
  // send out to each player so they can see their own information
  this.people.forEach(function(p){
    roomState.room.people.you = p.description();
    p.send("roomState", roomState);
  }, this);
};

/*
 * Information about the state of the room
 */
Room.prototype.state = function() {
  var players = [];
  var spectators = [];
  this.people.forEach(function(p){
    var desc = p.description();
    if ( p.ready ) {
      players.push(desc);
    } else {
      spectators.push(desc);
    }
  });
  var gameState = this.gameManager.state();
  return {
    room: {
      name: this.name,
      people: {
        spectators: spectators,
        players: players
      },
      gameState: gameState
    }
  }
};

Room.prototype.togglePlayer = function(socketID) {
  // can't toggle while playing
  if ( this.gameManager.playing ) {
    return;
  }
  
  this.people.some(function(p) {
    if ( p.is(socketID) ) {
      p.ready = !p.ready;
      return true;
    }
    return false;
  });
  var players = [];
  var spectators = [];
  this.people.forEach(function(p){
    if ( p.ready ) {
      players.push(p);
    } else {
      spectators.push(p);
    }
  });
  this.gameManager.setPlayers(players, spectators);
  this.playerState();
};

Room.prototype.setGame = function(gameName, socketID) {
  // only the owner can set the game type
  if ( !this.owner.is(socketID) ) {
    return;
  }
  var set = this.gameManager.setGame(gameName);
  if ( set ) {
    // reset the ready on all players when the game switches?
    this.people.forEach(function(p){
      p.ready = false;
    });
    this.playerState();
  }
}

Room.prototype.endGame = function() {
  this.playerState();
}

Room.prototype.updateGame = function(state, socketID) {
  this.gameManager.update(state, socketID);
};

module.exports = Room;
