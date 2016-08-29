import React from 'react';
import io from 'socket.io-client';

const App = React.createClass({
  // This should be created in the browser, but not when rendering
  // on the server.
  socket: typeof window !== 'undefined' ? io() : undefined,
  getInitialState: function() {
    return {
      room: undefined,
      game: undefined
    };
  },
  contextTypes: {
    router: React.PropTypes.object
  },
  childContextTypes: {
    socket: React.PropTypes.object,
    room: React.PropTypes.object,
    game: React.PropTypes.object
  },
  getChildContext: function() {
    return {
      socket: this.socket,
      room: this.state.room,
      game: this.state.game
    };
  },
  componentDidMount: function() {
    this.socket.on('joined', resp => {
      this.setState({
        formErrors: resp.reason
      });
      if( !resp.error && this.props.routeParams.room !== resp.room ) {
        this.context.router.push({
          pathname: `/r/${resp.room}`
        });
      }
    });

    this.socket.on('left', resp => {
      this.setState({
        room: undefined,
        game: undefined
      });
      this.context.router.push({
        pathname: `/`
      });
    });

    this.socket.on('roomState', resp => {
      this.setState({
        room: resp.room
      });
    });

    this.socket.on('gameState', resp => {
      this.setState({
        game: resp
      });
    });
  },
  render: function() {
    return (
      <div className='ui'>
        {this.props.children}
      </div>
    );
  }
});

export default App;
