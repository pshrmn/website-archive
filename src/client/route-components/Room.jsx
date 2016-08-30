import React from 'react';
import { connect } from 'react-redux';

import RoomLogin from '../components/roomform';
import Room from '../components/room';

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
      <div>
        { mustLogIn ? <RoomLogin room={routeParams.room} /> : <Room {...room} /> }
      </div>
    );
  }
});

export default connect(
  state => ({
    room: state.room
  })
)(RoomPage);