import React from 'react';
import { connect } from 'react-redux';

import { RoomLoginForm } from '../components/roomform';
import RoomInfo from '../components/room';
import GameTable from '../components/gametable';

import { leaveRoom } from '../actions';

const RoomPage = React.createClass({
  render: function() {
    // first, we need to verify whether or not the user is allowed in the room
    // if the are not, show them the login form
    // if the are, show them the room
    const {
      routeParams,
      room
    } = this.props;
    const mustLogIn = room === undefined || room.name !== routeParams.room;
    return (
      <div className='room'>
        <div className='room-info'>
          { mustLogIn ? <RoomLoginForm room={routeParams.room} /> : <RoomInfo /> }
        </div>
        <GameTable />
      </div>
    );
  },
  componentWillUnmount: function() {
    if ( this.props.room !== undefined ) {
      this.props.leaveRoom(this.props.room.name);
    }
  }
});

export default connect(
  state => ({
    room: state.room
  }),
  {
    leaveRoom
  }
)(RoomPage);