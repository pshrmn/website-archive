import React from 'react';

import GameBoard from './gameboard';
import ScoreBoard from './scoreboard';

const Room = React.createClass({
  leaveRoom: function(event){ 
    this.props.onMsg("leave", {
      room: this.props.name
    });
  },
  signalReady: function(event){
    this.props.onMsg("ready", {});
  },
  render: function() {
    /*
    props: 
      name
      people
        spectators
        players
        you
      gameState
        playing
        setup
          currentGame
          gameChoices
      game
      onMsg
    */
    var you = this.props.people.you;
    var readyText = (you && you.ready) ? "Not Ready" : "Ready";
    return (
      <div className="room">
      <div className="room-info">
        <h2>{this.props.name}</h2>
        <div className="controls">
          <button onClick={this.leaveRoom}>Leave Room</button>
          <button onClick={this.signalReady}>
            {readyText}
          </button>
        </div>
        <ScoreBoard {...this.props.people} />
      </div>
      <GameBoard onMsg={this.props.onMsg}
                 game={this.props.game}
                 you={this.props.people.you}
                 {...this.props.gameState} />
      </div>
    );
  }
});

export default Room;