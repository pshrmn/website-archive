/*
 *
 */
function TicTacToe(socket, owner, name, password) {
  this.socket = socket;
  this.minPlayers = 2;
  this.maxPlayers = 2;
  this.password = password;
  this.owner = owner;
  this.name = name;

  this.columns = 3;
  this.rows = 3;
  this.board = emptyBoard(this.columns, this.rows);
  this.active = false;
  
  this.pieces = ["X", "O"]
  this.turn = 0;

  this.players = [owner];

  var _this = this;
  this.socket.on("add player", function(msg){
    _this.addPlayer(msg);
  })
}

TicTacToe.prototype.addPlayer = function(player, password) {
  // dangerous?
  if ( this.players.length < this.maxPlayers ) {
    this.players.push(player);
    player.socket.join(this.name);
    return true;
  }
  return false;
};

TicTacToe.prototype.removePlayer = function(player) {
  return false
}

TicTacToe.prototype.startGame = function() {
  if ( this.players.length >= this.minPlayers ) {

  }
};

TicTacToe.prototype.info = function() {
  var players = this.players.map(function(p){
    return p.nickname;
  });
  return {
    name: this.name,
    players: players,
    game: "Tic-Tac-Toe"
  };
};

TicTacToe.prototype.placePiece = function(column, row) {
  var board = this.board;
  this.socket.emit("game state", {
    board: board
  });
};

TicTacToe.prototype.checkForGameEnd = function() {
  return false
};

function emptyBoard(columns, rows) {
  var board = [];
  for ( var c=0; c<columns; c++ ) {
    var col = [];
    for ( var r=0; r<rows; r++ ) {
      col.push(undefined);
    }
    board.push(col);
  }
  return board;
}

module.exports = TicTacToe;
