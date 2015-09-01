import React from "react";
import TicTacToe from "./tictactoe";
import Four from "./four";

export default React.createClass({
  sendGame: function(event){
    var game = event.target.value;
    this.props.onMsg("set game", {
      game: game
    });
  },
  _gameSetup: function() {
    var gameName = this.props.currentGame;
    var html;
    if ( this.props.isOwner ) {
      var choices = this.props.gameChoices.map(function(choice, index){
        return (
          <label key={index}>
            {choice}
            <input type="radio"
                   name="game"
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
      html = "Playing: " + gameName;
    }
    return this.props.playing ? "" : (
      <div className="gameSetup">
        {html}
      </div>
    );
  },
  _gameComponent: function() {
    var game;
    if ( this.props.game ) {
      switch ( this.props.game.name ) {
      case "Tic Tac Toe":
        game = (
          <TicTacToe onMsg={this.props.onMsg}
                     you={this.props.you}
                     {...this.props.game} />
        );
        break;
      case "Four":
        game = (
          <Four onMsg={this.props.onMsg}
                     you={this.props.you}
                {...this.props.game} />
        );
        break;
      default:
        game = "";
      }
    }
    var turn = "";
    if ( this.props.game ) {
      turn = (this.props.game.nextPlayer === this.props.you.name) ? 
        "Your Turn" : this.props.game.nextPlayer + "'s Turn";
    }
    return (
      <div className="game">
        {turn}
        {game}
      </div>
    );
  },
  render: function() {
    /*
    game
    isOwner
    you
    gameInfo
      currentGame
      playing
      gameChoices
    */
    var setup = this.props.playing ? "" : this._gameSetup();
    var game = this._gameComponent();
    return (
      <div className="gameBoard">
        {setup}
        {game}
      </div>
    );
  }
});
