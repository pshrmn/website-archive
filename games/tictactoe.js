var exceptions = require("./exceptions");

function TicTacToe(players, room){
  this.name = "Tic Tac Toe";

  // players should only be of length 2
  this.players = players;
  if ( this.players.length !== 2 ) {
    throw new exceptions.UserCount(this.players.length, 2);
  }
  // semi-random starting player
  this.index = Math.random() < 0.5 ? 0 : 1;
  this.current = this.players[this.index];

  this.pieces = ["X", "O"];
  this.board = emptyBoard();
  this.active = true;
  this.message = "";

  this.room = room;
}

/*
 * The TicTacToe state should be the row and column the player
 * intends to mark
 */
TicTacToe.prototype.update = function(state, socketID) {
  if ( !this._canPlay(socketID) ) {
    return;
  }
  var row = state.row;
  var column = state.column;
  if ( !this._emptySpace(row, column) ) {
    // send a message to the current player???
    return;
  }
  this.board[row][column] = this.pieces[this.index];
  var over = this._checkForGameOver();
  if ( !over ) {
    this._setNextPlayer();
  }

  var gameState = this.state();
  this.players.forEach(function(player){
    player.send("gameState", gameState);
  }, this);
};

TicTacToe.prototype.state = function() {
  return {
    name: this.name,
    active: this.active,
    msg: this.message,
    nextPlayer: this.current.name,
    board: this.board,
  };
};

TicTacToe.prototype._canPlay = function(socketID) {
  return this.current.is(socketID);
}

TicTacToe.prototype._emptySpace = function(row, column) {
  return this.board[row][column] === "";
};

TicTacToe.prototype._setNextPlayer = function() {
  this.index = (this.index+1) % this.players.length;
  this.current = this.players[this.index];
};

/*
 * 
 */
TicTacToe.prototype._checkForGameOver = function() {
  if ( this._checkForWin() ) {
    this.active = false;
    this.message = this.current.name + " wins";
    this.room.endGame();    
    return true;
  } else if ( this._checkForTie() ) {
    this.active = false;
    this.message = "It's a draw";
    this.room.endGame();
    return true;
  } else {
    this.message = "";
    return false;
  }
};

TicTacToe.prototype._checkForWin = function() {
  // brute force, check every possibility (only 8)
  var combos = [
    [[0,0],[0,1],[0,2]],
    [[1,0],[1,1],[1,2]],
    [[2,0],[2,1],[2,2]],
    [[0,0],[1,0],[2,0]],
    [[0,1],[1,1],[2,1]],
    [[0,2],[1,2],[2,2]],
    [[0,0],[1,1],[2,2]],
    [[2,0],[1,1],[0,2]]
  ];

  return combos.some(function(combo){
    var cells = combo.map(function(cell){
      return this.board[cell[0]][cell[1]];
    }, this);
    return allTheSame(cells);
  }, this);
};

/*
 * check if every cell is filled (called after checkForWin since a win can occur
 * on the turn that fills the board)
 */
TicTacToe.prototype._checkForTie = function() {
  return this.board.every(function(row){
    return row.every(function(cell){
      return cell !== "";
    }, this);
  }, this);
};

function allTheSame(cells) {
  var first = cells[0];
  if ( first === "" ) {
    return false;
  }
  return cells.every(function(c){
    return c === first;
  });
}

function emptyBoard() {
  return [["","",""],
    ["","",""],
    ["","",""]];
}

module.exports = TicTacToe;
