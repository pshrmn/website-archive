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

    this.socket.on("joined", function(resp){
      _this.setState({
        formErrors: resp.reason
      });
    });

    this.socket.on("left", function(msg) {
      _this.setState({
        room: undefined
      });
      console.log("got it");
    });

    this.socket.on("start game", function(msg){
      console.log(msg);
    });
  },
  sendMessage: function(type, msg) {
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
  signalReady: function(event){
    this.props.onMsg("ready", {
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
          <button onClick={this.signalReady}>Ready!</button>
          <button onClick={this.leaveRoom}>Leave Room</button>
        </div>
        {people}
      </div>
    )
  }
})

React.render(
  <UI />,
  document.getElementById("content")
)