import React from 'react';

/*
 * This is similar to the JoinRoomForm, but the user is already "in"
 * the room, so the name doesn't have to be provided.
 */
const RoomForm = React.createClass({
  contextTypes: {
    socket: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      nickname: "",
      password: ""
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return (nextState.nickname !== this.state.nickname ||
      nextState.password !== this.state.password ||
      nextProps.errors !== this.props.errors );
  },
  _formComplete: function() {
    return (this.state.nickname !== "" && this.state.password !== "");
  },
  _resetForm: function() {
    this.setState({
      nickname: "",
      password: ""
    });
  },
  joinRoom: function(event) {
    event.preventDefault();
    if ( this._formComplete() ) {
      this.context.socket.emit('join', Object.assign({}, this.state, {
        room: this.props.room
      }));
    }
  },
  setNickname: function(event) {
    this.setState({
      nickname: event.target.value
    });
  },
  setPassword: function(event) {
    this.setState({
      password: event.target.value
    });
  },
  render: function() {
    var hasErrors = (this.props.errors !== undefined && this.props.errors !== "");
    var errors = hasErrors ? (<p className="error" >Error: {this.props.errors}</p>) : "";
    return (
      <div className='room'>
        <div className='room-info'>
          <h2>{this.props.room}</h2>
          <form>
            {errors}
            <p>
            <label htmlFor="nickname">Nickname</label>
            <input type="text" id="nickname"
                 value={this.state.nickname}
                 onChange={this.setNickname} />
            </p>
            <p>
            <label htmlFor="password">Room Password</label>
            <input type="password" id="password"
                 value={this.state.password}
                 onChange={this.setPassword} />
            </p>
            <p>
            <button onClick={this.joinRoom}>Join Room</button>
            </p>
          </form>
        </div>
      </div>
    );
  }
});

export default RoomForm;