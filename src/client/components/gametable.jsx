import React from 'react';
import { connect } from 'react-redux';

import {
  setGame,
  submitTurn
} from '../actions';

import TicTacToe from './games/tictactoe';
import Four from './games/four';

/*
 * The GameTable consists of two parts, a setup area and a
 * board area. The setup area is used when a game isn't being
 * played. The "owner" of the room can change which game is
 * going to be played. When a game is being played, the the
 * game board is rendered.
 */
const GameTable = React.createClass({
  render: function() {
    const {
      room,
      game,
      setGame,
      submitTurn
    } = this.props;
    if ( !room ) {
      return null;
    }
    // the setup and board are rendered separately so that you can still
    // see the board after a game has completed (until a new one starts)
    return (
      <div className='gameboard'>
        <GameSetup room={room}
                   setGame={setGame} />
        <GameBoard room={room}
                   game={game}
                   submitTurn={submitTurn} />
      </div>
    );
  }
});

export default connect(
  state => ({
    room: state.room,
    game: state.game
  }),
  {
    setGame,
    submitTurn
  }
)(GameTable);

function GameBoard(props) {
  const {
    game,
    room,
    submitTurn
  } = props;
  let gameboard = null;
  let turn = '';
  if ( game !== undefined ) {
    const you = room.people.you;
    const next = game.nextPlayer;

    switch ( game.name ) {
    case 'Tic Tac Toe':
      gameboard = (
        <TicTacToe you={you}
                   roomName={room.name}
                   submitTurn={submitTurn}
                   {...game} />
      );
      break;
    case 'Four':
      gameboard = (
        <Four you={you}
              roomName={room.name}
              submitTurn={submitTurn}
              {...game} />
      );
      break;
    default:
      gameboard = null;
    }
    turn = (next === you.name) ? 'Your Turn' : `${next}'s Turn`;
  }
  return (
    <div className='game'>
      {turn}
      {gameboard}
    </div>
  );
}

const GameSetup = React.createClass({
  selectGame: function(event){
    const {
      setGame,
      room
    } = this.props;
    setGame(room.name, event.target.value);
  },
  render: function() {   
    const {
      room
    } = this.props;
    if ( !room ) {
      return null;
    }

    const you = room.people.you;
    const game = room.game;
    if ( game.playing ) {
      return null;
    }

    const setup = game.setup;
    const gameName = setup.currentGame;
    let html
    if ( you !== undefined && you.owner ) {
      const choices = setup.gameChoices.map((choice, index) => 
        <label key={index}>
          <input type='radio'
                 name='game'
                 checked={choice === gameName}
                 value={choice}
                 onChange={this.selectGame} />
          {choice}
        </label>
      );

      html = (
        <div>
          <p>Select the game to play:</p>
          {choices}
        </div>
      );
    } else {
      html = 'Playing: ' + gameName;
    }
    return (
      <div className='game-setup'>
        {html}
      </div>
    );
  }
});
