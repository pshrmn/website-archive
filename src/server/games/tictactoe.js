var exceptions = require("./exceptions");

function TicTacToe(players){
  this.name = "Tic Tac Toe";

  this.players = players;
  if ( this.players.length !== 2 ) {
    throw new exceptions.UserCount(this.players.length, 2);
  }
  // semi-random starting player
  this.index = 0;
  this.current = this.players[this.index];
  this.pieces = ["X", "O"];
  this.board = emptyBoard();
  this.active = true;
  this.message = "";
  this.result = {
    status: "ongoing",
    winner: undefined
  };

  this.moveID = 0;
}

/*
 * takes input (row and column) from a player and updates the state of the game
 * (if the player is allowed to play and the position is legal)
 */
TicTacToe.prototype.update = function(state, socketID) {
  if ( !this._canPlay(socketID) ) {
    return;
  }
  var row = state.row;
  var column = state.column;
  if ( !this._playablePosition(row, column) ) {
    // send a message to the current player???
    return;
  }
  this.board[row][column] = this.pieces[this.index];
  var over = this._checkForGameOver();
  if ( !over ) {
    this._setNextPlayer();
  }

  return this.state();
};

/*
 * returns an object representing the current state of the game
 */
TicTacToe.prototype.state = function() {
  return {
    name: this.name,
    active: this.active,
    msg: this.message,
    nextPlayer: this.current.name,
    board: this.board,
    result: this.result,
    id: this.moveID++
  };
};

/*
 * Verify that the game state update is allowed by checking if the socket
 * that sent the message is the same as the socket of the current player.
 */
TicTacToe.prototype._canPlay = function(socketID) {
  return this.current.is(socketID);
}

/*
 * Change the current player and the index (which is used to determine what
 * type of piece to place).
 */
TicTacToe.prototype._setNextPlayer = function() {
  this.index = (this.index+1) % this.players.length;
  this.current = this.players[this.index];
};

/*
 * Check if the position the player sent is a legal position.
 */
TicTacToe.prototype._playablePosition = function(row, column) {
  return this.board[row][column] === "";
};

/*
 * Determine if the game has reached an end state
 */
TicTacToe.prototype._checkForGameOver = function() {
  if ( this._checkForWin() ) {
    this.active = false;
    this.result = {
      status: "win",
      winner: this.current.name
    };
    this.message = this.current.name + " wins";
    return true;
  } else if ( this._checkForTie() ) {
    this.active = false;
    this.result = {
      status: "tie",
      winner: undefined
    };
    this.message = "It's a draw";
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

  return combos.some(combo => {
    var cells = combo.map(cell => {
      return this.board[cell[0]][cell[1]];
    });
    return allTheSame(cells);
  });
};

/*
 * check if every cell is filled (called after checkForWin since a win can occur
 * on the turn that fills the board)
 */
TicTacToe.prototype._checkForTie = function() {
  return this.board.every(row => {
    return row.every(cell => {
      return cell !== "";
    });
  });
};

/*
 * UTILITY FUNCTIONS
 */

function allTheSame(cells) {
  var first = cells[0];
  if ( first === "" ) {
    return false;
  }
  return cells.every(c => {
    return c === first;
  });
}

function emptyBoard() {
  return [["","",""],
    ["","",""],
    ["","",""]];
}

module.exports = {
  game: TicTacToe,
  minPlayers: 2,
  maxPlayers: 2
};
