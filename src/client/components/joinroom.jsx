import React from 'react';

const JoinRoomForm = React.createClass({
  contextTypes: {
    socket: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      nickname: "",
      room: "",
      password: ""
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return (nextState.nickname !== this.state.nickname ||
      nextState.room !== this.state.room ||
      nextState.password !== this.state.password ||
      nextProps.errors !== this.props.errors );
  },
  _formComplete: function() {
    return (this.state.nickname !== "" && this.state.room !== "" &&
      this.state.password !== "");
  },
  _resetForm: function() {
    this.setState({
      nickname: "",
      room: "",
      password: ""
    });
  },
  joinRoom: function(event) {
    event.preventDefault();
    if ( this._formComplete() ) {
      this.context.socket.emit('join', this.state);
    }
  },
  setNickname: function(event) {
    this.setState({
      nickname: event.target.value
    });
  },
  setRoom: function(event) {
    this.setState({
      room: event.target.value
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
      <div className="login-form">
        <form>
          {errors}
          <p>
          <label htmlFor="nickname">Nickname</label>
          <input type="text" id="nickname"
               value={this.state.nickname}
               onChange={this.setNickname} />
          </p>
          <p>
          <label htmlFor="room">Room</label>
          <input type="text" id="room"
               value={this.state.room}
               onChange={this.setRoom} />
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
    );
  }
});

export default JoinRoomForm;