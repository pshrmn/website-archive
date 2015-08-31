var exceptions = require("./exceptions");

function Four(players, room) {
  this.name = "Four";
  
  this.players = players;
  if ( this.players.length !== 2 ) {
    throw new exceptions.UserCount(this.players.length, 2);
  }
  this.index = Math.random() < 0.5 ? 0 : 1;
  this.current = this.players[this.index];

  this.pieces = ["black", "red"];
  this.board = emptyBoard();
  this.active = true;
  this.message = "";

  this.room = room;
}

Four.prototype.update = function(state, socketID) {
  if ( !this._canPlay(socketID) ) {
    return;
  }
  var column = state.column;
  // check if the piece can be placed
  if ( !this._emptySpace(column)) {
    return;
  }
  // figure out which row the piece goes in and place the piece
  var row = this._whichRow(column);
  if ( row === -1 ) {
    return ;
  }
  this.board[column][row] = this.pieces[this.index];
  this._checkForGameOver(column, row);
  if ( this.active ) {
    this._setNextPlayer();
  }

  var gameState = this.state();
  this.players.forEach(function(player){
    player.send("gameState", gameState);
  }, this);
};

Four.prototype.state = function() {
  return {
    name: this.name,
    active: this.active,
    msg: this.message,
    nextPlayer: this.current.name,
    board: this.board
  };
};

Four.prototype._canPlay = function(socketID) {
  return this.current.is(socketID);
};

Four.prototype._setNextPlayer = function() {
  this.index = (this.index+1) % this.players.length;
  this.current = this.players[this.index];
};


Four.prototype._emptySpace = function(column) {
  return this.board[column][0] === "";
};

Four.prototype._whichRow = function(column) {
  var col = this.board[column];
  for ( var i=col.length-1; i>=0; i-- ) {
    if ( col[i] === "" ) {
      return i;
    }
  }
  return -1;
};

Four.prototype._checkForGameOver = function(col, row) {
  // check for a win
  var arrs = GeneratePossibleWins(col, row, this.board);
  var won = arrs.some(function(arr){
    for ( var i=0; i < arr.length - 3; i++ ) {
      var slice = arr.slice(i, i+4)
      if ( AllTheSamePlayer(slice) ) {
        return true;
      }
    }
    return false
  });
  if ( won ) {
    this.active = false;
    this.message = this.current.name + " wins";
    this.room.endGame();    
    return;
  }

  // check for a tie
  var tie = this.board.every(function(column){
    return column[0] !== "";
  });
  if ( tie ) {
    this.active = false;
    this.message = "It's a draw";
    this.room.endGame();
    return;
  }

  this.message = "";
}

/*
 * UTILITY FUNCTIONS
 */

function emptyBoard() {
  return [["","","","","",""],
    ["","","","","",""],
    ["","","","","",""],
    ["","","","","",""],
    ["","","","","",""],
    ["","","","","",""],
    ["","","","","",""]];
}

function GeneratePossibleWins(colPos, rowPos, board) {
  // horizontal goes across columns
  var horizontalArray = [];
  var minX = Math.max(colPos - 3, 0);
  var maxX = Math.min(colPos + 3, board.length - 1);
  for ( var x = minX; x <= maxX; x++ ) {
    horizontalArray.push(board[x][rowPos]);
  }
  // vertical is a slice from a column
  var minY = Math.max(rowPos - 3, 0);
  var maxY = Math.min(rowPos + 3, board[0].length -1);
  var verticalArray = board[colPos].slice(minY, maxY + 1);
  // negative diagonal array
  var negativeArray = NegativeArray(colPos, rowPos, board);
  // positive diagonal array
  var postiveArray = PositiveArray(colPos, rowPos, board);
  return [horizontalArray, verticalArray, negativeArray, postiveArray];
}

function NegativeArray(xPos, yPos, board) {
  // determine how far left/up we can go
  var negX = xPos - Math.max(0, xPos-3);
  var negY = yPos - Math.max(0, yPos-3);
  var less = Math.min(negX, negY);

  // determine how far right/down we can go
  var posX = Math.min(board.length-1, xPos+3) - xPos;
  var posY = Math.min(board[0].length-1, yPos+3) - yPos;
  var more = Math.min(posX, posY);

  var negativeArray = [];
  var stopX = xPos + more;
  var stopY = yPos + more;
  for ( var x=xPos-less, y=yPos-less; (x <= stopX && y <= stopY); (x++ & y++)) {
    negativeArray.push(board[x][y]);
  }
  return negativeArray;
}

function PositiveArray(xPos, yPos, board) {
  // determine how far left/down we can go
  var negX = xPos - Math.max(0, xPos-3);
  var posY = Math.min(board[0].length-1, yPos+3) - yPos;
  var less = Math.min(negX, posY);
  
  // determine how far right/down we can go
  var posX = Math.min(board.length-1, xPos+3) - xPos;
  var negY = yPos - Math.max(0, yPos-3);
  var more = Math.min(posX, negY);

  var positiveArray = [];
  var stopX = xPos + more;
  var stopY = yPos - more;
  for ( var x=xPos-less, y=yPos+less ; (x <= stopX && y >= stopY); (x++ & y--)) {
    positiveArray.push(board[x][y]);
  }
  return positiveArray;
}

function AllTheSamePlayer(arr){
  var player = arr[0];
  if ( player === "" ) {
    return false;
  }
  return arr.every(function(piece){
    return piece === player;
  });
}

module.exports = Four;
