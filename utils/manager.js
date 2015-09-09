var GameOptions = require("../games/gameoptions");

/*
 * A GameManager handles the gameplay for the room. 
 *
 * PREGAME:
 * When no game is being played, the GameManager allows the owner of the room to
 * specify which game will be played next. During this time, players can select 
 * that they are "ready" to play. A game has a minimum and maximum number of
 * players that can play it. When the maximum number of players has readied up,
 * the game will automatically start. If there is a difference between maximum
 * and minimum players, once the minimum number has been reached, the game
 * will wait a short amount of time and then automatically start. If another
 * player joins and the count is at maximum, the game will start, otherwise
 * the waiting period will reset.
 *
 * GAME:
 * When a player makes a move, that move is passed on to the game. The game
 * responds with the new state of the game, which is passed on to all of the
 * players and spectators.
 */
function GameManager(room) {
  this.gameNames = Object.keys(GameOptions);
  this.room = room;

  // default to the first game in the list
  this.currentGame = this.gameNames[0];
  this.gameData = GameOptions[this.currentGame];
  this.game = undefined;

  this.players = [];
  this.spectators = [];
  this.playing = false;
  
  // the only games so far are two players only, so this is just for the future
  this.timeout;
}

GameManager.prototype.update = function(state, socketID) {
  if ( !this.playing || !this.game ) {
    return;
  }
  var newState = this.game.update(state, socketID);
  if ( newState ) {
    this.broadcast("gameState", newState);
  }
};

/*
 * Return an object representing the state of the GameManager. This does
 * not return information about the game itself.
 */
GameManager.prototype.state = function() {
  return {
    playing: this.playing,
    setup: {
      gameChoices: this.gameNames,
      currentGame: this.currentGame
    }
  };
};

GameManager.prototype.broadcast = function(type, msg) {
    this.players.forEach(p => {
      p.send(type, msg);
    });
    this.spectators.forEach(p => {
      p.send(type, msg);
    });
};


GameManager.prototype.setGame = function(name) {
  if ( GameOptions[name] ) {
    this.currentGame  = name;
    this.gameData = GameOptions[name];
    return true;
  }
  return false;
};

GameManager.prototype.setPlayers = function(players, spectators) {
  this.players = players;
  this.spectators = spectators;
  this.tryToStart();
};

GameManager.prototype.tryToStart = function() {
  if ( this.timeout ) {
    clearTimeout(this.timeOut);
  }
  if ( this.players.length >= this.gameData.minPlayers ) {
    // if more players can be added, wait 10 seconds in case any one
    // else readies up, otherwise start the game right away
    if ( this.players.length < this.gameData.maxPlayers ) {
      this.timeOut = setTimeout(this.startGame.bind(this), 10000);
    } else {
      this.startGame();
    }
  }
};

/*
 * Start a new game.
 */
GameManager.prototype.startGame = function() {  
  try {
    this.game = new this.gameData.game(this.players, this);
    this.playing = true;
    this.broadcast("gameState", this.game.state());
  } catch(e) {
    console.error(e);
  }
};

GameManager.prototype.endGame = function(winner) {
  this.game = undefined;
  this.playing = false;
  this.players.forEach(p => {
    if ( winner !== undefined && p.name === winner ) {
      p.wins++;
    }
    p.ready = false;
  });
  this.reset();
  this.playing = false;
  this.room.endGame();
}

GameManager.prototype.addPlayer = function(player) {
  // find the player in the spectators and move to the players?
  this.players.push(player);
}

GameManager.prototype.reset = function() {
  this.players = [];
  this.spectators = [];
};

/*
 * when a player leaves, end the game. this is very basic and can be
 * fleshed out to handle different situations (forfeit, game continues with
 * other players, etc.)
 */
GameManager.prototype.playerLeft = function(socketID) {
  if ( !this.playing ) {
    return;
  }
  var found = this.players.some(p => {
    return p.is(socketID);
  });
  if ( found ) {
    this.endGame();
  }
};

module.exports = GameManager;
