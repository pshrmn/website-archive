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
        player: undefined,
        game: undefined
      });
    });

    this.socket.on("gameState", function(game){
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
              gameInfo={this.props.gameInfo}
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
      <div>
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
      owner, players, you
    game
      playing, gameChoices, currentGame
    */
    var you = this.props.people.you;
    var readyText = (you && you.ready) ? "Not Ready" : "Ready";
    var isOwner = you && (you.name === this.props.people.owner);
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
                   isOwner={isOwner}
                   {...this.props.gameInfo} />
      </div>
    );
  }
});

var ScoreBoard = React.createClass({
    _peopleHTML: function() {
    var people = this.props.players.map(function(person, index){
      var owner = person.name === this.props.owner;
      var you = person.name === this.props.you;
      return (
        <li key={index}>
          <Person name={person.name}
                  ready={person.ready}
                  owner={owner}
                  you={you} />
        </li>
      );
    }, this);
    return (
      <div className="players">
        <p>Players ({this.props.players.length}/{this.props.max})</p>
        <ul>
          {people}
        </ul>
      </div>
    );
  },
  render: function() {
    var people = this._peopleHTML();
    return (
      <div className="scoreboard">
        {people}
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
  markOwner: function() {
    // a bit convoluted, but I didn't want to actually have the crown symbol
    // in the source code
    function crown() {
      return {__html: "&#9818"};
    }
    return this.props.owner ? (
      <div className="owner" dangerouslySetInnerHTML={crown()} />
    ) : "";
  },
  render: function() {
    var readyClass = this.props.ready ? "ready green" : "ready gray";
    var owner = this.markOwner();
    return (
      <div className="person">
        <div className={readyClass}></div>
        {owner}
        {this.props.name}
        {this.props.you ? "(you)" : ""}
      </div>
    );
  }
});

React.render(
  <UI />,
  document.getElementById("content")
);