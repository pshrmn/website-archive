import React from "react";
import io from "socket.io";
import GameBoard from "./games";

var UI = React.createClass({
  getInitialState: function() {
    return {
      room: undefined
    };
  },
  componentWillMount: function() {
    /*
    create the socket and set any events to listen for
    */
    this.socket = io();
    var _this = this;

    this.socket.on("joined", function(resp){
      console.log("joined", resp);
      _this.setState({
        formErrors: resp.reason
      });
    });

    this.socket.on("left", function(msg) {
      console.log("left", msg);
      _this.setState({
        room: undefined,
        player: undefined,
        game: undefined
      });
    });

    this.socket.on("roomState", function(state){
      console.log("roomState", state);
      _this.setState({
        room: state.room,
        player: state.player
      });
    });

    this.socket.on("gameState", function(game){
      console.log("gameState", game);
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
      <RoomForm onMsg={this.sendMessage}
            errors={this.state.formErrors} />
      ) : (
      <Room onMsg={this.sendMessage}
          game={this.state.game}
          {...this.state.room} />
      );
    return (
      <div className="ui">
      { room }
      </div>
    );
  }
});

var RoomForm = React.createClass({
  getInitialState: function() {
    return {
      nickname: "",
      room: "",
      password: "",
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
      this.props.onMsg("join", this.state);
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
          <label htmlFor="password">Password</label>
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

var Room = React.createClass({
  leaveRoom: function(event){ 
    this.props.onMsg("leave", {
      room: this.props.name
    });
  },
  signalReady: function(event){
    this.props.onMsg("ready", {});
  },
  render: function() {
    /*
    props: 
      name
      people
        spectators
        players
        you
      gameState
        playing
        setup
          currentGame
          gameChoices
      game
      onMsg
    */
    var you = this.props.people.you;
    var readyText = (you && you.ready) ? "Not Ready" : "Ready";
    return (
      <div className="room">
      <div className="room-info">
        <h2>{this.props.name}</h2>
        <div className="controls">
          <button onClick={this.leaveRoom}>Leave Room</button>
          <button onClick={this.signalReady}>
            {readyText}
          </button>
        </div>
        <ScoreBoard {...this.props.people} />
      </div>
      <GameBoard onMsg={this.props.onMsg}
                 game={this.props.game}
                 you={this.props.people.you}
                 {...this.props.gameState} />
      </div>
    );
  }
});

var ScoreBoard = React.createClass({
  _spectatorsHTML: function() {
    var spectators = this.props.spectators.map(function(person, index){
      var you = person.name === this.props.you.name;
      return (
        <Person key={index}
                you={you}
                {...person} />
      );
    }, this);
    return (
      <div className="spectators">
        <p>Spectators ({this.props.spectators.length})</p>
        <ul>
          {spectators}
        </ul>
      </div>
    );
  },
  _playersHTML: function() {
    var players = this.props.players.map(function(person, index){
      var you = person.name === this.props.you.name;
      return (
        <Person key={index}
                you={you}
                {...person} />
      );
    }, this);
    return (
      <div className="players">
        <p>Players ({this.props.players.length})</p>
        <ul>
          {players}
        </ul>
      </div>
    );
  },
  render: function() {
    var spectators = this._spectatorsHTML();
    var players = this._playersHTML();
    return (
      <div className="scoreboard">
        {spectators}
        {players}
      </div>
    );
  }
});

var Person = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    return (nextProps.name !== this.props.name ||
      nextProps.owner !== this.props.owner ||
      nextProps.ready !== this.props.ready );
  },
  _userSymbols: function() {
    var owner = this.props.owner ? (
      <span title="owner">{String.fromCharCode(9818)}</span>
    ) : "";
    return (
      <div className="symbols">
      {owner}
      </div>
    );
  },
  render: function() {
  var readyClass = this.props.ready ? "ready green" : "ready gray";
  var symbols = this._userSymbols();
  var youClass = this.props.you ? "person you" : "person";
  return (
    <li className={youClass}>
      <div className={readyClass}></div>
      {this.props.name}
      {symbols} - {this.props.wins}
    </li>
  );
  }
});

React.render(
  <UI />,
  document.getElementById("content")
);
