import React from 'react';
import TicTacToe from './games/tictactoe';
import Four from './games/four';

const GameBoard = React.createClass({
  _gameComponent: function() {
    var game;
    if ( this.props.game ) {
      switch ( this.props.game.name ) {
      case 'Tic Tac Toe':
        game = (
          <TicTacToe you={this.props.you}
                     {...this.props.game} />
        );
        break;
      case 'Four':
        game = (
          <Four you={this.props.you}
                {...this.props.game} />
        );
        break;
      default:
        game = '';
      }
    }
    var turn = '';
    if ( this.props.game ) {
      turn = (this.props.game.nextPlayer === this.props.you.name) ? 
        'Your Turn' : this.props.game.nextPlayer + '\'s Turn';
    }
    return (
      <div className='game'>
        {turn}
        {game}
      </div>
    );
  },
  render: function() {
    /*
    game
    you
    gameInfo
      playing
      setup
        currentGame
        gameChoices
    */
    var setup = this.props.playing ? null : (
      <GameSetup you={this.props.you}
                 {...this.props.setup} />
    );
    var game = this._gameComponent();
    return (
      <div className='gameboard'>
        {setup}
        {game}
      </div>
    );
  }
});

export default GameBoard;

var GameSetup = React.createClass({
  contextTypes: {
    socket: React.PropTypes.object,
    room: React.PropTypes.object
  },
  sendGame: function(event){
    this.context.socket.emit('set game', {
      room: this.context.room.name,
      game: event.target.value
    });
  },
  render: function() {
    var gameName = this.props.currentGame;
    var html;
    if ( this.props.you.owner ) {
      var choices = this.props.gameChoices.map(function(choice, index){
        return (
          <label key={index}>
            {choice}
            <input type='radio'
                   name='game'
                   checked={choice === gameName}
                   value={choice}
                   onChange={this.sendGame} />
          </label>
        );
      }, this);

      html = (
        <div>
          <p>Select the game to play:</p>
          {choices}
        </div>
      );
    } else {
      html = 'Playing: ' + gameName;
    }
    return this.props.playing ? '' : (
      <div className='game-setup'>
        {html}
      </div>
    );
  }
});
