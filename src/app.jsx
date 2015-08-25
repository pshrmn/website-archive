var UI = React.createClass({
  getInitialState: function() {
    return {
      room: undefined
    };
  },
  componentWillMount: function() {
    this.socket = io();
    var _this = this;
    this.socket.on("info", function(info){
      _this.setState({
        room: info.room,
        player: info.player
      });
    });

    this.socket.on("joined", function(resp){
      _this.setState({
        formErrors: resp.reason
      });
    });

    this.socket.on("left", function(msg) {
      _this.setState({
        room: undefined,
        player: undefined
      });
    });

    this.socket.on("gameState", function(game){
      _this.setState({
        game: game
      })
    });
  },
  /*
   * takes a message and sends it to the server
   * appends the name of the room for room specific commands
   * because of that, msg has to be an object
   */
  sendMessage: function(type, msg) {
    if ( this.state.room ) {
      msg.room = this.state.room.name
    };
    this.socket.emit(type, msg);
  },
  render: function() {
    var room;
    // when not connected to a room, show the join room form
    // otherwise show the room ui
    if ( this.state.room === undefined ) {
      room = (
        <RoomForm onMsg={this.sendMessage}
                  errors={this.state.formErrors} />
      );
    } else {
      room = (
        <RoomInfo onMsg={this.sendMessage}
                  {...this.state.room} />
      );
    }

    var player = this.state.player === undefined ? "" : (
      <PlayerInfo onMsg={this.sendMessage}
                  {...this.state.player} />
    );

    var game = this.state.game === undefined ? "" : (
      <TicTacToe onMsg={this.sendMessage}
                 {...this.state.game} />
    );
    return (
      <div className="ui">
        { player }
        { room }
        { game }
      </div>
    );
  }
});


var Game = React.createClass({
  render: function() {
    return (
      <div>
        <p>{this.props.name}</p>
        <p>
          This is the game. You're playing this game. Isn't it fun?
        </p>
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
    }
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
    })
  },
  setRoom: function(event) {
    this.setState({
      room: event.target.value
    })
  },
  setPassword: function(event) {
    this.setState({
      password: event.target.value
    })
  },
  render: function() {
    var hasErrors = (this.props.errors !== undefined && this.props.errors !== "");
    var errors = hasErrors ? (<p className="error" >Error: {this.props.errors}</p>) : "";
    return (
      <div>
        <form id="login-form">
          {errors}
          <p>
            <label for="nickname">Nickname</label>
            <input type="text" id="nickname"
                   value={this.state.nickname}
                   onChange={this.setNickname} />
          </p>
          <p>
            <label for="room">Room</label>
            <input type="text" id="room"
                   value={this.state.room}
                   onChange={this.setRoom} />
          </p>
          <p>
            <label for="password">Password</label>
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

var RoomInfo = React.createClass({
  _peopleHTML: function() {
    var people = this.props.players.map(function(person, index){
      var readyClass = person.ready ? "ready green" : "ready gray";
      return (
        <li key={index}>
          <div className={readyClass}></div>
          {person.name}
        </li>
      );
    });
    return (
      <ul>
        {people}
      </ul>
    );
  },
  leaveRoom: function(event){ 
    this.props.onMsg("leave", {
      room: this.props.name
    });
  },
  render: function() {
    var people = this._peopleHTML();
    return (
      <div className="room">
        <h2>{this.props.name}</h2>
        <h3>Run By: {this.props.owner}</h3>
        <div className="controls">
          <button onClick={this.leaveRoom}>Leave Room</button>
        </div>
        {people}
      </div>
    )
  }
})

var PlayerInfo = React.createClass({
  signalReady: function(event){
    this.props.onMsg("ready", {});
  },
  render: function() {
    var readyText = this.props.ready ? "Not Ready" : "Ready";
    var readyClass = this.props.ready ? "ready green" : "ready gray";
    var readyButton = this.props.playing ? "" : (
      <button onClick={this.signalReady}>{readyText}</button>
    );
    return (
      <div>
        <div className={readyClass}></div>
        {this.props.name}
        {readyButton}
      </div>
    );
  }
})

React.render(
  <UI />,
  document.getElementById("content")
)