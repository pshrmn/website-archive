import React from 'react';
import { connect } from 'react-redux';

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
    const {
      room
    } = this.props;
    const you = room.people.you;
    return (
      <div>
        <h2>{room.name}</h2>
        <div className='controls'>
          <button onClick={this.leaveRoom}>
            Leave Room
          </button>
          <button onClick={this.signalReady}>
            { you && you.ready ? 'Not Ready' : 'Ready' }
          </button>
        </div>
        <ScoreBoard {...room.people} />
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