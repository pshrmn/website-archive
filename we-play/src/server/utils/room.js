import GameManager from './manager';

/*
 * A room is used for 2+ people to play a game.
 */
export default function Room(socket, owner, name, password) {
  this.socket = socket;
  this.name = name;
  this.owner = owner;
  this.password = password;

  this.people = [owner];

  this.gameManager = new GameManager(this);

  owner.send('joined', {
    error: false,
    reason: 'Successfully created room',
    room: this.name
  });

  this.emitPlayerState();
}

/*
 * Add a new player if the room is under capacity and the correct password
 * is given.
 */
Room.prototype.addPlayer = function(player, password) {
  var error = false;
  var reason = '';
  if ( password !== this.password ) {
    error = true;
    reason = `You entered the incorrect password`;
  } else if ( nameTaken(player.name, this.people) ) {
    error = true;
    reason = 'There is already a player with this nickname in the room';
  } else {
    this.people.push(player);
    player.join(this.name);
    this.emitPlayerState();
  }
  player.send('joined', {
    error: error,
    reason: reason,
    room: this.name
  });
  return !error;
};

/*
 * Remove a player from the room using the player's socket id
 */
Room.prototype.removePlayer = function(playerID) {
  let found = false;
  let wasOwner = false;
  let spliceIndex;
  // filter out the player being removed
  this.people.forEach((player, index) => {
    if ( player.is(playerID) ) {
      if ( this.owner.name === player.name ) {
        wasOwner = true;
      }
      player.leave(this.name, function() {
        player.send('left', 'left room');
      });
      found = true;
      spliceIndex = index;
    }
  }, this);

  if ( found ) {
    this.people.splice(spliceIndex, 1);
    // if the owner has left, the person who has been in the room the next
    // longest is made the new owner. not a perfect system, but good enough.
    if ( wasOwner && this.people.length ) {
      this.owner = this.people[0];
      this.people[0].owner = true;
    }
    this.gameManager.playerLeft(playerID);
    this.emitPlayerState();
  }
  return found;
};

/*
 * Check to see if all of the players are still in the room.
 */
Room.prototype.updatePlayers = function() {
  const connected = Object.keys(this.socket.connected);
  let setNewOwner = false;
  if ( connected.length !== this.people.length ) {
    // find any players that have left, and remove them. If the owner left
    // set a new owner
    const allPeople = this.people.reduce((acc, player) => {
      const stillConnected = connected.some(socketID => player.is(socketID));
      if ( stillConnected ) {
        acc.people.push(player);
      } else {
        acc.left.push(player);
      }
      return acc;
    }, {
      people: [],
      left: []
    });

    this.people = allPeople.people;
    allPeople.left.forEach(p => {
      this.gameManager.playerLeft(p.socket.id);
      if ( p.owner ) {
        setNewOwner = true;
      }
    });

    if ( setNewOwner && this.people.length ) {
      this.owner = this.people[0];
      this.people[0].owner = true;
    }

    this.emitPlayerState();
  }
};

/*
 * the game master should delete the room when no players are in it
 */
Room.prototype.shouldDelete = function() {
  return this.people.length === 0;
};

/*
 * send an 'update room' message to each player in the room
 */
Room.prototype.emitPlayerState = function() {
  const roomState = this.state();

  // send out to each player so they can see their own information
  this.people.forEach(p => {
    roomState.people.you = p.description();
    p.send('update room', roomState);
  });
};

/*
 * Information about the state of the room
 */
Room.prototype.state = function() {
  const players = [];
  const spectators = [];
  this.people.forEach(p => {
    const desc = p.description();
    if ( p.ready ) {
      players.push(desc);
    } else {
      spectators.push(desc);
    }
  });

  // this contains information about the possible games and whether
  // or not a game is being played, *not* the state of the game board
  const gameState = this.gameManager.state();
  return {
    name: this.name,
    people: {
      spectators: spectators,
      players: players
    },
    game: gameState
  }
};

Room.prototype.togglePlayer = function(socketID) {
  // can't toggle while playing
  if ( this.gameManager.playing ) {
    return;
  }
  var players = [];
  var spectators = [];

  this.people.forEach(p => {
    if ( p.is(socketID) ) {
      p.ready = !p.ready;
    }

    if ( p.ready ) {
      players.push(p);
    } else {
      spectators.push(p);
    }
  });
  this.gameManager.setPlayers(players, spectators);
  this.emitPlayerState();
};

Room.prototype.setGame = function(gameName, socketID) {
  // only the owner can set the game type
  if ( !this.owner.is(socketID) ) {
    return;
  }
  var set = this.gameManager.setGame(gameName);
  if ( set ) {
    // reset the ready on all players when the game switches?
    this.people.forEach(p => {
      p.ready = false;
    });
    this.emitPlayerState();
  }
}

Room.prototype.endGame = function() {
  this.emitPlayerState();
}

Room.prototype.updateGame = function(state, socketID) {
  this.gameManager.update(state, socketID);
};

/*
 * Check if a user with the given name already exists in the room
 */
function nameTaken(name, used) {
  return used.some(p => p.name === name);
};