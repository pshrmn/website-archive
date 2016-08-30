import React from 'react';
import { connect } from 'react-redux';

import GameBoard from './gameboard';
import ScoreBoard from './scoreboard';
import {
  leaveRoom,
  toggleReady
} from '../actions';

const Room = React.createClass({
  leaveRoom: function(event){ 
    this.props.leaveRoom(this.props.room.name);
  },
  signalReady: function(event){
    this.props.toggleReady(this.props.room.name);
  },
  render: function() {
    var you = this.props.people.you;
    var readyText = (you && you.ready) ? 'Not Ready' : 'Ready';
    return (
      <div className='room'>
        <div className='room-info'>
          <h2>{this.props.name}</h2>
          <div className='controls'>
            <button onClick={this.leaveRoom}>Leave Room</button>
            <button onClick={this.signalReady}>
              {readyText}
            </button>
          </div>
          <ScoreBoard {...this.props.people} />
        </div>
        <GameBoard />
      </div>
    );
  }
});

export default connect(
  state => ({
    room: state.room
  }),
  {
    leaveRoom,
    toggleReady
  }
)(Room);