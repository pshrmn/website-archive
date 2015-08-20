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

    this.socket.on("join", function(resp){
      _this.setState({
        formErrors: resp.reason
      });
      console.log(resp);
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
      this.props.onMsg("join room", this.state);
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
        React.createElement("h2", null, this.props.name), 
        people
      )
    )
  }
})

React.render(
  React.createElement(UI, null),
  document.getElementById("content")
)