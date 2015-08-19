var UI = React.createClass({
  getInitialState: function() {
    return {
      room: undefined
    };
  },
  componentWillMount: function() {
    this.socket = io();
    var _this = this;
    this.socket.on("info", function(room){
      _this.setState({
        room: room
      });
    });

    this.socket.on("room joined", function(resp){
      console.log(resp);
    });
  },
  render: function() {
    var room;
    // when not connected to a room, show the join room form
    // otherwise show the room ui
    if ( this.state.room === undefined ) {
      room = (
        <RoomForm socket={this.socket} />
      );
    } else {
      room = (
        <RoomInfo {...this.state.room} />
      );
    }
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
      game: ""
    }
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return (nextState.nickname !== this.state.nickname ||
      nextState.room !== this.state.room ||
      nextState.password !== this.state.password ||
      nextState.game !== this.state.game);
  },
  _formComplete: function(needGame) {
    var personComplete = (this.state.nickname !== "" &&
        this.state.room !== "" && this.state.password !== "");
    var gameComplete = needGame ? this.state.game !== "" : true;
    return personComplete && gameComplete;
  },
  makeRoom: function(event) {
    event.preventDefault();
    if ( this._formComplete(true) ) {
      this.props.socket.emit("create room", this.state);
      this.setState({
        nickname: "",
        room: "",
        password: "",
        game: ""
      });
    }
  },
  joinRoom: function(event) {
    event.preventDefault();
    if ( this._formComplete(false) ) {
      this.props.socket.emit("join room", this.state);

    }
  },
  setGame: function(event) {
    this.setState({
      game: event.target.value
    })
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
    var gamesList = ["tic-tac-toe"];
    var games = gamesList.map(function(game, index){
      return (
        <label key={index}>
          {game}
          <input type="radio" name="game"
                 value={game}
                 onChange={this.setGame} />
        </label>
      )
    }, this);
    return (
      <div>
        <form id="login-form">
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
          <p>
            Which game do you want to play? (Only the person creating the room needs to select this)
          </p>
          <p>
            {games}
          </p>
          <p>
            <button onClick={this.makeRoom}>Make Room</button>
          </p>
        </form>
      </div>
    );
  }
});

var RoomInfo = React.createClass({
  _peopleHTML: function() {
    var people = this.props.players.map(function(person, index){
      return (
        <li key={index}>{person}</li>
      );
    });
    return (
      <ul>
        {people}
      </ul>
    );
  },
  render: function() {
    var people = this._peopleHTML();
    return (
      <div className="room">
        <h2>{this.props.room}</h2>
        <h3>Player {this.props.game}</h3>
        {people}
      </div>
    )
  }
})

React.render(
  <UI />,
  document.getElementById("content")
)