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
        React.createElement(RoomForm, {onMsg: this.sendMessage, 
                  errors: this.state.formErrors})
      );
    } else {
      room = (
        React.createElement(RoomInfo, React.__spread({onMsg: this.sendMessage}, 
                  this.state.room))
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
  signalReady: function(event){
    this.props.onMsg("ready", {
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
          React.createElement("button", {onClick: this.signalReady}, "Ready!"), 
          React.createElement("button", {onClick: this.leaveRoom}, "Leave Room")
        ), 
        people
      )
    )
  }
})

React.render(
  React.createElement(UI, null),
  document.getElementById("content")
)