import React from 'react';

import RoomLogin from '../components/roomform';
import Room from '../components/room';

const RoomPage = React.createClass({
  contextTypes: {
    room: React.PropTypes.object,
  },
  render: function() {
    // first, we need to verify whether or not the user is allowed in the room
    // if the are not, show them the login form
    // if the are, show them the room
    const {
      routeParams
    } = this.props;
    const mustLogIn = this.context.room === undefined || this.context.room.name !== routeParams.room;
    return (
      <div>
        { mustLogIn ? <RoomLogin room={routeParams.room} /> : <Room {...this.context.room} /> }
      </div>
    );
  }
});

export default RoomPage;