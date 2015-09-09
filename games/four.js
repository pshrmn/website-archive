var exceptions = require("./exceptions");

function Four(players, manager) {
  this.name = "Four";
  this.manager = manager;
  
  this.players = players;
  if ( this.players.length !== 2 ) {
    throw new exceptions.UserCount(this.players.length, 2);
  }
  this.index = Math.floor(Math.random() * this.players.length);
  this.current = this.players[this.index];

  this.pieces = ["black", "red"];
  this.board = emptyBoard();
  this.active = true;
  this.message = "";

}

/*
 * takes input (column) from a player and updates the state of the game
 * (if the player is allowed to play and the position is legal)
 */
Four.prototype.update = function(state, socketID) {
  if ( !this._canPlay(socketID) ) {
    return;
  }

  var column = state.column;
  if ( !this._playablePosition(column)) {
    return;
  }

  var row = this._whichRow(column);
  if ( row === -1 ) {
    return;
  }

  this.board[column][row] = this.pieces[this.index];
  this._checkForGameOver(column, row);
  if ( this.active ) {
    this._setNextPlayer();
  }

  return this.state();
};

/*
 * returns an object representing the current state of the game
 */
Four.prototype.state = function() {
  return {
    name: this.name,
    active: this.active,
    msg: this.message,
    nextPlayer: this.current.name,
    board: this.board
  };
};

/*
 * Verify that the game state update is allowed by checking if the socket
 * that sent the message is the same as the socket of the current player.
 */
Four.prototype._canPlay = function(socketID) {
  return this.current.is(socketID);
};

/*
 * Change the current player and the index (which is used to determine what
 * type of piece to place).
 */
Four.prototype._setNextPlayer = function() {
  this.index = (this.index+1) % this.players.length;
  this.current = this.players[this.index];
};

/*
 * Check if the position the player sent is a legal position.
 */
Four.prototype._playablePosition = function(column) {
  return this.board[column][0] === "";
};

/*
 * Determine which row in the column the piece should be placed in.
 * The row is the one closest to the bottom without a piece in it.
 */
Four.prototype._whichRow = function(column) {
  var col = this.board[column];
  for ( var i=col.length-1; i>=0; i-- ) {
    if ( col[i] === "" ) {
      return i;
    }
  }
  return -1;
};

/*
 * Determine if the game has reached an end state
 */
Four.prototype._checkForGameOver = function(col, row) {
  // check for a win
  var arrs = generatePossibleWins(col, row, this.board);
  var won = arrs.some(arr => {
    for ( var i=0; i < arr.length - 3; i++ ) {
      var slice = arr.slice(i, i+4)
      if ( allTheSamePlayer(slice) ) {
        return true;
      }
    }
    return false
  });
  if ( won ) {
    this.active = false;
    this.message = this.current.name + " wins";
    this.manager.endGame(this.current.name);
    return;
  }

  // check for a tie
  var tie = this.board.every(column => {
    return column[0] !== "";
  });
  if ( tie ) {
    this.active = false;
    this.message = "It's a draw";
    this.manager.endGame();
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

/*
 * given a position <column, row>, create horizontal, vertical, and diagonal arrays
 * three pieces in either direction from the position
 */
function generatePossibleWins(colPos, rowPos, board) {
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
  var negArray = negativeArray(colPos, rowPos, board);
  // positive diagonal array
  var posArray = positiveArray(colPos, rowPos, board);
  return [horizontalArray, verticalArray, negArray, posArray];
}

/*
 * -column, -row to the left, +column, +row to the right
 */
function negativeArray(column, row, board) {
  // determine how far left/up we can go
  var negX = column - Math.max(0, column-3);
  var negY = row - Math.max(0, row-3);
  var less = Math.min(negX, negY);

  // determine how far right/down we can go
  var posX = Math.min(board.length-1, column+3) - column;
  var posY = Math.min(board[0].length-1, row+3) - row;
  var more = Math.min(posX, posY);

  var negativeArray = [];
  var stopX = column + more;
  var stopY = row + more;
  for ( var x=column-less, y=row-less; (x <= stopX && y <= stopY); (x++ & y++)) {
    negativeArray.push(board[x][y]);
  }
  return negativeArray;
}

/*
 * -column, +row to the left, +column, -row to the right
 */
function positiveArray(column, row, board) {
  // determine how far left/down we can go
  var negX = column - Math.max(0, column-3);
  var posY = Math.min(board[0].length-1, row+3) - row;
  var less = Math.min(negX, posY);
  
  // determine how far right/down we can go
  var posX = Math.min(board.length-1, column+3) - column;
  var negY = row - Math.max(0, row-3);
  var more = Math.min(posX, negY);

  var positiveArray = [];
  var stopX = column + more;
  var stopY = row - more;
  for ( var x=column-less, y=row+less ; (x <= stopX && y >= stopY); (x++ & y--)) {
    positiveArray.push(board[x][y]);
  }
  return positiveArray;
}

function allTheSamePlayer(arr){
  var player = arr[0];
  if ( player === "" ) {
    return false;
  }
  return arr.every(piece => {
    return piece === player;
  });
}

module.exports = {
  game: Four,
  minPlayers: 2,
  maxPlayers: 2
};
