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

  var _this = this;
  this.socket.on("add player", function(msg){
    _this.addPlayer(msg);
  });

  this.info();
}

Room.prototype.addPlayer = function(player, password) {
  // dangerous?
  if ( this.players.length < this.maxPlayers ) {
    this.players.push(player);
    player.socket.join(this.name);
    this.info();
    player.socket.emit("join", {
      error: false,
      reason: ""
    });
  } else {
    player.socket.emit("join", {
      error: true,
      reason: "Too many players already in the room"
    });
  }
};

Room.prototype.removePlayer = function(player) {
  return false
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
  this.socket.emit("info", {
    name: this.name,
    players: players
  });
};

module.exports = Room;
