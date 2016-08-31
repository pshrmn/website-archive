import React from 'react';
import { connect } from 'react-redux';

import { joinRoom } from '../actions';

/*
 * This is similar to the JoinRoomForm, but the user is already "in"
 * the room, so the name doesn't have to be provided.
 */
const RoomForm = React.createClass({
  getInitialState: function() {
    return {
      nickname: "",
      password: ""
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return (nextState.nickname !== this.state.nickname ||
      nextState.password !== this.state.password ||
      nextProps.error !== this.props.error );
  },
  _formComplete: function() {
    return (this.state.nickname !== "" && this.state.password !== "");
  },
  joinRoom: function(event) {
    event.preventDefault();
    if ( this._formComplete() ) {
      const {
        nickname,
        password
      } = this.state;
      const {
        room,
        joinRoom
      } = this.props;
      joinRoom(nickname, room, password);
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
    var hasErrors = (this.props.error !== undefined && this.props.error !== "");
    var errors = hasErrors ? (<p className="error" >{this.props.error}</p>) : "";
    return (
      <div>
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
    );
  }
});

export default connect(
  state => ({
    error: state.error
  }),
  {
    joinRoom
  }
)(RoomForm);