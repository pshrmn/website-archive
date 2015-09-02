function Player(name, socket) {
  this.name = name;
  this.ready = false;
  this.wins = 0;

  this.socket = socket;
}

Player.prototype.description = function() {
  return {
    name: this.name,
    wins: this.wins,
    ready: this.ready
  };
};

Player.prototype.is = function(socketID) {
  return this.socket.id === socketID;
};

Player.prototype.send = function(type, msg) {
  this.socket.emit(type, msg);
};

Player.prototype.join = function(room, callback) {
  this.socket.join(room, callback);
};

Player.prototype.leave = function(room, callback) {
  this.socket.leave(room, callback);
};

module.exports = Player;