/*
 *
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

Room.prototype.hasPlayer = function(name) {
  return this.players.some(function(p){
    return p.nickname === name;
  });
}

Room.prototype.addPlayer = function(player, password) {
  if ( password !== this.password ) {
    player.socket.emit("join", {
      error: true,
      reason: "Room " + this.name + " exists, but you entered the incorrect password"
    });
  } else if ( this.players.length >= this.maxPlayers ) {
    player.socket.emit("join", {
      error: true,
      reason: "Too many players already in the room"
    });
  } else if ( this.hasPlayer(player.nickname) ) {
    player.socket.emit("join", {
      error: true,
      reason: "There is already a player with this nickname in the room"
    });
  } else {
    this.players.push(player);
    player.socket.join(this.name);
    this.info();
    player.socket.emit("join", {
      error: false,
      reason: ""
    });
  }
};

Room.prototype.removePlayer = function(playerID) {
  var leavingPlayer;
  var connected = Object.keys(this.socket.connected);
  this.players = this.players.filter(function(player){
    var id = player.socket.id;
    if ( playerID === id ) {
      leavingPlayer = player;
    }
    return playerID !== id;
  });
  if ( leavingPlayer ) {
    var _this = this;
    leavingPlayer.socket.leave(this.name, function() {
      leavingPlayer.socket.emit("left", "left room");
    });
    this.info();
  }
}

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

Room.prototype.info = function() {
  var players = this.players.map(function(p){
    return p.nickname;
  });
  this.socket.to(this.name).emit("info", {
    name: this.name,
    players: players
  });
};

module.exports = Room;
