function Player(nickname, socket) {
    this.nickname = nickname;
    this.socket = socket;
}

Player.prototype.send = function(type, msg){
    this.socket.emit(type, msg);
};

module.exports = Player;