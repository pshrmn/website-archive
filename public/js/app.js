var UI = React.createClass({displayName: "UI",
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
        React.createElement(RoomForm, {onMsg: this.sendMessage, 
                  errors: this.state.formErrors})
      );
    } else {
      room = (
        React.createElement(RoomInfo, React.__spread({onMsg: this.sendMessage}, 
                  this.state.room))
      );
    }

    var player = this.state.player === undefined ? "" : (
      React.createElement(PlayerInfo, React.__spread({onMsg: this.sendMessage}, 
                  this.state.player))
    );

    var game = this.state.game === undefined ? "" : (
      React.createElement(TicTacToe, React.__spread({onMsg: this.sendMessage}, 
                 this.state.game))
    );
    return (
      React.createElement("div", {className: "ui"}, 
         player, 
         room, 
         game 
      )
    );
  }
});


var Game = React.createClass({displayName: "Game",
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("p", null, this.props.name), 
        React.createElement("p", null, 
          "This is the game. You're playing this game. Isn't it fun?"
        )
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
    var errors = hasErrors ? (React.createElement("p", {className: "error"}, "Error: ", this.props.errors)) : "";
    return (
      React.createElement("div", null, 
        React.createElement("form", {id: "login-form"}, 
          errors, 
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
          )
        )
      )
    );
  }
});

var RoomInfo = React.createClass({displayName: "RoomInfo",
  _peopleHTML: function() {
    var people = this.props.players.map(function(person, index){
      var readyClass = person.ready ? "ready green" : "ready gray";
      return (
        React.createElement("li", {key: index}, 
          React.createElement("div", {className: readyClass}), 
          person.name
        )
      );
    });
    return (
      React.createElement("ul", null, 
        people
      )
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
      React.createElement("div", {className: "room"}, 
        React.createElement("h2", null, this.props.name), 
        React.createElement("h3", null, "Run By: ", this.props.owner), 
        React.createElement("div", {className: "controls"}, 
          React.createElement("button", {onClick: this.leaveRoom}, "Leave Room")
        ), 
        people
      )
    )
  }
})

var PlayerInfo = React.createClass({displayName: "PlayerInfo",
  signalReady: function(event){
    this.props.onMsg("ready", {});
  },
  render: function() {
    var readyText = this.props.ready ? "Not Ready" : "Ready";
    var readyClass = this.props.ready ? "ready green" : "ready gray";
    var readyButton = this.props.playing ? "" : (
      React.createElement("button", {onClick: this.signalReady}, readyText)
    );
    return (
      React.createElement("div", null, 
        React.createElement("div", {className: readyClass}), 
        this.props.name, 
        readyButton
      )
    );
  }
})

React.render(
  React.createElement(UI, null),
  document.getElementById("content")
)