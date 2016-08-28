import React from 'react';
import io from 'socket.io-client';

import JoinRoomForm from './joinroom';
import Room from './room';

const App = React.createClass({
  getInitialState: function() {
    return {
      room: undefined
    };
  },
  componentDidMount: function() {
    /*
    create the socket and set any events to listen for
    */
    this.socket = io();
    var _this = this;

    this.socket.on('joined', function(resp){
      _this.setState({
        formErrors: resp.reason
      });
    });

    this.socket.on('left', function(msg) {
      _this.setState({
        room: undefined,
        player: undefined,
        game: undefined
      });
    });

    this.socket.on('roomState', function(state){
      _this.setState({
        room: state.room,
        player: state.player
      });
    });

    this.socket.on('gameState', function(game){
      _this.setState({
        game: game
      });
    });
  },
  /*
   * takes a message and sends it to the server
   * appends the name of the room for room specific commands
   * because of that, msg has to be an object
   */
  sendMessage: function(type, msg) {
    if ( this.state.room ) {
      msg.room = this.state.room.name;
    }
    this.socket.emit(type, msg);
  },
  render: function() {
    // when not connected to a room, show the join room form
    // otherwise show the room ui
    var room = ( this.state.room === undefined ) ? (
      <JoinRoomForm onMsg={this.sendMessage}
            errors={this.state.formErrors} />
      ) : (
      <Room onMsg={this.sendMessage}
          game={this.state.game}
          {...this.state.room} />
      );
    return (
      <div className='ui'>
      { room }
      </div>
    );
  }
});

export default App;
