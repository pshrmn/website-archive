import React from 'react';
import { connect } from 'react-redux';

import { joinRoom } from '../actions';

function InputP(props) {
  const {
    id,
    name,
    value,
    type = 'text',
    update
  } = props;
  return (
    <p>
      <label htmlFor={id}>{name}</label>
      <input type={type} id='nickname'
             value={value}
             onChange={event => update(event.target.value)} />
    </p>
  );
}

/*
 * This is similar to the JoinRoomForm, but the user is already 'in'
 * the room, so the name doesn't have to be provided.
 */
const SpecificRoomForm = React.createClass({
  getInitialState: function() {
    return {
      nickname: '',
      password: ''
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return (nextState.nickname !== this.state.nickname ||
      nextState.password !== this.state.password ||
      nextProps.error !== this.props.error );
  },
  _formComplete: function() {
    return (this.state.nickname !== '' && this.state.password !== '');
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
  render: function() {
    var hasErrors = (this.props.error !== undefined && this.props.error !== '');
    var errors = hasErrors ? (<p className='error' >{this.props.error}</p>) : '';
    return (
      <div className='login-form'>
        <h2>{this.props.room}</h2>
        <form>
          {errors}
          <InputP id='nickname'
                  name='Nickname'
                  value={this.state.nickname}
                  update={ nickname => { this.setState({nickname});} } />
          <InputP id='password'
                  name='Room Password'
                  value={this.state.password}
                  type='password'
                  update={ password => { this.setState({password});} } />
          <p>
            <button onClick={this.joinRoom}>Join Room</button>
          </p>
        </form>
      </div>
    );
  }
});

/*
 * This is similar to the JoinRoomForm, but the user is already 'in'
 * the room, so the name doesn't have to be provided.
 */
const GeneralRoomForm = React.createClass({
  getInitialState: function() {
    return {
      nickname: '',
      password: ''
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return (nextState.nickname !== this.state.nickname ||
      nextState.room !== this.state.room ||
      nextState.password !== this.state.password ||
      nextProps.error !== this.props.error );
  },
  _formComplete: function() {
    return (this.state.nickname !== '' && this.state.room !== '' && this.state.password !== '');
  },
  joinRoom: function(event) {
    event.preventDefault();
    if ( this._formComplete() ) {
      const {
        nickname,
        password,
        room
      } = this.state;
      this.props.joinRoom(nickname, room, password);
    }
  },
  render: function() {
    var hasErrors = (this.props.error !== undefined && this.props.error !== '');
    var errors = hasErrors ? (<p className='error' >{this.props.error}</p>) : '';
    return (
      <div className='login-form'>
        <h2>{this.props.room}</h2>
        <form>
          {errors}
          <InputP id='nickname'
                  name='Nickname'
                  value={this.state.nickname}
                  update={ nickname => { this.setState({nickname});} } />
          <InputP id='room'
                  name='Room'
                  value={this.state.room}
                  update={ room => { this.setState({room});} } />
          <InputP id='password'
                  name='Room Password'
                  value={this.state.password}
                  type='password'
                  update={ password => { this.setState({password});} } />
          
          <p>
            <button onClick={this.joinRoom}>Join Room</button>
          </p>
        </form>
      </div>
    );
  }
});

const connectForm = connect(
  state => ({
    error: state.error
  }),
  {
    joinRoom
  }
);

export const LoginForm = connectForm(GeneralRoomForm);
export const RoomLoginForm = connectForm(SpecificRoomForm);
