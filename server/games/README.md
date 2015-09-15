_This is a rough draft_

##Games Interface

####`Game(players)`

Constructor. It takes an argument `players` which is an array of players.

    var g = new Game(players);

####`Game.update(state)`

Takes an argument with an updated `state` based on user input. Returns the game's new state. The state should be able to get across the game's current state (eg active, player 1 wins, draw), the board, and which players' turn it is. Once the turn has completed, the function returns the new state of the game.

    {
        state: {
            active: false,
            msg: "Player 1 Wins!",
            nextPlayer: "Player 1"
        },
        board: {
            ...
        }
    }

####`Game.state()`

Returns an object representing the game's current state.
