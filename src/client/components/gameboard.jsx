import React from 'react';
import { connect } from 'react-redux';

import {
  setGame
} from '../actions';

import TicTacToe from './games/tictactoe';
import Four from './games/four';

const GameBoard = React.createClass({
  _gameComponent: function() {
    const {
      game,
      room
    } = this.props;

    let gameboard;
    let turn = '';
    if ( game !== undefined && room.game.playing ) {
      const you = room.people.you;
      const next = game.nextPlayer;

      switch ( game.name ) {
      case 'Tic Tac Toe':
        gameboard = (
          <TicTacToe you={you}
                     {...game} />
        );
        break;
      case 'Four':
        gameboard = (
          <Four you={you}
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
  },
  render: function() {
    const {
      room,
      game
    } = this.props;
    const setup = room.game && room.game.playing ? null : (
      <GameSetup />
    );
    // the setup and board are rendered separately so that you can still
    // see the board after a game has completed (until a new one starts)
    return (
      <div className='gameboard'>
        {setup}
        {this._gameComponent()}
      </div>
    );
  }
});

export default connect(
  state => ({
    room: state.room,
    game: state.game
  })
)(GameBoard);

const GameSetup = connect(
  state => ({
    room: state.room
  }),
  {
    setGame
  }
)(React.createClass({
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
          {choice}
          <input type='radio'
                 name='game'
                 checked={choice === gameName}
                 value={choice}
                 onChange={this.selectGame} />
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
}));
