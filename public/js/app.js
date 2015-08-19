var UI = React.createClass({displayName: "UI",
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
        React.createElement(RoomForm, {socket: this.socket})
      );
    } else {
      room = (
        React.createElement(RoomInfo, React.__spread({},  this.state.room))
      );
    }
    return (
      React.createElement("div", {className: "ui"}, 
         room 
      )
    );
  }
});


var RoomForm = React.createClass({displayName: "RoomForm",
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
        React.createElement("label", {key: index}, 
          game, 
          React.createElement("input", {type: "radio", name: "game", 
                 value: game, 
                 onChange: this.setGame})
        )
      )
    }, this);
    return (
      React.createElement("div", null, 
        React.createElement("form", {id: "login-form"}, 
          React.createElement("p", null, 
            React.createElement("label", {for: "nickname"}, "Nickname"), 
            React.createElement("input", {type: "text", id: "nickname", 
                   value: this.state.nickname, 
                   onChange: this.setNickname})
          ), 
          React.createElement("p", null, 
            React.createElement("label", {for: "room"}, "Room"), 
            React.createElement("input", {type: "text", id: "room", 
                   value: this.state.room, 
                   onChange: this.setRoom})
          ), 
          React.createElement("p", null, 
            React.createElement("label", {for: "password"}, "Password"), 
            React.createElement("input", {type: "password", id: "password", 
                   value: this.state.password, 
                   onChange: this.setPassword})
          ), 
          React.createElement("p", null, 
            React.createElement("button", {onClick: this.joinRoom}, "Join Room")
          ), 
          React.createElement("p", null, 
            "Which game do you want to play? (Only the person creating the room needs to select this)"
          ), 
          React.createElement("p", null, 
            games
          ), 
          React.createElement("p", null, 
            React.createElement("button", {onClick: this.makeRoom}, "Make Room")
          )
        )
      )
    );
  }
});

var RoomInfo = React.createClass({displayName: "RoomInfo",
  _peopleHTML: function() {
    var people = this.props.players.map(function(person, index){
      return (
        React.createElement("li", {key: index}, person)
      );
    });
    return (
      React.createElement("ul", null, 
        people
      )
    );
  },
  render: function() {
    var people = this._peopleHTML();
    return (
      React.createElement("div", {className: "room"}, 
        React.createElement("h2", null, this.props.room), 
        React.createElement("h3", null, "Player ", this.props.game), 
        people
      )
    )
  }
})

React.render(
  React.createElement(UI, null),
  document.getElementById("content")
)